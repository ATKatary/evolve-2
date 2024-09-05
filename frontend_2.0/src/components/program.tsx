import * as React from "react";

import { useMutation } from "@apollo/client";

import { THEME, COLORS } from "../constants";
import { CREATE_MODULE, DELETE_MODULE, UPDATE_PROGRAM } from "../mutations";
import { ProgressField } from "../forms/fields";
import { NavArray, NavRail } from "../support/nav";
import { EditableHeader } from "../support/editable";
import { programComponentPropsType, programNavPropsType } from "../types";
import ModuleComponent from "./module";
import { ConfirmContext } from "..";

function ProgramComponent(props: programComponentPropsType) {
    const {sid, pid, student, program, setPid, isCoach, onDelete, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    const confirm = React.useContext(ConfirmContext);

    const [mid, setMid] = React.useState<string | undefined>();
    const module = React.useMemo(() => program.obj?.modules.find(module => module.id === mid), [mid])

    const [deleteModule] = useMutation(DELETE_MODULE);

    return (
        <div style={{...style, margin: "85px 0 0 0"}} className={`width-100 flex column align-center ${className || ""}`}>
            <NavRail 
                className="fixed"
                style={{fontSize: THEME.FONT.PARAGRAPH(), top: 30, left: 250}} 
                links={[
                    {onClick: () => confirm?.confirmRequired(() => setPid(undefined)), title: "Programs"},
                    {onClick: mid? () => confirm?.confirmRequired(() => setMid(undefined)) : undefined, title: program.obj?.title},
                    {title: module?.title}
                ]}
            />
            {mid?
                <ModuleComponent 
                    mid={mid} 
                    sid={sid} 
                    isCoach={isCoach} 
                    onDelete={() => confirm?.confirmRequired(async () => {
                        await deleteModule({variables: {id: mid}});
                        setMid(undefined);
                    }, true, "Are you sure you want to delete module?", "All your data will be lost.")}
                /> 
                : <ProgramNav {...props} setMid={setMid} onDelete={onDelete}/>
            }
        </div>
    )
}


export default ProgramComponent;

function ProgramNav(props: programNavPropsType) {
    const {pid, sid, student, program, setMid, onDelete, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const [updateProgram] = useMutation(UPDATE_PROGRAM);
    const studentProgress = React.useMemo(() => student?.obj?.programs?.find(program => program.id === pid)?.progress, [student, pid]);
    const isStudent = React.useMemo(() => sid && typeof studentProgress === "number", [sid, studentProgress]);

    const [addModule] = useMutation(CREATE_MODULE);

    const onAdd = React.useMemo(() => 
        isStudent? 
            undefined : async () => {
                await addModule({variables: {pid: pid, title: "New Module"}})
            }
        , [isStudent])
        
    console.log(`[ProgramNav][${program.id}] (studentProgress) >> ${studentProgress}`);
    
    return (
        <>
        <EditableHeader 
            onDelete={onDelete}
            style={{marginBottom: "30px"}}
            title={program.obj?.title || ""} 
            setTitle={(title) => {
                if (program?.obj) program?.setObj({...program.obj, title: title})
            }}
            onSave={async () => {
                await updateProgram({variables: {id: program.id, title: program.obj?.title}})
            }}
            controlsStyle={{position: "fixed", right: 100, display: sid? "none" : ""}}
        />
        {isStudent?
            <ProgressField style={{width: "60%"}} value={studentProgress}/> : <></>
        }
        <NavArray 
            className="align-center wrap"
            style={{margin: `${sid && typeof studentProgress === "number"? 33.5 : 50}px 10px 10px 10px`}}
            links={program.obj?.modules?.map((module, i) => {
                const disabled = student?.obj?.programs?.find(p => p.id === program.id)?.accessibleModules?.find(id => id === module.id)? false : true;
                console.log(`[ProgramNav][${module.id}] (disabled) >> ${disabled}`);
                
                return {
                    title: module.title, 
                    onClick: () => setMid(module.id),
                    disabled: isStudent? disabled : false,
                    style: {backgroundColor: disabled? THEME.BUTTON_ACCENT : THEME.SUCCESS},
                    textStyle: {color: COLORS.WHITE, fontSize: THEME.FONT.SUB_HEADING()},
                }
            }) || []}
            onAdd={onAdd}
        />
        </>
    )
}