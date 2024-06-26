import * as React from "react";

import { Typography, Button, Tooltip, IconButton, LinearProgress } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import "../assets/utils.css";
import { styles } from "../styles";
import { COLORS, THEME } from "../constants";
import { db } from "../api/firebase";
import { AndroidSwitch } from "./androidSwitch";
import { DocumentReference, doc } from "firebase/firestore";
import { moduleType, objWithId, programType } from "../types";
import { StyledInput } from "../support";

function StudentProgram({...props}) {
    let {style, className, id, name, modules, notification, loading, score, selectedModule, setSelectedModule, ...rest} = props;

    modules = modules as objWithId<moduleType>[]

    return (
        <div style={{...style, width: "calc(100% - 225px)", margin: "85px 0 0 225px"}} className={`flex column align-center ${className || ""}`}>
            <Typography style={{fontSize: THEME.FONT.HEADING, color: THEME.DOMINANT, marginBottom: 10}}>{name}</Typography>
            <div className="flex align-center justify-between" style={{width: "50%"}}>
                <LinearProgress 
                    variant="determinate" 
                    value={score*100} 
                    sx={{
                        width: "calc(100% - 50px)", 
                        margin: "10px 0 10px 0",
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: THEME.DOMINANT
                        }, 
                        backgroundColor: THEME.BACKGROUND_ACCENT_2
                    }}
                />
                <Typography style={{fontSize: THEME.FONT.PARAGRAPH, color: THEME.DOMINANT}}>{score*100} %</Typography>
            </div>
            <div className="flex align-center justify-center" style={{width: "80%", marginTop: 30}}>
                {modules.map((([id, module]: [string, moduleType], i: number) => 
                    <ProgramModuleButton 
                        id={id}   
                        key={id} 
                        module={module}
                        onClick={() => setSelectedModule(i)}
                    />
                ))}
            </div>
        </div>
    )
}

export default StudentProgram;

function ProgramModuleButton({...props}) {
    let {style, className, module, id, ...rest} = props;
    module = module as moduleType;

    return (
        <Button 
            {...rest}
            className="flex column align-center"
            sx={{...styles.navigationButton(true, 100, 100, THEME.FONT.PARAGRAPH, true)}} 
        >
            <MenuBookIcon style={{width: 30, height: 30, marginBottom: 10}}/>
            <Tooltip title={module.name}>
                <Typography className="text-overflow-ellipsis overflow-auto width-100" fontSize={THEME.FONT.PARAGRAPH} color={COLORS.WHITE}>{module.name}</Typography>
            </Tooltip>
        </Button>
    )
}