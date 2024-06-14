import * as React from "react";

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Divider, IconButton, Tab, Tabs, Typography } from "@mui/material";

import Entry from "./entry";
import "../assets/utils.css";
import { styles } from "../styles";
import { THEME } from "../constants";
import { StyledInput } from "../support";
import { contentTypes, entryType, stepType } from "../types";
import { AndroidSwitch } from "./androidSwitch";

const NEW_CONTENT = (type: contentTypes) => ({data: {}, type: type, responses: []})

function EvolveStep({...props}) {
    let {style, className, step, updateStep, edit, studentId, isCoach, ...rest} = props;
    step = step as stepType;

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
        updateStep({
            ...step, 
            entries: step?.entries?.map((stepEntry: entryType, i: number) => 
                i === selectedEntry? {...stepEntry, contents: stepEntry.contents? [...stepEntry.contents, NEW_CONTENT(type)] : [NEW_CONTENT(type)]} : stepEntry
            )
        });
    }

    const onTabChange = (newValue: number) => {
        if (newValue === step?.entries?.length) {
            addEntry(newValue);
        } 
        setSelectedEntry(newValue)
    }

    return (
        <div style={{...style, marginTop: 30, width: "80%"}} className={`column flex align-center justify-center ${className || ""}`}>
            <Tabs
                scrollButtons
                variant="scrollable"
                className="width-100"
                allowScrollButtonsMobile
                style={{marginBottom: 10, ...styles.tabs}}
                value={selectedEntry < step?.entries.length? selectedEntry : 0}
                TabIndicatorProps={{sx: {...styles.tabIndicator(step?.entries?.length !== 0)}}}
                onChange={(event, newValue) => newValue < step?.entries.length? onTabChange(newValue) : null}
            >
                {step.entries.map((entry: entryType, i: number) => {
                    return (
                        <Tab 
                            disableRipple={edit}
                            key={`step-${i}`}
                            label={
                                <div className="flex align-center justify-between width-100">
                                    <StyledInput 
                                        disabled={!edit} 
                                        value={entry?.name}
                                        placeholder={`Entry ${i}`}
                                        className="step-title pointer"
                                        onChange={(name: string) => updateEntry({...entry, name: name})}
                                        style={{...styles.title(edit), borderBottom: "none", margin: "0 0 0 -15px", textAlign: "start"}} 
                                    />
        
                                    <CloseIcon 
                                        style={{width: 15, height: 15, color: THEME.ERROR}}
                                        sx={{...styles.tabDeleteButton(edit)}} 
                                        onClick={(event) => {
                                            if (!edit) return;
                                            deleteEntry(i)
                                            event.preventDefault()
                                            event.stopPropagation()
                                        }}
                                    />
                                </div>
                            } 
                            sx={{textTransform: "none"}} 
                            
                            style={{...styles.tabLabel(i === selectedEntry)}} 
                        />
                    )
                })}

                <Tab 
                    key={`step-new`}
                    disabled={!edit}
                    style={{color: THEME.BUTTON_ACCENT}}
                    sx={{textTransform: "none", opacity: edit? 1 : 0}}
                    onClick={() => onTabChange(step?.entries?.length || 0)}
                    label={<AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0", width: 50}}/>}
                />
            </Tabs>
            {edit? 
                <>
                <AndroidSwitch 
                    onText="Slides"  
                    offText="Document"      
                    defaultChecked={step?.entries[selectedEntry].displayMode === "slides"} 
                    onChange={(on: boolean) => {
                        updateEntry({...step?.entries[selectedEntry], displayMode: on? "slides" : "doc"})
                    }}
                /> 
                <Divider sx={{...styles.entryDivider(true)}}>
                    <Button sx={{...styles.entryButton}} onClick={() => addEntryContent("text")}>
                        <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Text
                    </Button>
                    <Button sx={{...styles.entryButton}} onClick={() => addEntryContent("select")}>
                        <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Select
                    </Button>
                    <Button sx={{...styles.entryButton}} onClick={() => addEntryContent("multiSelect")}>
                        <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Multi-Select
                    </Button>
                    <Button sx={{...styles.entryButton}} onClick={() => addEntryContent("rank")}>
                        <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Rank
                    </Button>
                </Divider>
                </>
                : <></>
            }
            <Entry entry={step?.entries[selectedEntry]} updateEntry={updateEntry} edit={edit} studentId={studentId} isCoach={isCoach}/>
        </div>
    )
}

export default EvolveStep;
