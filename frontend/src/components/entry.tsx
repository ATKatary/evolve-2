import * as React from "react";

import { IconButton, LinearProgress } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import Doc from "./doc";
import Rate from "./rate";
import "../assets/utils.css";
import { Rank } from "./rank";
import { styles } from "../styles";
import { THEME } from "../constants";
import { StyledInput } from "../support";
import { contentType, entryType, itemType, responseType } from "../types";
import { arrayMoveImmutable } from "array-move";
import { AndroidSwitch } from "./androidSwitch";


function Entry({...props}) {
    let {style, className, entry, updateEntry, edit, studentId, isCoach, selectedContent, setSelectedContent, ...rest} = props;
    entry = entry as entryType; 
    // console.log("[Entry] (entry) >>", entry)

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
        setSelectedContent(Math.max(i - 1, 0))
    }

    const moveContent = (i: number, j: number) => () => {
        if (j < 0 || j >= entry?.contents?.length) return;

        updateEntry({
            ...entry, 
            contents: arrayMoveImmutable(entry?.contents, i, j)
        })
        setSelectedContent(j)
    }

    const contentProps = {
        edit: edit,
        isCoach: isCoach,
        studentId: studentId,
        moveContent: moveContent,
        n: entry?.contents?.length,
        deleteContent: deleteContent,
        onContentChange: onContentChange,
    }

    return (
        entry?.displayMode === "doc"? 
        <div style={{...style, maxHeight: `calc(100vh - ${edit? 264 : 225}px)`}} className={`width-100 scroll no-scrollbar flex column ${className || ""}`}>
            {entry?.contents?.map((content: contentType, i: number) => constructContent(i, content, contentProps))}
        </div>
        :
        entry?.displayMode === "slides"? 
            <div className="width-100 flex align-center column">
                <div className="width-100 flex align-center justify-center">
                    <IconButton style={{marginRight: 10, width: 40, height: 40}} onClick={() => setSelectedContent(Math.max(0, selectedContent - 1))}>
                        <FirstPageRoundedIcon />
                    </IconButton>
                    <LinearProgress 
                        variant="determinate" 
                        value={((selectedContent + 1) / contentProps.n)*100} 
                        sx={{
                            width: "80%", 
                            margin: "10px 0 10px 0",
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: THEME.ACTIVE_ACCENT
                            }, 
                            backgroundColor: THEME.BACKGROUND_ACCENT_2
                        }}
                    />
                    <IconButton style={{marginLeft: 10, width: 40, height: 40}} onClick={() => setSelectedContent(Math.min(contentProps.n - 1, selectedContent + 1))}>
                        <LastPageRoundedIcon />
                    </IconButton>
                </div>
                <div style={{...style, maxHeight: `calc(100vh - ${edit? 305 : 266}px)`, margin: "0 10px 0 10px"}} className={`width-100 scroll no-scrollbar flex column ${className || ""}`}>
                    {constructContent(selectedContent, entry.contents[selectedContent], contentProps)}
                </div>
            </div>
            :
            <></>
    )
}

export default React.memo(Entry);

function constructContent(i: number, content: contentType, {...props}) {
    let {n, edit, studentId, isCoach, onContentChange, deleteContent, moveContent, ...rest} = props;

    let EntryType: any;
    let key = `content-${i}`;
    const response = content?.responses?.find((response: responseType) => response.id === studentId)
    
    switch (content?.type) {
        case "text":
            EntryType = TextContent
            key = `content-text-${i}`
            break;
        case "email":
                EntryType = EmailContent
                key = `content-email-${i}`
                break;
        case "select":
            EntryType = SelectContent
            key = `content-select-${i}`
            break;
        case "multiSelect":
            EntryType = MultiSelectContent
            key = `content-multi-select-${i}`
            break;
        case "rate":
            EntryType = RateContent
            key = `content-rate-${i}`
            break;
        case "rank":
            EntryType = RankContent
            key = `content-rank-${i}`
            break;
        case "prompt":
            EntryType = PromptEntry
            key = `content-prompt-${i}`
            break;
        default: return <span key={key}></span>
    }

    return (
        <div className="width-100 flex" style={{margin: "5px 0 5px 0"}} key={key}>
            <EntryType 
                i={i}
                n={n} 
                edit={edit}
                content={content} 
                isCoach={isCoach}
                response={response}
                studentId={studentId}
                onChange={onContentChange(i)}
                deleteContent={deleteContent(i)}
            />
            <EntryContentSettings 
                disabled={!edit}
                onDelete={deleteContent(i)} 
                onUp={moveContent(i, i - 1)}
                onDown={moveContent(i, i + 1)}
                style={{width: edit? 60 : 0, padding: "35px 0 10px 0", height: "min(100%, 200px)"}} 
            />
        </div>
    )
}

