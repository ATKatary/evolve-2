import * as React from "react";

import { Divider, Button, Typography } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

import { styles } from "../styles";
import { CheckBoxField } from "../forms/fields";
import { contentTypes, entryType, stepType, studentProgressType } from "../types";
import { NEW_CONTENT, THEME } from "../constants";
import Entry from "./entry";


function CheckInStep({...props}) {
    let {style, className, step, updateStep, edit, studentId, isCoach, student, checkInCode, studentCheckedIn, ...rest} = props;
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

    return (
        <div style={{...style, marginTop: 30, width: "80%"}} className={`column flex align-center justify-center ${className || ""}`}>
            {student && (checkInCode !== 404)?
                <div className="flex align-center width-100">
                    <Typography fontSize={THEME.FONT.PARAGRAPH} color={THEME.DOMINANT}>
                        {student.name} 
                        {checkInCode === 201? 
                            "is checked off"
                                    : 
                                    checkInCode === 200? 
                                    "is waiting to be checked off"
                                :
                                checkInCode === 400? 
                                "is not ready to be checked off"
                            :
                            "there is something very wrong"
                        }
                    </Typography>
                    <CheckBoxField 
                        style={{marginTop: -4}}
                        checked={checkInCode === 201} 
                        disabled={checkInCode !== 200 && checkInCode !== 201} 
                        onChange={(event: any, checked: boolean) => studentCheckedIn(checked)}
                    />
                </div>
                : <></>
            }
            {edit? 
                <div className="flex width-100 align-center justify-center">
                    <Divider sx={{...styles.entryDivider(true)}}>
                        <Button sx={{...styles.entryButton()}} onClick={() => addEntryContent("email")}>
                            <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> Email
                        </Button>
                    </Divider>
                </div>
                : <></>
            }
            <Entry entry={step?.entries[selectedEntry]} updateEntry={updateEntry} edit={edit} studentId={studentId} isCoach={isCoach} selectedContent={selectedContent} setSelectedContent={setSelectedContent}/>
        </div>
    )
}

export default CheckInStep;

