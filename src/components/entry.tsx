import * as React from "react";

import { IconButton } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

import Doc from "./doc";
import Rank from "./rank";
import "../assets/utils.css";
import { styles } from "../styles";
import { THEME } from "../constants";
import { contentType, entryType, responseType } from "../types";


function Entry({...props}) {
    let {style, className, entry, updateEntry, edit, studentId, isCoach, ...rest} = props;
    entry = entry as entryType;
    console.log("[Entry] (entry) >>", entry)

    const onContentChange = (i: number) => (updatedContent: contentType) => {
        // console.log("[Entry] (updatedContent) >>", updatedContent)
        updateEntry({
            ...entry, 
            contents: entry?.contents?.map((entryContent: contentType, j: number) => i === j? updatedContent : entryContent)
        })
    }

    const deleteContent = (i: number) => () => {
        updateEntry({
            ...entry, 
            contents: entry?.contents?.filter((_: contentType, j: number) => i !== j)
        })
    }

    return (
        <div style={{...style, maxHeight: "calc(100vh - 376px)"}} className={`width-100 scroll no-scrollbar flex column ${className || ""}`}>
            {entry?.contents?.map((content: contentType, i: number) => {
                let EntryType: any;
                let key = `content-${i}`;
                
                switch (content.type) {
                    case "text":
                        EntryType = TextContent
                        key = `content-text-${i}`
                        break;
                    case "select":
                        EntryType = SelectContent
                        key = `content-select-${i}`
                        break;
                    case "multiSelect":
                        EntryType = MultiSelectContent
                        key = `content-multi-select-${i}`
                        break;
                    case "rank":
                        EntryType = RankContent
                        key = `content-rank-${i}`
                        break;
                    default: return <span key={key}></span>
                }

                return (
                    <EntryType 
                        i={i}
                        key={key} 
                        edit={edit}
                        content={content} 
                        isCoach={isCoach}
                        studentId={studentId}
                        n={entry.contents.length} 
                        onChange={onContentChange(i)}
                        deleteContent={deleteContent(i)}
                    />
                )
            })}
        </div>
    )
}

export default React.memo(Entry);

function EntryContentSettings({...props}) {
    let {onClick, disabled, style, className, ...rest} = props;

    return (
        <div className={`flex justify-start column align-center ${className || ""}`} style={{...style}}>
            <IconButton sx={{...styles.deleteContentButton(!disabled)}} onClick={onClick} disabled={disabled}>
                <DeleteIcon style={{width: 25, height: 25}}/>
            </IconButton>
        </div>
    )
}

function TextContent({...props}) {
    let {style, className, content, deleteContent, edit, ...rest} = props;
    content = content as contentType;
    
    return (
        <div className="width-100 flex justify-center">
            <EntryContentSettings 
                disabled={!edit}
                onClick={deleteContent} 
                style={{margin: "10px 0 10px 0", width: edit? 60 : 0, backgroundColor: THEME.BACKGROUND_ACCENT_2, padding: "10px 0 10px 0"}} 
            />
            <Doc content={content} edit={edit} {...rest}/>
        </div>
    )
}

function SelectContent({...props}) {
    let {style, className, content, multiple, studentId, isCoach, ...rest} = props;
    content = content as contentType;

    return <div>This is select</div>
}

function MultiSelectContent({...props}) {
    return <SelectContent {...props} multiple/>
}

function RankContent({...props}) {
    let {style, className, content, deleteContent, studentId, isCoach, edit, ...rest} = props;
    content = content as contentType;
    const response = content.responses.find((response: responseType) => response.id === studentId)

    return (
        <div className="width-100 flex justify-between align-center" style={{marginTop: 10}}>
            <EntryContentSettings 
                disabled={!edit}
                onClick={deleteContent} 
            />
            <Rank style={{fontSize: 35}} disabled={!studentId || isCoach} value={response?.response || -1}/>
            <div style={{width: 41}}></div>
        </div>
    )
}