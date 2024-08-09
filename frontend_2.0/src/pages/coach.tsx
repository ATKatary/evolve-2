import * as React from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import SchoolIcon from '@mui/icons-material/School';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';

import "../assets/utils.css";

import { COLORS, THEME } from "../constants";
import { NavArray } from "../support/nav";
import Sidebar from "../components/sidebar";
import { useCoach } from "../classes/coach";
import { useStudent } from "../classes/student";
import { useProgram } from "../classes/program";
import ProgramComponent from "../components/program";
import ManageStudent from "../components/manageStudent";
import { ConfirmContext, LoadingContext, NotificationContext } from "..";
import { coachPagePropsType, confirmType, stateType } from "../types";
import { useViewport, useScreenOrientation } from "../support";
import { useAuth } from "../context/auth";
import { CREATE_PROGRAM, DELETE_PROGRAM } from "../mutations";
import { programType } from "../types/program";
import { useCustomState } from "../utils";

function CoachPage(props: coachPagePropsType) {
    const auth = useAuth();
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const confirm = React.useContext(ConfirmContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(1);
    const {coach} = useCoach(auth?.id || undefined);
    const [pid, setPid] = React.useState<string | undefined>();
    const [sid, setSid] = React.useState<string | undefined>();

    const {student} = useStudent(sid);
    const {program} = useProgram(pid);

    const [addProgram] = useMutation(CREATE_PROGRAM)
    const [deleteProgram] = useMutation(DELETE_PROGRAM);

    window.onbeforeunload = (event) => {
        event.returnValue = "Your changes may not be saved"
    }

    return (
        <div className="width-100 column flex align-center height-100" style={{maxWidth: 1400}}>
            {/* Sidebar */}
            <Sidebar
                isCoach 
                sid={sid}
                selected={i}
                coach={coach}
                setSid={setSid}
                students={coach.obj?.students}
                style={{borderRight: `1px solid ${COLORS.LIGHT_GRAY}`, left: 0}}
            >
                <div className="width-100 flex align-center" onClick={() => confirm?.confirmRequired(() => setI(0))}>
                    <PlayLessonIcon 
                        style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}
                    />
                    <Typography>Programs</Typography>
                </div>
                <div className="width-100 flex align-center" onClick={() => confirm?.confirmRequired(() => setI(1))}>
                    <SchoolIcon style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}/>
                    <Typography>Student</Typography>
                </div>
                {/* <div className="width-100 flex align-center" onClick={() => setI(2)}>
                    <PlayLessonIcon style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}/>
                    <Typography>Admin</Typography>
                </div> */}
            </Sidebar>
            
            {/* Programs */}
            {i == 0?
                <div className="flex height-100 justify-center" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
                {pid?
                    <ProgramComponent 
                        isCoach
                        pid={pid} 
                        sid={sid}
                        setPid={setPid}
                        student={student}
                        program={program} 
                        onDelete={() => confirm?.confirmRequired(async () => {
                            await deleteProgram({variables: {id: pid}});
                            setPid(undefined);
                            coach.removeProgram(pid)
                        }, true, "Are you sure you want to delete program?", "All your data will be lost.")}
                    />
                    :
                    <>
                    <NavArray 
                        className="align-center wrap"
                        links={coach.obj?.programs?.map(program => ({
                            title: program.title, 
                            onClick: () => setPid(program.id),
                            textStyle: {color: COLORS.WHITE, fontSize: THEME.FONT.SUB_HEADING()},
                        })) || []}
                        onAdd={async () => {
                            const newProgram = await (await addProgram({variables: {cid: coach.id, title: "New Program"}})).data.createProgram as programType;
                            coach.addProgram(newProgram)
                        }}
                    />
                    </>
                }
                </div> : <></>
            }
            {/* Manage Student */}
            {i === 1? <ManageStudent sid={sid} student={student} programs={coach.obj?.programs || []}/> : <></>}
            
        </div>
    )
}

export default CoachPage;
