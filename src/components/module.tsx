import * as React from "react";

import { Container } from "react-bootstrap";
import { Button, Stepper, Step, StepLabel, Typography, IconButton } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import "../assets/utils.css";
import EvolveStep from "./step";
import { styles } from "../styles";
import { THEME } from "../constants";
import { contentType, moduleType, stepType } from "../types";
import { QontoConnector, QontoStepIcon } from "./qontoConnector";
import { StyledInput } from "../support";


function Module({...props}) {
    let {style, className, module, updateModule, saveModule, isCoach, studentId, edited, setEdited, ...rest} = props;
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
        setEdited(true); 
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

    return (
        <div style={{...style, width: "calc(100% - 225px)", margin: "85px 0 0 225px"}} className={`flex column align-center ${className || ""}`}>
            <div className="relative text-center" style={{width: "80%"}}>
                <div className="flex align-center justify-center" style={{marginBottom: 10}}>
                    <StyledInput 
                        disabled={!edit} 
                        value={module?.name}
                        onChange={updateName}
                        placeholder={`Module name`}
                        style={{...styles.title(edit), color: THEME.DOMINANT}} 
                    />
                    {!studentId? 
                        !edit?
                            <IconButton onClick={() => { setEdit(true);}}>
                                <EditIcon style={{marginTop: -4}}/>
                            </IconButton>
                            :
                            <IconButton onClick={() => {if (edited) {saveModule(); setEdited(false)} setEdit(false);}}>
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
                        <Step key={`step-${i}`} onClick={() => setSelectedStep(i)} className="pointer">
                            <StepLabel StepIconComponent={QontoStepIcon}>{step.name}</StepLabel>
                        </Step>
                        
                    )}
                </Stepper>
            </div>
            {module?.steps?.length? <EvolveStep step={module.steps[selectedStep]} updateStep={updateStep} edit={edit} studentId={studentId} isCoach={isCoach}/> : <></>}
        </div>
    )
}

export default React.memo(Module);
