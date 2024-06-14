import * as React from "react";

import { Typography, Button } from "@mui/material";

import MenuBookIcon from '@mui/icons-material/MenuBook';

import "../assets/utils.css";
import { styles } from "../styles";
import { THEME } from "../constants";
import { db } from "../api/firebase";
import { AndroidSwitch } from "./androidSwitch";
import { DocumentReference, doc } from "firebase/firestore";
import { moduleType, objWithId, programType } from "../types";

function Program({...props}) {
    let {style, className, id, program, modules, notification, loading, updateProgram, ...rest} = props;

    program = program as programType
    modules = modules as objWithId<moduleType>[]

    const [onlyProgramModules, setOnlyProgramModules] = React.useState<boolean>(true);
    const [programModules, setProgramModules] = React.useState<objWithId<moduleType>[]>(getProgramModules(modules, program))

    const onAdd = async (moduleId: string) => {
        if (!moduleId) return;
        if (program?.modules?.find((moduleRef: DocumentReference) => moduleRef.id === moduleId)) {
            return 
        }
        const moduleRef = doc(db, "modules", moduleId);
        const updatedProgram = {
            ...program, 
            modules: program?.modules? [...program.modules, moduleRef] : [moduleRef]
        }

        setProgramModules(getProgramModules(modules, updatedProgram))
        await updateProgram(updatedProgram)
    }

    const onRemove = async (moduleId: string) => {
        if (!moduleId) return;

        if (!program?.modules?.find((moduleRef: DocumentReference) => moduleRef.id === moduleId)) {
            return 
        }
        const updatedProgram = {
            ...program, 
            modules: program?.modules?.filter((moduleRef: DocumentReference) => moduleRef.id !== moduleId) || []
        }

        setProgramModules(getProgramModules(modules, updatedProgram))
        await updateProgram(updatedProgram)
    }

    return (
        <div style={{...style, width: "calc(100% - 225px)", margin: "85px 0 0 225px"}} className={`flex column align-center ${className || ""}`}>
            <div className="relative text-center" style={{width: "80%"}}>
                <Typography style={{fontSize: THEME.FONT.HEADING, color: THEME.DOMINANT, marginBottom: 10}}>{program?.name || "Unnamed Program"}</Typography>
                <AndroidSwitch 
                    defaultChecked
                    onText="Program only"   
                    offText="All modules"      
                    onChange={(on: boolean) => {setOnlyProgramModules(on)}}
                /> 
            </div>
            <div className="flex align-center justify-center" style={{width: "80%", marginTop: 30}}>
                {(onlyProgramModules? programModules : modules).map(([id, module]: [string, moduleType]) => 
                    <ProgramModuleButton 
                        id={id}   
                        key={id} 
                        onAdd={onAdd}
                        module={module} 
                        onRemove={onRemove}
                        isActive={onlyProgramModules? true : programModules.find(programModule => programModule[0] === id)}
                    />
                )}
            </div>
        </div>
    )
}

export default Program;

function ProgramModuleButton({...props}) {
    let {style, className, module, isActive, id, onRemove, onAdd, ...rest} = props;
    module = module as moduleType;

    const [active, setActive] = React.useState<boolean>(isActive);

    return (
        <Button 
            {...rest}
            className="flex column align-center"
            onClick={() => {
                console.log(id)
                if (active) onRemove(id) 
                else onAdd(id); 

                setActive(!active)
            }}
            sx={{...styles.navigationButton(active, 100, 100, THEME.FONT.PARAGRAPH, true)}} 
        >
            <MenuBookIcon style={{width: 30, height: 30, marginBottom: 10}}/>
            {module.name}
        </Button>
    )
}

function getProgramModules(modules: objWithId<moduleType>[], program: programType): objWithId<moduleType>[] {
    if (!program) return []
    return modules?.filter(module => program?.modules.find(programModule => programModule.id === module[0]))
}