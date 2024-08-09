import * as React from "react";
import { useQuery, useSubscription } from "@apollo/client";

import { GET_PROGRAM } from "../queries";
import { useCustomState } from "../utils";
import { interfaceStateType } from "../types";
import { GenericClass } from "./genericClass";
import { programType } from "../types/program";
import { ProgramInterface } from "../interfaces";
import { WATCH_PROGRAM } from "../subscriptions";

export class Program extends GenericClass<programType> implements ProgramInterface {}

export function useProgram(id?: string) {
    const program = new Program(id || null);
    
    [program.obj, program.setObj] = React.useState<programType | null>(null);
    [program.state, program.setState] = useCustomState<interfaceStateType>({});
    [program.id, program.setId] = React.useState<string | null>(id || null);

    const { error, refetch } = useQuery(GET_PROGRAM, {skip: true});
    const programSubscription = useSubscription(WATCH_PROGRAM, {variables: {id: id}});

    React.useEffect(() => {
        if (!program.state.initialized) {
            program.setState({initialized: true});
            const getProgramWrapper = async () => {
                if (id) {
                    program.setId(id);
                    const loadedProgram = (await refetch({id: id})).data.program as programType
                    program.setObj(loadedProgram);
                }
            }
            getProgramWrapper()
        }
    }, [program.state])

    React.useEffect(() => {
        if (programSubscription?.data) {
            console.log("[Program][useProgram] (program) >>", programSubscription?.data.watchProgram)
            program.setObj(programSubscription.data.watchProgram)
        }
    }, [programSubscription.data])

    React.useEffect(() => {
        if (id !== program.id) {
            program.setState({initialized: false});
        }
    }, [id]) 

    return {program}
}

