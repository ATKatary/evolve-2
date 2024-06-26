import * as React from "react";

import { Container } from "react-bootstrap";
import { Button, Stepper, Step, StepLabel, Typography, IconButton, StepButton } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import "../assets/utils.css";
import TaskStep from "./taskStep";
import { styles } from "../styles";
import { THEME } from "../constants";
import { contentType, moduleType, stepType, studentProgressType } from "../types";
import { QontoConnector, QontoStepIcon } from "./qontoConnector";
import { StyledInput } from "../support";
import CheckInStep from "./checkInStep";


function Module({...props}) {
    let {style, notification, className, id, module, updateModule, saveModule, isCoach, studentId, edited, setEdited, deleteModule, student, studentCheckedIn, studentProgress, ...rest} = props;
    module = module as moduleType;

    const [edit, setEdit] = React.useState<boolean>(false);
    const [selectedStep, setSelectedStep] = React.useState<number>(0);

    React.useEffect(() => {
        if (studentId) {
            setEdit(false);
        }
    }, [studentId])

    const updateStep = (step: stepType) => {
        // console.log("[Module][updateStep] (step) >>", step);
        if (setEdited) setEdited(true); 
        updateModule({
            ...module,
            steps: module?.steps?.map((moduleStep: stepType, i: number) => 
                i === selectedStep? step : moduleStep
            )
        });
    }

    const updateName = (name: string) => {
        updateModule({...module, name: name})
    }

    const canAccessStep = (i: number) => {
        if (i === 0 || isCoach) return true;
        if (i === 1 && !isCoach) {
            notification?.setNotification({message: "Please wait for your coach to check you off.", notify: true})
            return false;
        }

        if (module.steps.length && studentProgress) {
            if (studentProgress >= i / module.steps.length) {
                return true;
            }
            notification?.setNotification({message: `You must complete the ${module.steps[i - 1].name} to access ${module.steps[i].name}.`, notify: true})
            return false;
        }
        return false
    }

    return (
        <div style={{...style, width: "calc(100% - 225px)", margin: "85px 0 0 225px"}} className={`flex column align-center ${className || ""}`}>
            <div className="relative text-center" style={{width: "80%"}}>
                <div className={`flex align-center ${studentId? "justify-center" : "justify-end"}`} style={{marginBottom: 10}}>
                    <StyledInput 
                        disabled={!edit} 
                        value={module?.name}
                        onChange={updateName}
                        placeholder={`Module name`}
                        style={{...styles.title(edit, studentId && !isCoach? 1 : undefined), color: THEME.DOMINANT, width: `calc(100% - ${!studentId? 172 : 0}px)`}} 
                    />
                    {!studentId? 
                        <>
                        {!edit?
                            <IconButton onClick={() => {setEdit(true);}}>
                                <EditIcon style={{marginTop: -4}}/>
                            </IconButton>
                            :
                            <IconButton onClick={() => {if (edited) {saveModule(); setEdited(false)} setEdit(false);}}>
                                <SaveIcon style={{marginTop: -4}}/>
                            </IconButton>
                        }
                        <IconButton sx={{...styles.deleteContentButton(true)}} onClick={deleteModule}>
                            <DeleteIcon style={{width: 25, height: 25}}/>
                        </IconButton>
                        </>
                        : 
                        !isCoach?
                            <IconButton onClick={() => {if (edited) {saveModule(); setEdited(false)}}}>
                                <SaveIcon style={{marginTop: -4}}/>
                            </IconButton>
                        : <></>
                    }
                </div>
                <Stepper 
                    alternativeLabel 
                    activeStep={selectedStep} 
                    connector={<QontoConnector />} 
                >
                    {module?.steps.map((step: stepType, i: number) => 
                        <Step key={`step-${i}`} onClick={() => canAccessStep(i)? setSelectedStep(i) : null}>
                            <StepLabel StepIconComponent={QontoStepIcon}>{step.name}</StepLabel>
                        </Step>
                        
                    )}
                </Stepper>
            </div>
            {module?.steps?.length? 
                module.steps[selectedStep].name === "Check-In"? 
                        <CheckInStep 
                            edit={edit} 
                            isCoach={isCoach}
                            student={student}
                            studentId={studentId} 
                            updateStep={updateStep} 
                            step={module.steps[selectedStep]} 
                            checkInCode={getCheckedInCode(id, student?.progress)} 
                            studentCheckedIn={(checked: boolean) => studentCheckedIn(id, checked)}
                        />
                        :
                        <TaskStep 
                            edit={edit} 
                            isCoach={isCoach}
                            studentId={studentId} 
                            updateStep={updateStep} 
                            step={module.steps[selectedStep]} 
                        />
                : <></>
            }
        </div>
    )
}

export default React.memo(Module);

function getCheckedInCode(moduleId: string, progress: studentProgressType[]) {
    let code = 404 // student is not assigned module
    console.log(progress)
    if (!moduleId || !progress) return code;
    for (const module of progress) {
        if (module.id === moduleId) {
            if (!module.children || module.children.length < 2) code = 403  // something is very wrong
            else if (module.children[1].progress === 1) code = 201 // already checked off
            else if (module.children[0].progress === 1) code = 200 // ready for check off
            else code = 400 // not yet ready for checkoff
            break;
        }
    }

    return code;
}