function EntryContentSettings({...props}) {
    let {onDelete, disabled, style, className, onUp, onDown, ...rest} = props;

    return (
        <div className={`flex justify-start column align-center entry-settings ${className || ""}`} style={{...style}}>
            {/* <KeyboardArrowUpRoundedIcon 
                className="pointer"
                onClick={!disabled? onUp : undefined} 
                sx={{...styles.moveContentButton(!disabled)}} 
                style={{width: 25, height: 25, margin: "5px 0 5px 0"}} 
            /> */}
            <DeleteIcon     
                className="pointer clicked"
                onClick={!disabled? onDelete : undefined} 
                sx={{...styles.deleteContentButton(!disabled)}} 
                style={{width: 25, height: 25, margin: "5px 0 5px 0"}} 
            />
            {/* <KeyboardArrowDownRoundedIcon 
                className="pointer clicked"
                onClick={!disabled? onDown : undefined} 
                sx={{...styles.moveContentButton(!disabled)}} 
                style={{width: 25, height: 25, margin: "5px 0 5px 0"}} 
            /> */}
        </div>
    )
}

function TextContent({...props}) {
    let {style, className, content, deleteContent, edit, ...rest} = props;
    content = content as contentType;
    
    return (
        <div className={`width-100 flex justify-center ${className || ""}`} style={{...style}}>
            <Doc content={content} data={content?.data} edit={edit} {...rest}/>
        </div>
    )
}

