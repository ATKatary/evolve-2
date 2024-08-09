import * as React from "react";

import { FetchResult, MutationFunctionOptions, useQuery } from "@apollo/client";

import { GET_STEP } from "../queries";
import { convertDataToHtml, useCustomState } from "../utils";
import { interfaceStateType } from "../types";
import { GenericClass } from "./genericClass";
import { StepInterface } from "../interfaces";
import { responseType, stepType } from "../types/program";
import { studentType } from "../types/user";
import { sendEmail } from "../api/evolve";

export class Step extends GenericClass<stepType> implements StepInterface {
    async save(
        updateStep: (options?: MutationFunctionOptions) => Promise<FetchResult<any>>,
        updateEntry: (options?: MutationFunctionOptions) => Promise<FetchResult<any>>,
    ) {
        if (!this.obj) return;

        await updateStep({variables: {id: this.id, displayMode: this.obj.displayMode}})
        for (const entry of this.obj.entries) {
            await updateEntry({variables: {id: entry.id, data: JSON.stringify(entry.data || "")}})
        }
    }

    async saveResponses(
        respondEntry: (options?: MutationFunctionOptions) => Promise<FetchResult<any>>, 
        sid: string
    ) {
        if (!this.obj) return;
        for (const entry of this.obj.entries) {
            for (const response of entry.responses) {
                await respondEntry({variables: {id: entry.id, sid: sid, data: JSON.stringify(response.data)}})
            }
        }
    }

    respond(eid: String, sid: String, data: any) {
        if (!this.obj) return;
        const entry = this.obj.entries.find(entry => entry.id === eid);

        if (!entry) return;
        let response = entry.responses.find(response => response.student.id === sid);

        const responses: responseType[] = entry.responses.map(response => ({...response, data:  response.student.id === sid? data : response?.data}));
        if (!response) {
            responses.push({student: {id: sid}, data: data} as responseType)
        }

        this.setObj({
            ...this.obj, 
            entries: this.obj.entries.map(entry => entry.id === eid? {...entry, responses: responses} : entry)
        })
    }

    async sendFeedback(student: studentType) {
        if (!this.obj) return;
        const emails = this.obj.entries.filter(entry => entry.type === "email");

        console.log(emails)
        for (const email of emails) {
            if (email.data.sendOnComplete) {
                if (email.data.sendToParent) {
                    await sendEmail({
                        to: [student.parentalEmail],
                        message: {
                            subject: email.data.subject,
                            html: convertDataToHtml(email.data.html.blocks)
                        }
                    }, 1)
                } else {
                    await sendEmail({
                        to: [student.email],
                        message: {
                            subject: email.data.subject,
                            html: convertDataToHtml(email.data.html.blocks)
                        }
                    }, 1)
                }
            }
        }
    }
}

export function useStep(id?: string) {
    const step = new Step(id || null);
    
    [step.obj, step.setObj] = React.useState<stepType | null>(null);
    [step.state, step.setState] = useCustomState<interfaceStateType>({});
    [step.id, step.setId] = React.useState<string | null>(id || null);

    const { error, refetch } = useQuery(GET_STEP, {skip: true});

    React.useEffect(() => {
        if (!step.state.initialized) {
            step.setState({initialized: true});
            const getStepWrapper = async () => {
                if (id) {
                    step.setId(id);
                    const loadedStep = (await refetch({id: id})).data.step as stepType
                    
                    step.setObj({
                        ...loadedStep, 
                        entries: loadedStep.entries.map(
                            entry => !entry.data? entry : ({
                                ...entry, 
                                data: JSON.parse(entry.data),
                                responses: entry.responses.map(response => ({
                                    ...response, 
                                    data: JSON.parse(response.data)
                                }))
                            })
                    )});
                }
            }
            getStepWrapper()
        }
    }, [step.state])

    React.useEffect(() => {
        if (id !== step.id) {
            step.setState({initialized: false});
        }
    }, [id]) 

    return {step}
}

