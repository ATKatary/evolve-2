import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';

import "../assets/utils.css";
import { styles } from "../styles";
import { EMAIL, THEME } from "../constants";
import { objWithId, sidebarSectionType } from "../types";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { SelectField } from "../forms/fields";
import { getDevOrDepUrl } from "../utils";
import { sendEmail } from "../api/firebase";
import { LoadingContext, NotificationContext } from "..";


function Sidebar({...props}) {
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext)
    const navigate = useNavigate();
    // j is index of selectedSection
    let {id, coach, auth, j, sections, header, style, className, selectedStudent, setSelectedStudent, students,  ...rest} = props;
    sections = sections as sidebarSectionType[];

    return (
        <div style={{width: 225, ...style}} className={`fixed height-100 ${className || ""}`}>
            <div className="flex align-center column" style={{zIndex: 1, padding: 20, marginTop: 100}}>
                <IconButton onClick={async () => {
                        await auth?.logout(); 
                        const url = getDevOrDepUrl("evolve");
                        if (url) navigate(url)
                    }
                }>
                    <Tooltip title="logout">
                        <ExitToAppIcon />
                    </Tooltip>
                </IconButton>
                <SelectField 
                    // className="fixed"
                    value={selectedStudent}
                    onChange={(event: any) => setSelectedStudent(event.target.value)}
                    sx={{...styles.formField(), margin: "10px 0 5px 0", width: 150, height: 40, opacity: selectedStudent? 1 : 0.5}}
                    options={[{id: 0, name: "View Student", style: {opacity: 0.5}}, ...students.map(([_, student]: objWithId<any>, i: any) => ({id: i + 1, name: student.name}))]}
                />
                <div style={{height: 40}}>
                    {selectedStudent?
                        <IconButton onClick={async () => {
                            const studentName = students[selectedStudent - 1][1].name;

                            loading?.setLoading({message: `Nudging ${studentName}`, load: true})
                            const nudged = await sendEmail({
                                toUids: [students[selectedStudent - 1][0]],
                                ccUids: [id],
                                message: {
                                    subject: "Your Coach Nudged You!",
                                    html: EMAIL.TEMPLATES.NUDGE(studentName, coach.obj.name)
                                }
                            })
                            loading?.setLoading({message: null, load: false})

                            if (nudged) {
                                notification?.setNotification({message: `${studentName} has been nudged!`, notify: true})
                            } else {
                                notification?.setNotification({message: `Failed to nudge ${studentName}.`, notify: true})
                            }
                        }}>
                            <Tooltip title="nudge">
                                <NotificationsActiveRoundedIcon style={{color: THEME.BUTTON_ACCENT}}/>
                            </Tooltip>
                        </IconButton>
                        : <></>
                    }
                </div>
            </div>
            {sections.map((section: sidebarSectionType, i: number) => {
                return (
                    <Button 
                        key={`section-${i}`}
                        className="width-100 flex align-center"
                        onClick={section.onClick? section.onClick : () => {}} 
                        sx={{...styles.sidebarSectionButton(j === i)}}
                    >
                        <section.icon style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}/>
                        {section.name}
                    </Button>
                )
            })}
        </div>
    )
}

export default Sidebar;
