import * as React from "react";

import { IconButton, LinearProgress } from "@mui/material";

import { useMutation } from "@apollo/client";

import DeleteIcon from '@mui/icons-material/Delete';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';

import Rate from "./rate";
import Editor from "./editor";
import { Rank } from "./rank";
import { makeId } from "../utils";
import { styles } from "../styles";
import { THEME } from "../constants";
import { StyledInput } from "../support";
import { entryType } from "../types/program";
import { AndroidSwitch } from "./androidSwitch";
import { saveToStorage } from "../api/firebase";
import { entryComponentPropsType, entryPropsType, entrySettingsPropsType, itemType } from "../types";

function EntryComponent(props: entryComponentPropsType) {
    const {i, setI, locked, sid, edit, entries, displayMode, isCoach, onResponse, onDelete, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;
   
    const n = React.useMemo(() => entries.length, [entries]);

    const entryProps = (entry: entryType): entryPropsType => {
        const response = entry?.responses.find(response => response.student.id === sid)?.data;

        return {
            sid: sid,
            edit: edit, 
            locked: locked,
            entry: entry,
            isCoach: isCoach, 
            onDelete: () => {
                onDelete(entry.id)
                setI(Math.max(0, i - 1))
            },
            response: response? response : undefined,
            onChange: data => onChange(entry.id, data),
            onResponse: data => onResponse(entry.id, data),
        }
    }
    return (
        displayMode === "doc"? 
        <div style={{...style, maxHeight: `calc(100vh - ${edit? 264 : 225}px)`}} className={`width-100 scroll no-scrollbar flex column ${className || ""}`}>
            {entries.map(entry => {
                return (
                    <Entry {...entryProps(entry)} key={entry.id}/>
                )
            })}
        </div>
        :
        <div className="width-100 flex align-center column">
            <div className="width-100 flex align-center justify-center">
                <IconButton style={{marginRight: 10, width: 40, height: 40}} onClick={() => setI(Math.max(0, i - 1))}>
                    <FirstPageRoundedIcon />
                </IconButton>
                <LinearProgress 
                    variant="determinate" 
                    value={((i + 1) / n)*100} 
                    sx={{
                        width: "80%", 
                        margin: "10px 0 10px 0",
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: THEME.ACTIVE_ACCENT
                        }, 
                        backgroundColor: THEME.BACKGROUND_ACCENT
                    }}
                />
                <IconButton style={{marginLeft: 10, width: 40, height: 40}} onClick={() => setI(Math.min(n - 1, i + 1))}>
                    <LastPageRoundedIcon />
                </IconButton>
            </div>
            <div style={{...style, maxHeight: `calc(100vh - ${edit? 305 : 266}px)`, margin: "0 10px 0 10px"}} className={`width-100 scroll no-scrollbar flex column ${className || ""}`}>
                <Entry {...entryProps(entries[i])}/>
            </div>
        </div>
    )
}


export default EntryComponent;

function Entry(props: entryPropsType) {
    const {edit, entry, onDelete, ...domProps} = props;

    let EntryType: any;
    switch (entry?.type) {
        case "text":
            EntryType = TextContent
            break;
        case "email":
            EntryType = EmailContent
            break;
        case "rate":
            EntryType = RateContent
            break;
        case "rank":
            EntryType = RankContent
            break;
        case "prompt":
            EntryType = PromptEntry
            break;
        case "upload":
            EntryType = UploadEntry
            break;
        default: return <span key={entry?.id}></span>
    }

    return (
        <div className="width-100 flex" style={{margin: "5px 0 5px 0"}} key={entry?.id}>
            <EntryType {...props}/>
            <EntrySettings 
                disabled={!edit} 
                onDelete={onDelete}
                style={{width: edit? 60 : 0, padding: "35px 0 10px 0", height: "min(100%, 200px)"}} 
            />
        </div>
    )
}

function EntrySettings(props: entrySettingsPropsType) {
    const {disabled, onDelete, onDown, onUp, ...domProps} = props; 
    const {style, className, ...rest} = domProps;

    return (
        <div className={`flex justify-start column align-center ${className || ""}`} style={{...style}}>
            <DeleteIcon     
                className="pointer clicked"
                onClick={!disabled? onDelete : undefined} 
                sx={{...styles.deleteContentButton(!disabled)}} 
                style={{width: 25, height: 25, margin: "5px 0 5px 0"}} 
            />
        </div>
    )
}

