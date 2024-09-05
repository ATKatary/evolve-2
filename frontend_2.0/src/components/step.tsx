import * as React from "react";

import { useMutation } from "@apollo/client";
import { Button, Divider, Typography } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { makeId } from "../utils";
import { styles } from "../styles";
import EntryComponent from "./entry";
import { NEW_ENTRY, THEME } from "../constants";
import { AndroidSwitch } from "./androidSwitch";
import { stepComponentPropsType } from "../types";
import { CREATE_ENTRY, DELETE_ENTRY } from "../mutations";
import { entryDataType, entryType, responseType } from "../types/program";
import { CheckBoxField } from "../forms/fields";
import { ControlsArray } from "../support";

function StepComponent(props: stepComponentPropsType) {
    const {locked, isCoach, sid, edit, step, type, submission, onCheckIn, onSubmit, onUnsubmit, onSave, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const [i, setI] = React.useState<number>(0);

    const [createEntry] = useMutation(CREATE_ENTRY);    
    const [deleteEntry] = useMutation(DELETE_ENTRY);  

    const onEntryChange = (id: String, data: any) => {
        if (step.obj) {
            step.setObj({
                ...step.obj,
                entries: step.obj.entries.map(entry => ({...entry, data: entry.id === id? data : entry.data}))
            })
        }
    }

    const onEntryDelete = async (id: String) => {
        if (step.obj) {
            step.setObj({
                ...step.obj,
                entries: step.obj.entries.filter(entry => entry.id !== id)
            })
        }

        await deleteEntry({variables: {id: id}})
    }

    const onResponseChange = (id: String, data: any) => {
        if (sid) {
            step.respond(id, sid, data)
        }
    }

    const isStart = React.useMemo(() => type === "start", [type]);
    const isCheckIn = React.useMemo(() => type === "checkIn", [type]);
    const slideMode = React.useMemo(() => step.obj?.displayMode === "slide", [step.obj]);

    const dataTypes: string[]  = isCheckIn? ["Email"] : ["Text", "Prompt", "Upload", "Rate", "Rank"];
    return (
        <div style={{...style, marginTop: 30}} className={`width-100 column flex align-center justify-center ${className || ""}`}>
            {isCheckIn && sid && isCoach?
                <div className="flex align-center width-100">
                    <Typography sx={{fontSize: THEME.FONT.PARAGRAPH(), color: THEME.DOMINANT}}>
                        {!submission? 
                            `Not ready for check-in`
                            :
                            submission.checkedIn?
                                `${submission.student.name} is checked-in` : `${submission.student.name} is waiting to be checked-in`
                        }
                    </Typography>
                    <CheckBoxField 
                        onChange={onCheckIn}
                        disabled={!submission} 
                        checked={submission?.checkedIn} 
                        style={{marginTop: -4, color: THEME.ACTIVE_ACCENT}}
                    />
                </div> : <></>
            }
            

            {edit? 
                <div className={`flex width-100 align-center ${isCheckIn? "justify-center" : "justify-between"}`}>
                    {isCheckIn? <></> :
                        <AndroidSwitch 
                            onText="Slides"  
                            offText="Document" 
                            checked={slideMode}
                            contStyle={{flexDirection: "row"}}
                            onCheck={async (checked) => {
                                if (step.obj) {
                                    const displayMode = checked? "slide" : "doc"
                                    step.setObj({...step.obj, displayMode: displayMode});
                                }
                            }}
                        />
                    }
                    <Divider sx={{...styles.entryDivider(true)}}>
                        {dataTypes.map(type => {
                            return (
                                <Button 
                                    key={makeId()} 
                                    sx={{...styles.entryButton()}} 
                                    onClick={async () => {
                                        const newEntry = await (await createEntry({variables: {sid: step.id, type: type.toLowerCase()}})).data.createEntry as entryType

                                        if (step.obj) {
                                            const n = step.obj.entries.length;
                                            step.setObj({...step.obj, entries: [...step.obj?.entries, {id: newEntry.id, ...NEW_ENTRY(type.toLowerCase() as entryDataType)}]});
                                            setI(n);
                                        }
                                    }}
                                >
                                    <AddIcon fontSize={"small"} style={{margin: "-2px 5px 0 0"}}/> {type}
                                </Button>
                            )
                        })}
                    </Divider>
                </div>
                : sid?
                    isStart?
                        isCoach?
                            <ControlsArray>
                                {submission?
                                    <LockOpenIcon onClick={onUnsubmit} name="unlock"/>
                                    :
                                    <LockIcon onClick={onSubmit} name="lock"/>
                                }
                            </ControlsArray>
                            :
                            !submission && step.obj?.entries.length? 
                                <Button 
                                    onClick={i === step.obj.entries.length - 1? onSubmit : onSave}
                                    sx={{...styles.button(150, submission || isCoach), marginBottom: "20px"}} 
                                >{i === step.obj.entries.length - 1? "Submit" : "Save"}</Button>
                                : <></>
                        : <></> 
                    : <></>
            }

            {!isCheckIn || (isCheckIn && isCoach)?
                step.obj? 
                    <EntryComponent 
                        i={i}
                        sid={sid}
                        setI={setI}
                        edit={edit} 
                        locked={locked}
                        isCoach={isCoach}
                        onDelete={onEntryDelete}
                        onChange={onEntryChange}
                        entries={step.obj.entries} 
                        onResponse={onResponseChange}
                        displayMode={step.obj.displayMode} 
                    /> : <></>
                : !submission?.checkedIn? <Typography>Please wait for your coach to check you in.</Typography> : <Typography>You have been checked in.</Typography>
            }
        </div>
    )
}


export default StepComponent;