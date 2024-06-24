import * as React from "react";

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Divider, IconButton, Tab, Tabs, Typography } from "@mui/material";

import Entry from "./entry";
import "../assets/utils.css";
import { styles } from "../styles";
import { NEW_CONTENT, THEME } from "../constants";
import { StyledInput } from "../support";
import { contentTypes, entryType, stepType } from "../types";
import { AndroidSwitch } from "./androidSwitch";


function TaskStep({...props}) {
    let {style, className, step, updateStep, edit, studentId, isCoach, ...rest} = props;
    step = step as stepType;

    const [selectedContent, setSelectedContent] = React.useState<number>(0);
    const [selectedEntry, setSelectedEntry] = React.useState<number>(0);

    const updateEntry = (entry: entryType) => {
        updateStep({
            ...step,
            entries: step?.entries?.map((stepEntry: entryType, i: number) => 
                i === selectedEntry? entry : stepEntry
            )
        })
    }
    
    const addEntry = (i: number) => {
        const newEntry = {name: `Entry ${i + 1}`, contents: [], displayMode: "doc"};
        updateStep({...step, entries: step.entries? [...step.entries, newEntry] : [newEntry]});
    }

    const deleteEntry = (i: number) => {
        updateStep({...step, entries: step?.entries.filter((stepEntry: entryType, j: number) => i !== j)});
        if (i && selectedEntry >= i) setSelectedEntry(selectedEntry - 1)
    }

    const addEntryContent = (type: contentTypes) => {
        const newSelectedContent = step?.entries[selectedEntry]?.displayMode === "slides"? selectedContent + 1 : step?.entries[selectedEntry].contents?.length
        updateStep({
            ...step, 
            entries: step?.entries?.map((stepEntry: entryType, i: number) => {
                if (i === selectedEntry) {
                    stepEntry.contents.splice(newSelectedContent, 0, NEW_CONTENT(type))
                    return {
                        ...stepEntry, 
                        contents: stepEntry.contents? stepEntry.contents : [NEW_CONTENT(type)]
                    } 
                }
                return stepEntry
            })
        });

        setSelectedContent(newSelectedContent)
    }

    const onTabChange = (newValue: number) => {
        if (newValue === step?.entries?.length) {
            addEntry(newValue);
        } 
        setSelectedEntry(newValue)
    }

    return (
        <div style={{...style, marginTop: 30, width: "80%"}} className={`column flex align-center justify-center ${className || ""}`}>
            {edit? 
                <div className="flex width-100 align-center justify-between">
                    <AndroidSwitch 
                        onText="Slides"  
                        offText="Document" 
                        containerStyle={{flexDirection: "row"}}
                        checked={step?.entries[selectedEntry]?.displayMode === "slides"} 
                        onChange={(on: boolean) => {
                            updateEntry({...step?.entries[selectedEntry], displayMode: on? "slides" : "doc"})
                        }}
                    /> 
                    <Divider sx={{...styles.entryDivider(true)}}>
                        <Button sx={{...styles.entryButton()}} onClick={() => addEntryContent("text")}>
                            <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Text
                        </Button>
                        <Button sx={{...styles.entryButton()}} onClick={() => addEntryContent("prompt")}>
                            <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Prompt
                        </Button>
                        {/* <Button sx={{...styles.entryButton()}} onClick={() => addEntryContent("multiSelect")}>
                            <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Multi-Select
                        </Button> */}
                        <Button sx={{...styles.entryButton()}} onClick={() => addEntryContent("rate")}>
                            <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Rate
                        </Button>
                        <Button sx={{...styles.entryButton()}} onClick={() => addEntryContent("rank")}>
                            <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Rank
                        </Button>
                    </Divider>
                </div>
                : <></>
            }
            <Entry entry={step?.entries[selectedEntry]} updateEntry={updateEntry} edit={edit} studentId={studentId} isCoach={isCoach} selectedContent={selectedContent} setSelectedContent={setSelectedContent}/>
        </div>
    )
}

export default TaskStep;