function TextContent(props: entryPropsType) {
    const {edit, entry, isCoach, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;
    
    return (
        <div className={`width-100 flex justify-center ${className || ""}`} style={{...style}}>
            <Editor 
                edit={edit}
                style={style}
                data={entry.data}
                onChange={onChange} 
                editorBlock={`editorjs-container-${entry.id}`}
            />
        </div>
    )
}

function RankContent(props: entryPropsType) {
    const {locked, sid, edit, entry, isCoach, response, onResponse, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;

    const [items, setItems] = React.useState<itemType[]>(entry.data?.items || []);

    React.useEffect(() => {
        if (sid && response) {
            setItems(response?.items)
        } else {
            setItems(entry.data?.items || [])
        }
    }, [sid])

    return (
        <div className={`width-100 flex column align-center justify-center ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                value={entry?.data?.header || ""}
                className={`${edit? "pointer" : ""}`}
                placeholder={`Rank the following in order of importance.`}
                onChange={(value: string) => onChange({...entry.data, header: value})}
                style={{...styles.entryHeader(edit, sid && !isCoach? 1 : undefined), width: "calc(100% - 120px)"}} 
            />
            <div className="flex align-center" style={{width: "calc(100% - 75px)"}}>
                <Rank 
                    sid={sid}
                    edit={edit}
                    items={items}
                    locked={locked}
                    isCoach={isCoach}
                    setItems={setItems}
                    onInputChange={isCoach && !sid? (items: any) => onChange({...entry.data, items: items}) : undefined}
                    onRankChange={sid && !isCoach? (items: any) => onResponse({...entry.data, items: items}) : (items: any) => onChange({...entry.data, items: items})}
                />
            </div>
        </div>
    )
}

function EmailContent(props: entryPropsType) {
    const {edit, entry, isCoach, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;

    return (
        <div className={`width-100 flex column justify-start ${className || ""}`} style={{...style}}>
            <div className="flex justify-between" style={{width: `clac(100% - 120px)`}}>
                <StyledInput 
                    disableTooltip
                    disabled={!edit} 
                    placeholder={`Subject`}
                    value={entry?.data?.subject || ""}
                    className={`${edit? "pointer" : ""}`}
                    style={{...styles.entryHeader(edit, !isCoach? 1 : undefined), textAlign: "start"}} 
                    onChange={(value: string) => onChange({...entry.data, subject: value})}
                />
                <AndroidSwitch 
                    offText="Send on complete" 
                    onText="Send on complete"  
                    contClassName="row-reverse"
                    checked={entry.data?.sendOnComplete} 
                    onCheck={checked => onChange({...entry.data, sendOnComplete: checked})}
                /> 
                <AndroidSwitch 
                    offText="Send to parent"  
                    onText="Send to parent"  
                    contClassName="row-reverse"
                    checked={entry.data?.sendToParent} 
                    onCheck={checked => onChange({...entry.data, sendToParent: checked})}
                /> 
            </div>
            <Editor 
                edit={edit}
                data={entry.data?.html}
                editorBlock={`editorjs-container-${entry.id}`}
                onChange={(data: any) => onChange({...entry.data, html: data})} 
            />
        </div>
    )
}


function PromptEntry(props: entryPropsType) {
    const {locked, sid, edit, entry, isCoach, response, onResponse, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;

    return (
         <div className={`flex align-center justify-center width-100 column ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                value={entry?.data?.header || ""}
                placeholder={`What are you life goals?`}
                className={`${edit? "pointer" : ""}`}
                onChange={(value: string) => onChange({...entry.data, header: value})}
                style={{...styles.entryHeader(edit, sid && !isCoach? 1 : undefined), width: "calc(100% - 120px)"}} 
            />
            <textarea 
                value={response || ""}
                disabled={!sid || isCoach || locked} 
                placeholder="Enter response here..." 
                onChange={sid && !isCoach? (event: any) => onResponse(event?.target.value) : () => {}}
                style={{...styles.promptEntry(edit, sid && !isCoach? 1 : undefined) as React.CSSProperties, width: "calc(100% - 130px)"}} 
            >
            </textarea>
        </div>
    )
}

function RateContent(props: entryPropsType) {
    const {locked, sid, edit, entry, isCoach, response, onResponse, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;

    return (
        <div className={`flex align-center column justify-center width-100 ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                placeholder={`How happy are you?`}
                value={entry?.data?.header || ""}
                className={`${edit? "pointer" : ""}`}
                style={{...styles.entryHeader(edit, sid && !isCoach? 1 : undefined)}} 
                onChange={(value: string) => onChange({...entry.data, header: value})}
            />
            <Rate 
                style={{fontSize: 35}} 
                value={response || -1}
                disabled={!sid || isCoach || locked} 
                onChange={sid && !isCoach? onResponse : () => {}}
            />
        </div>
    )
}

function UploadEntry(props: entryPropsType) {
    const {locked, sid, edit, entry, isCoach, response, onResponse, ...domProps} = props;
    const {style, className, onChange, ...rest} = domProps;

    const id = `input-${entry.id}`;
    console.log(response)
    const onStudentUploadChange = async (files: FileList | null) => {
        if (!files) return;

        const file = files[0]
        const url = await saveToStorage(`${makeId(9)}.${file.type.split("/")[1]}`, "videos", file);
        onResponse(url)
    }

    return (
         <div className={`flex align-center justify-center width-100 column ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                value={entry?.data?.header || ""}
                className={`${edit? "pointer" : ""}`}
                placeholder={`Upload a video about something.`}
                style={{...styles.entryHeader(edit, sid && !isCoach? 1 : undefined), width: "calc(100% - 120px)"}} 
                onChange={(value: string) => onChange({...entry.data, header: value})}
            />
            {!locked && sid?
                <div onClick={() => document.getElementById(id)?.click()} className="cdx-button" style={{fontFamily: 'Helios Extended'}}>
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3.15 13.628A7.749 7.749 0 0 0 10 17.75a7.74 7.74 0 0 0 6.305-3.242l-2.387-2.127-2.765 2.244-4.389-4.496-3.614 3.5zm-.787-2.303l4.446-4.371 4.52 4.63 2.534-2.057 3.533 2.797c.23-.734.354-1.514.354-2.324a7.75 7.75 0 1 0-15.387 1.325zM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path></svg> Select a Video
                </div>
                : <></>
            }
            {locked? 
                <></> : <input 
                    id={id} 
                    type="file" 
                    accept="video/*"
                    className="hidden" 
                    onChange={sid && !isCoach? (event: React.ChangeEvent<HTMLInputElement>) => onStudentUploadChange(event?.target.files) : () => {}}
                />
            }
            {response?
                <video src={response} style={{width: 300}} controls></video> : <></>
            }
        </div>
    )
}