function RankContent({...props}) {
    let {style, className, content, studentId, isCoach, edit, deleteContent, response, onChange, ...rest} = props;
    content = content as contentType;

    const onStudentRankChange = (items: any) => {
        let updatedResponses = [{id: studentId, response: items}]
        if (content.responses.find((response: responseType) => response.id === studentId)) {
            updatedResponses = content.responses.map((response: responseType) => response.id === studentId? {...response, response: items} : response)
        }

        onChange({
            ...content, 
            responses: updatedResponses
        })
    }

    const [items, setItems] = React.useState<itemType[]>([]);

    React.useEffect(() => {
        if (studentId && response?.response) {
            setItems(response.response)
        } else {
            setItems(content.data.items)
        }
    }, [studentId])

    return (
        <div className={`width-100 flex column align-center justify-center ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                value={content?.data?.header || ""}
                style={{...styles.entryHeader(edit, studentId && !isCoach? 1 : undefined), width: "calc(100% - 120px)"}} 
                className={`${edit? "pointer" : ""}`}
                placeholder={`Rank the following in order of importance.`}
                onChange={(value: string) => onChange({...content, data: {...content.data, header: value}})}
            />
            <div className="flex align-center" style={{width: "calc(100% - 75px)"}}>
                <Rank 
                    edit={edit}
                    items={items}
                    isCoach={isCoach}
                    setItems={setItems}
                    studentId={studentId}
                    onInputChange={isCoach && !studentId? (items: any) => onChange({...content, data: {...content.data, items: items}}) : undefined}
                    onRankChange={studentId && !isCoach? onStudentRankChange : (items: any) => onChange({...content, data: {...content.data, items: items}})}
                />
            </div>
        </div>
    )
}

function SelectContent({...props}) {
    let {style, className, content, deleteContent, multiple, edit, studentId, isCoach, onChange, response, ...rest} = props;
    content = content as contentType;

    return (
        <div className="width-100 flex justify-between align-center" style={{...style}}>
            <div>This is select</div>
        </div>
    )
}

function EmailContent({...props}) {
    let {style, className, content, edit, studentId, onChange, isCoach, response, ...rest} = props;
    content = content as contentType;

    return (
        <div className={`width-100 flex column justify-start ${className || ""}`} style={{...style}}>
            <div className="flex justify-between" style={{width: `clac(100% - 120px)`}}>
                <StyledInput 
                    disableTooltip
                    disabled={!edit} 
                    placeholder={`Subject`}
                    value={content?.data?.subject || ""}
                    className={`${edit? "pointer" : ""}`}
                    style={{...styles.entryHeader(edit, studentId && !isCoach? 1 : undefined), textAlign: "start"}} 
                    onChange={(value: string) => onChange({...content, data: {...content.data, subject: value}})}
                />
                <AndroidSwitch 
                    offText="Send on complete" 
                    onText="Send on complete"  
                    containerClassName="row-reverse"
                    checked={content?.data?.sendOnComplete} 
                    onChange={(on: boolean) => onChange({...content, data: {...content.data, sendOnComplete: on}})}
                /> 
                <AndroidSwitch 
                    offText="Send to parent"  
                    onText="Send to parent"  
                    containerClassName="row-reverse"
                    checked={content?.data?.sendToParent} 
                    onChange={(on: boolean) => onChange({...content, data: {...content.data, sendToParent: on}})}
                /> 
            </div>
            <Doc 
                {...rest} 
                edit={edit} 
                content={content} 
                data={content?.data?.html}
                onChange={(changedContent: contentType) => onChange({...content, data: {...content.data, html: changedContent.data}})}
            />
        </div>
    )
}

function MultiSelectContent({...props}) {
    return <SelectContent {...props} multiple/>
}

function PromptEntry({...props}) {
    let {style, className, content, deleteContent, edit, studentId, isCoach, onChange, response, ...rest} = props;
    content = content as contentType;

    const onStudentTextChange = (text: string) => {
        let updatedResponses = [{id: studentId, response: text}]
        if (content.responses.find((response: responseType) => response.id === studentId)) {
            updatedResponses = content.responses.map((response: responseType) => response.id === studentId? {...response, response: text} : response)
        }

        onChange({
            ...content, 
            responses: updatedResponses
        })
    }

    return (
         <div className={`flex align-center justify-center width-100 column ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                placeholder={`What are you life goals?`}
                value={content?.data?.header || ""}
                className={`${edit? "pointer" : ""}`}
                style={{...styles.entryHeader(edit, studentId && !isCoach? 1 : undefined), width: "calc(100% - 120px)"}} 
                onChange={(value: string) => onChange({...content, data: {...content.data, header: value}})}
            />
            <textarea 
                value={response?.response || ""}
                disabled={!studentId || isCoach} 
                placeholder="Enter response here..." 
                style={{...styles.promptEntry(edit,  studentId && !isCoach? 1 : undefined) as React.CSSProperties, width: "calc(100% - 130px)"}} 
                onChange = {studentId && !isCoach? (event: any) => onStudentTextChange(event?.target.value) : () => {}}
            >
            </textarea>
        </div>
    )
}

function RateContent({...props}) {
    let {style, className, content, deleteContent, studentId, isCoach, edit, onChange, response, ...rest} = props;
    content = content as contentType;

    const onStudentRateChange = (rating: number) => {
        let updatedResponses = [{id: studentId, response: rating}]
        if (content.responses.find((response: responseType) => response.id === studentId)) {
            updatedResponses = content.responses.map((response: responseType) => response.id === studentId? {...response, response: rating} : response)
        }

        onChange({
            ...content, 
            responses: updatedResponses
        })
    }

    return (
        <div className={`flex align-center column justify-center width-100 ${className || ""}`} style={{...style}}>
            <StyledInput 
                disableTooltip
                disabled={!edit} 
                placeholder={`How happy are you?`}
                value={content?.data?.header || ""}
                className={`${edit? "pointer" : ""}`}
                style={{...styles.entryHeader(edit, studentId && !isCoach? 1 : undefined)}} 
                onChange={(value: string) => onChange({...content, data: {...content.data, header: value}})}
            />
            <Rate 
                style={{fontSize: 35}} 
                value={response?.response || -1}
                disabled={!studentId || isCoach} 
                onChange={studentId && !isCoach? onStudentRateChange : () => {}}
            />
        </div>
    )
}