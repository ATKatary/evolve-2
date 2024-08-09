import * as React from "react";

import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import SchoolIcon from '@mui/icons-material/School';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';

import "../assets/utils.css";

import { COLORS, THEME } from "../constants";
import { NavArray, NavRailLink } from "../support/nav";
import Sidebar from "../components/sidebar";
import { useCoach } from "../classes/coach";
import { useStudent } from "../classes/student";
import { useProgram } from "../classes/program";
import ProgramComponent from "../components/program";
import ManageStudent from "../components/manageStudent";
import { LoadingContext, NotificationContext } from "..";
import { coachPagePropsType, stateType } from "../types";
import { useViewport, useScreenOrientation } from "../support";
import { useAuth } from "../context/auth";

function StudentPage(props: coachPagePropsType) {
    const auth = useAuth();
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(0);
    const [pid, setPid] = React.useState<string | undefined>();

    const {student} = useStudent(auth?.id || undefined);
    const {program} = useProgram(pid);

    return (
        <div className="width-100 column flex align-center height-100" style={{maxWidth: 1400}}>
            {/* Sidebar */}
            <Sidebar
                selected={i}
                sid={student.id || ""}
                style={{borderRight: `1px solid ${COLORS.LIGHT_GRAY}`, left: 0}}
            >
                <div className="width-100 flex align-center" onClick={() => setI(0)}>
                    <PlayLessonIcon 
                        style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}
                    />
                    <Typography>Programs</Typography>
                </div>
                <div className="width-100 flex align-center calendly">
                    <VideocamIcon 
                        style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}
                    />
                    <NavRailLink 
                        seperator=""
                        title="Calendly"
                        textFontSize={16}
                        textHoverColor={THEME.BACKGROUND_ACCENT}
                        href={student.obj?.coach?.calendlyLink || " "}
                    />
                </div>
            </Sidebar>
            
            {/* Programs */}
            {i == 0?
                <div className="flex height-100 justify-center" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
                {student.obj?.coach?
                    pid && student.id?
                        <ProgramComponent 
                            pid={pid} 
                            sid={student.id}
                            setPid={setPid}
                            student={student}
                            program={program} 
                        />
                        :
                        student.obj?.programs?.length?
                            <>
                            <NavArray 
                                className="align-center wrap"
                                links={student.obj?.programs?.map(program => ({
                                    title: program.title, 
                                    onClick: () => setPid(program.id),
                                    textStyle: {color: COLORS.WHITE, fontSize: THEME.FONT.SUB_HEADING()},
                                })) || []}
                            />
                            </>
                        :  <Typography sx={{fontSize: THEME.FONT.HEADING(), height: "50px", opacity: 0.5, marginTop: "75px"}}>You have no assigned programs.</Typography>
                    : <Typography sx={{fontSize: THEME.FONT.HEADING(), height: "50px", opacity: 0.5, marginTop: "75px"}}>You are currently being assigned to a coach</Typography>
                }
                </div> : <></>
            }
        </div>
    )
}

export default StudentPage;
