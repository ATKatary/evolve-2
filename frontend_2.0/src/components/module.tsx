import * as React from "react";

import { useMutation } from "@apollo/client";
import { Step, StepLabel, Stepper } from "@mui/material";

import SaveIcon from '@mui/icons-material/Save';

import StepComponent from "./step";
import { ConfirmContext, LoadingContext, NotificationContext } from "..";
import { useStep } from "../classes/step";
import { ControlsArray } from "../support";
import { useModule } from "../classes/module";
import { moduleComponentPropsType } from "../types";
import { EditableHeader } from "../support/editable";
import { QontoConnector, QontoStepIcon } from "./qontoConnector";
import { CHECK_IN_MODULE, RESPOND_ENTRY, SUBMIT_MODULE, UNSUBMIT_MODULE, UPDATE_ENTRY, UPDATE_MODULE, UPDATE_STEP } from "../mutations";
import { loadAndNotify } from "../utils";
import { studentType } from "../types/user";
import { sendEmail } from "../api/evolve";

function ModuleComponent(props: moduleComponentPropsType) {
    const {sid, mid, isCoach, onDelete, ...domProps} = props;
    const {style, className, ...rest} = domProps
    
    const loading = React.useContext(LoadingContext);
    const confirm = React.useContext(ConfirmContext);
    const notification = React.useContext(NotificationContext);

    const {module} = useModule(mid);
    
    const [updateStep] = useMutation(UPDATE_STEP); 
    const [updateEntry] = useMutation(UPDATE_ENTRY);
    const [respondEntry] = useMutation(RESPOND_ENTRY);
    const [submitModule] = useMutation(SUBMIT_MODULE);
    const [checkInModule] = useMutation(CHECK_IN_MODULE);  
    const [unsubmitModule] = useMutation(UNSUBMIT_MODULE);

    const [sti, setSti] = React.useState<number>(0);
    const start = useStep(module.obj?.start.id);
    const checkIn = useStep(module.obj?.checkIn.id);
    const actionPlan = useStep(module.obj?.actionPlan.id);
    const end = useStep(module.obj?.end.id);

    const [edit, setEdit] = React.useState<boolean>(false);

    const [updateModule] = useMutation(UPDATE_MODULE);

    const submission = React.useMemo(() => module.obj?.submissions.find(submission => submission.student.id === sid), [sid, module.obj]);
    const locked = React.useMemo(() => isCoach || !submission? false : true, [isCoach, submission, module.obj]);

    const onSave = async () => {
        if (module.obj) {
            if (isCoach) {
                await module.save(updateModule);
                for (const step of [start, checkIn, actionPlan, end]) {
                    await step.step.save(updateStep, updateEntry);
                }
            } else if (sid) {
                await loadAndNotify(
                    async () => {
                        if (sid) {
                            for (const step of [start, checkIn, actionPlan, end]) {
                                await step.step.saveResponses(respondEntry, sid);
                            }
                        }
                    }, 
                    [], 
                    loading, 
                    "Saving responses...",
                    notification,
                    "Responses saved!",
                    "Failed to save responses"
                )
            }
        }
    }

    const onSubmit = React.useMemo(() => async () => {
        const student = (await submitModule({variables: {id: mid, sid: sid}})).data.submitModule.student as studentType;
        if (!isCoach && sid) {
            await sendEmail({
                to: [student.coach.email],
                message: {
                    subject: `Evolve student module submission`,
                    html: `<p>${student.name} has submitted ${module.obj?.title} start step and is ready for check-of</p>`
                }
            })
            await sendEmail({
                to: [student.email],
                message: {
                    subject: `Evolve check-in`,
                    html: `<p>Please schedule a meeting with your mentor at: ${student.coach.calendlyLink}</p>`
                }
            })

            await checkIn.step.sendFeedback(student);
        }
    }, [isCoach, sid, mid, checkIn.step.obj]) 

    const onUnsubmit = React.useMemo(() => !isCoach? undefined : async () => {
        await unsubmitModule({variables: {id: mid, sid: sid}});
    }, [isCoach, sid, mid]) 

    React.useEffect(() => {
        console.log(edit)
        if (edit) {
            console.log("setting confirm required")
            confirm?.setConfirm({required: true, editing: `${module.obj?.title}`});
        } else {
            confirm?.setConfirm({required: false, editing: undefined});
        }
    }, [edit])

    return (
        <div style={{...style}} className={`width-100 flex column align-center ${className || ""}`}>
            <EditableHeader 
                onDelete={onDelete}
                setEditProp={setEdit}
                disableEditing={!isCoach}
                title={module.obj?.title || ""} 
                onSave={isCoach? onSave : undefined}
                setTitle={(title) => {
                    if (module.obj) module?.setObj({...module.obj, title: title})
                }}
                controlsStyle={{position: "fixed", right: 100, display: sid? "none" : ""}}
                style={{marginBottom: 30}}
            >
                
                {/* {!isCoach && ((!locked && sti === 0) || sti > 1)?
                    <ControlsArray style={{position: "fixed", right: 100}}>
                        <SaveIcon onClick={async () => {
                            await loadAndNotify(
                                async () => {
                                    if (sid) {
                                        for (const step of [start, checkIn, actionPlan, end]) {
                                            await step.step.saveResponses(respondEntry, sid);
                                        }
                                    }
                                }, 
                                [], 
                                loading, 
                                "Saving responses...",
                                notification,
                                "Responses saved!",
                                "Failed to save responses"
                            )
                            
                        }}/>
                    </ControlsArray>
                    : <></>
                } */}
            </EditableHeader>
            <div className="relative text-center" style={{width: "80%"}}>
                <Stepper 
                    alternativeLabel 
                    activeStep={sti} 
                    connector={<QontoConnector />} 
                >
                    <Step onClick={() => setSti(0)}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{module.obj?.start?.title}</StepLabel>
                    </Step>
                    <Step onClick={() => isCoach || submission? setSti(1) : undefined}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{module.obj?.checkIn?.title}</StepLabel>
                    </Step>
                    <Step onClick={() => isCoach || submission?.checkedIn? setSti(2) : undefined}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{module.obj?.actionPlan?.title}</StepLabel>
                    </Step>
                    <Step onClick={() => isCoach || submission?.checkedIn? setSti(3) : undefined}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{module.obj?.end?.title}</StepLabel>
                    </Step>
                </Stepper>
                {sti === 0 && start.step? 
                    <StepComponent 
                        sid={sid} 
                        edit={edit} 
                        type="start"
                        locked={locked}
                        onSave={onSave}
                        step={start.step} 
                        isCoach={isCoach} 
                        onSubmit={onSubmit}
                        onUnsubmit={onUnsubmit}
                        submission={submission}
                    /> : <></>
                }
                {sti === 1 && checkIn.step? 
                    <StepComponent 
                        sid={sid} 
                        edit={edit} 
                        type="checkIn"
                        isCoach={isCoach} 
                        step={checkIn.step} 
                        submission={submission}
                        onCheckIn={async (event, checkedIn) => {
                            await checkInModule({variables: {id: mid, sid: sid, checkedIn: checkedIn}})
                        }}
                    /> : <></>}
                {sti === 2 && actionPlan.step? 
                    <StepComponent 
                        sid={sid} 
                        edit={edit} 
                        onSave={onSave}
                        isCoach={isCoach} 
                        type="actionPlan"
                        step={actionPlan.step} 
                    /> : <></>
                }
                {sti === 3 && end.step? 
                    <StepComponent 
                        sid={sid} 
                        type="end"
                        edit={edit} 
                        onSave={onSave}
                        step={end.step} 
                        isCoach={isCoach} 
                    /> : <></>
                }
            </div>
        </div>
    )
}


export default ModuleComponent;