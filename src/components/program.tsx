import * as React from "react";

import { Typography, Button, Tooltip, IconButton } from "@mui/material";

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

function Program({...props}) {
    let {style, className, id, program, modules, notification, loading, updateProgram, saveProgram, edited, setEdited, deleteProgram, ...rest} = props;

    program = program as programType
    modules = modules as objWithId<moduleType>[]

    const [edit, setEdit] = React.useState<boolean>(false);
    const [onlyProgramModules, setOnlyProgramModules] = React.useState<boolean>(true);
    const [programModules, setProgramModules] = React.useState<objWithId<moduleType>[]>(getProgramModules(modules, program))

    const onAdd = async (moduleId: string) => {
        setEdited(true); 
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
        setEdited(true); 
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

    const updateName = async (name: string) => {
        setEdited(true); 
        const updatedProgram = {
            ...program, 
            name: name
        }
        await updateProgram(updatedProgram)
    }

    return (
        <div style={{...style, width: "calc(100% - 225px)", margin: "85px 0 0 225px"}} className={`flex column align-center ${className || ""}`}>
            <div className="relative text-center" style={{width: "80%"}}>
                <div className={`flex align-center justify-end`} style={{marginBottom: 10}}>
                    <StyledInput 
                        disabled={!edit}
                        disableTooltip={true}
                        onChange={updateName}
                        value={program?.name}
                        placeholder={`Module name`}
                        style={{...styles.title(edit), color: THEME.DOMINANT, width: `calc(100% - 172px)`}} 
                    />
                    {!edit?
                        <IconButton onClick={() => {setEdit(true);}}>
                            <EditIcon style={{marginTop: -4}}/>
                        </IconButton>
                        :
                        <IconButton onClick={() => {if (edited) {saveProgram(); setEdited(false)} setEdit(false);}}>
                            <SaveIcon style={{marginTop: -4}}/>
                        </IconButton>
                    }
                    <IconButton sx={{...styles.deleteContentButton(true)}} onClick={deleteProgram}>
                        <DeleteIcon style={{width: 25, height: 25}}/>
                    </IconButton>
                </div>
                {/* <Typography style={{fontSize: THEME.FONT.HEADING, color: THEME.DOMINANT, marginBottom: 10}}>{program?.name || "Unnamed Program"}</Typography> */}
                <AndroidSwitch 
                    defaultChecked
                    onText="Program only"   
                    offText="All modules"     
                    checked={onlyProgramModules} 
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
                        disabled={!edit}
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
            <Tooltip title={module.name}>
                <Typography className="text-overflow-ellipsis overflow-auto width-100" fontSize={THEME.FONT.PARAGRAPH} color={COLORS.WHITE}>{module.name}</Typography>
            </Tooltip>
        </Button>
    )
}

function getProgramModules(modules: objWithId<moduleType>[], program: programType): objWithId<moduleType>[] {
    if (!program) return []
    return modules?.filter(module => program?.modules.find(programModule => programModule.id === module[0]))
}