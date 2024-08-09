import * as React from "react";

import { IconButton, Tooltip, Typography } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { styles } from "../styles";
import { PropsPropogate } from ".";
import { TimeField } from "../forms/fields";
import { THEME, COLORS } from "../constants";
import { makeId, updateCaretPosition } from "../utils";
import { editablePropsType, editableControlsPropsType, editableHeaderPropsType, editableTimePropsType } from "../types/editable";

export function Editable(props: editablePropsType) {
    const id = makeId();
    const {type, min, max, value, setValue, edit, filled, disable, ...domProps} = props
    const {style, className, color, fontSize, defaultValue, ...rest} = domProps;
    const [caretPosition, setCaretPosition] = React.useState<number>(0);

    React.useEffect(() => {
        if (caretPosition < `${value || ""}`.length) {
            updateCaretPosition(id, caretPosition);
        } else {
            updateCaretPosition(id);
        }

    }, [value]);

    return (
        <div 
            id={id}
            {...rest}
            className={`flex ${className}`}
            suppressContentEditableWarning
            contentEditable={!disable && edit}
            style={{
                ...styles.editable(!disable && edit, filled), 
                ...style,
            }}
            onInput={(event: React.ChangeEvent<HTMLDivElement>) => {
                switch (type) {
                    case "int": 
                        const intString = event.target.innerText.replace(/\D/g, "");
                        console.log("[Editable] (intString) >>", intString)

                        if (intString === "") {
                            event.target.innerText = ""; 
                            setCaretPosition(0);
                            updateCaretPosition(id, 0)
                            // return;
                        } else {
                            const int = parseInt(intString) 
                            if ((min && min > int) || (max && max < int) || (int === value)) {
                                console.log("[Editable] (int) >>", int)
                                setCaretPosition(`${value}`.length);
                                event.target.innerText = `${value}`;
                                updateCaretPosition(id, `${value}`.length);
                                return;
                            } 
                        }
                        break;
                    default: 
                        const selection = window.getSelection()
                        if (selection) {
                            setCaretPosition(selection.getRangeAt(0).startOffset);
                        }
                        break;
                }
                setValue(event.target);
            }}
        >{value === undefined? defaultValue : value || ""}</div>
    )
}

export function EditableControls(props: editableControlsPropsType) {
    const {edit, setEdit, onSave, onDelete, ...domProps} = props; 
    const {style, className, btnStyle, svgStyle, ...rest} = domProps;
    
    const onEditClick = () => {
        if (edit) {
            setEdit(false);
            if (onSave) onSave();
        } else {
            setEdit(true);
        }
    }

    return (
        <div style={{...style}} className={`flex align-center ${className || ""}`}>
            <IconButton sx={{...btnStyle}} onClick={onEditClick}>
                <Tooltip title={edit? "save" : "edit"}>
                    {edit? <SaveIcon sx={{...svgStyle}}/> : <EditIcon sx={{...svgStyle}}/> }
                </Tooltip>
            </IconButton>
            {onDelete?
                <IconButton sx={{...btnStyle}} onClick={onDelete}>
                    <Tooltip title={"delete"}>
                        <DeleteIcon sx={{...svgStyle, color: THEME.ERROR}}/>
                    </Tooltip>
                </IconButton>
                : <></>
            }
        </div>
    )
}

export function EditableHeader(props: editableHeaderPropsType) {
    const {title, setTitle, onSave, onDelete, editProp, setEditProp, propogate, disableEditing, ...domProps} = props;
    const {className, propogateClassName, style, propogateStyle, titleStyle, controlsStyle, children, controls, ...rest} = domProps;

    const [edit, setEdit] = React.useState(false);
    const [edited, setEdited] = React.useState(false);

    React.useEffect(() => {
        if (setEditProp) setEditProp(edit)
    }, [edit])

    return (
        <>
        <div className={`flex align-center ${className || ""}`} style={{...style}}>
            <Editable 
                edit={edit}
                value={title}
                disable={disableEditing}
                style={{...styles.title(), ...titleStyle}}
                setValue={(target) => setTitle(target.innerText)}
            />
            {!disableEditing?
                controls?
                    controls :
                    <EditableControls 
                        edit={edit}
                        onSave={onSave}
                        setEdit={setEdit}
                        onDelete={onDelete}
                        style={{margin: "0 0 0 20px", ...controlsStyle}}
                    /> : <></>
            }
        </div>
        {propogate?
            <PropsPropogate 
                style={{...style, ...propogateStyle}}
                className={`${className || ""} ${propogateClassName || ""}`} 
                additionalProps={{edit: edit, setEditProp: setEdit}} 
            >
                {children}
            </PropsPropogate>
            : children
        }
        </>
    )
}

export function EditableTime(props: editableTimePropsType) {
    const {hours, setHours, minutes, setMinutes, seconds, setSeconds, edit, setEdit, ...domProps} = props;
    const {label, color, className, style, timeStyle, ...rest} = domProps;
    
    return (
        <div className={`flex column align-center ${className || ""}`} style={{...style}}>
            {label? 
                <Typography sx={{color: color as string || COLORS.WHITE, fontSize: THEME.FONT.PARAGRAPH()}}>
                    {label}
                </Typography> : <></>
            }
            <div className="flex align-center">
                {hours && setHours?
                    <TimeField 
                        edit={edit}
                        color={color}
                        value={hours}
                        setEditProp={setEdit}
                        style={{...timeStyle}}
                        setValue={(target: HTMLDivElement) => setHours(parseInt(target.innerText || "0"))}
                    /> : <></>
                }
                {hours? 
                    <Typography sx={{...styles.title(undefined, color), margin: "0 5px"}}>:</Typography> : <></>
                }
                <TimeField 
                    edit={edit}
                    color={color}
                    value={minutes}
                    style={{...timeStyle}}
                    setEditProp={setEdit}
                    setValue={(target: HTMLDivElement) => setMinutes(parseInt(target.innerText || "0"))}
                />
                <Typography sx={{...styles.title(undefined, color), margin: "0 5px"}}>:</Typography>
                <TimeField 
                    edit={edit}
                    color={color}
                    value={seconds}
                    style={{...timeStyle}}
                    setEditProp={setEdit}
                    setValue={(target: HTMLDivElement) => setSeconds(parseInt(target.innerText || "0"))}
                />
            </div>
        </div>
    )
}