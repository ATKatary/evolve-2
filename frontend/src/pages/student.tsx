import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Link, Breadcrumbs, Button, Typography, Tooltip } from "@mui/material";

import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import "../assets/utils.css";
import { styles } from "../styles";
import { contentType, contentTypes, entryType, moduleType, objWithId, stateType, stepType, studentProgressType } from "../types";
import { useAuth } from "../context/auth";
import Sidebar from "../components/sidebar";
import Program from "../components/program";
import { COLORS, THEME } from "../constants";
import { Student, useStudent } from "../classes/student";
import { LoadingContext, NotificationContext } from "..";
import { Loading, Notification, useScreenOrientation, useViewport } from "../support";
import StudentProgram from "../components/studentProgram";
import Module from "../components/module";
import { doc } from "firebase/firestore";
import { saveToCollection, db } from "../api/firebase";
import { computeProgramProgressScore, getDevOrDepUrl, nullify } from "../utils";


function StudentPage({...props}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(0);
    const [selectedModule, setSelectedModule] = React.useState<number | null>(null);
    const [selectedProgram, setSelectedProgram] = React.useState<number | null>(null);
    const [editedModuleResponses, setEditedModuleResponses] = React.useState<boolean>(false);

    const {student, programs, modules, setModules} = useStudent(state?.id);


    const sections = [
        {
            icon: PlayLessonIcon,
            name: "Programs",
            onClick: () => {setI(0)}
        },
    ]

    React.useEffect(() => {
        if (!auth?.user || !(auth.user instanceof Student)) {
            const url = getDevOrDepUrl("evolve");
            if (url) navigate(url)
        }
    }, [auth?.user])

    const updateModule = (updatedModule: moduleType) => {
        if (selectedModule !== null) {
            setModules(modules.map((([id, module]: objWithId<moduleType>, i: number) => 
                i === selectedModule? [id, updatedModule] : [id, module]
            )))

            if (state?.id) {
                const moduleId = modules[selectedModule][0]
                const moduleProgress = getModuleProgress(state.id, moduleId, updatedModule);
                
                student.setProgress(student.progress.map(progress => progress.id === moduleId? moduleProgress : progress))
            }
        }
    }

    const saveModule = async () => {
        if (selectedModule === null) return;
        loading?.setLoading({message: "Saving responses...", load: true});
        
        const module = modules[selectedModule]
        let saved = await saveToCollection(module[0], "modules", nullify(module[1]), {})

        saved = await student.save({progress: student.progress});

        loading?.setLoading({message: null, load: false})

        if (saved) {
            notification?.setNotification({message: "Responses recorded.", notify: true})
        } else {
            notification?.setNotification({message: "Could not update module.", notify: true})
        }
    }

    const getSelectedModuleName = () => {
        if (selectedProgram === null || selectedModule === null) return "";
        const module = modules.find(([id, _]) => id === programs[selectedProgram][1].modules[selectedModule]);
        return module? module[1].name : ""
    }

    return (
        <>
            <Container fluid className="width-100 column flex height-100 align-center" style={{maxWidth: 1400}}>
                <Sidebar 
                    j={i}
                    auth={auth}
                    id={state?.id}
                    sections={sections}
                    style={{borderRight: `1px solid ${COLORS.LIGHT_GRAY}`, left: 0}}
                />

                {i === 0?
                    selectedProgram !== null && programs[selectedProgram]?
                        <>
                            <Breadcrumbs sx={{fontSize: THEME.FONT.PARAGRAPH, top: 30, left: 250}} className="fixed">
                                <Link underline="hover" className="pointer" onClick={() => setSelectedProgram(null)}>Programs</Link>
                                <Link underline="hover" className="pointer" onClick={() => setSelectedModule(null)}>{programs[selectedProgram][1].name}</Link>
                                <Typography fontSize={THEME.FONT.PARAGRAPH}>{getSelectedModuleName()}</Typography>
                            </Breadcrumbs>
                            {selectedModule === null?
                                <StudentProgram 
                                    loading={loading}
                                    notification={notification}
                                    selectedModule={selectedModule}
                                    id={programs[selectedProgram][0]}
                                    setSelectedModule={setSelectedModule}
                                    name={programs[selectedProgram][1].name}
                                    key={`selected-${programs[selectedProgram][0]}`} 
                                    modules={modules.filter(([id, _]) => programs[selectedProgram][1].modules.includes(id))}
                                    score={computeProgramProgressScore(programs[selectedProgram][1].modules, student.progress)}
                                /> 
                                :
                                <Module 
                                    student={student}
                                    studentId={state?.id}
                                    saveModule={saveModule}
                                    updateModule={updateModule} 
                                    notification={notification}
                                    edited={editedModuleResponses}
                                    setEdited={setEditedModuleResponses}
                                    id={programs[selectedProgram][1].modules[selectedModule]}
                                    key={`selected-${programs[selectedProgram][1].modules[selectedModule]}`} 
                                    module={modules.find(([id, _]) => id === programs[selectedProgram][1].modules[selectedModule])?.at(1)} 
                                    studentProgress={computeProgramProgressScore([programs[selectedProgram][1].modules[selectedModule]], student.progress)}
                                /> 
                            }
                        </>
                        : 
                        <div className="flex height-100 align-center justify-center" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
                            <div className="flex align-center wrap justify-center">
                                {programs?.map((program, i) => {
                                    const score = computeProgramProgressScore(program[1].modules, student.progress);

                                    return (
                                        <Button 
                                            key={program[0]} 
                                            className="flex column align-center"
                                            onClick={() => {setSelectedProgram(i); setSelectedModule(null)}}
                                            sx={{...styles.navigationButton(true), backgroundColor: score === 1? THEME.DOMINANT : THEME.BUTTON_ACCENT}} 
                                        >
                                            <AccountTreeIcon style={{width: 50, height: 50, marginBottom: 10}}/>
                                            <Tooltip title={program[1].name}>
                                                <Typography className="text-overflow-ellipsis overflow-auto width-100" color={COLORS.WHITE}>{program[1].name}</Typography>
                                            </Tooltip>
                                            <Typography className="text-overflow-ellipsis overflow-auto width-100" color={COLORS.WHITE}>{100*score}%</Typography>
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>
                    : <></>
                }
            </Container>
            <Loading loading={loading?.loading} setLoading={loading?.setLoading}/>
            <Notification notification={notification?.notification} setNotification={notification?.setNotification}/>
        </>
    )
}

export default StudentPage;


function getModuleProgress(studentId: string, id: string, module: moduleType): studentProgressType {
    const moduleProgress: studentProgressType = {
        id: id, 
        progress: 0,
        children: [],
        name: module.name,
    }

    const n = module.steps.length
    if (n) {
        const children: studentProgressType[] = module.steps.map(step => getStepProgress(studentId, step));
        moduleProgress.children = children;
        moduleProgress.progress = children.reduce((score, child) => child.progress + score, 0) / n
    }

    return moduleProgress;
}

function getStepProgress(studentId: string, step: stepType): studentProgressType {
    const stepProgress: studentProgressType = {
        progress: 0,
        children: [],
        name: step.name,
    }

    const n = step.entries.length
    if (n) {
        const children: studentProgressType[] = step.entries.map(entry => getEntryProgress(studentId, entry))
        stepProgress.children = children;
        stepProgress.progress = children.reduce((score, child) => child.progress + score, 0) / n
    }

    return stepProgress;
}

function getEntryProgress(studentId: string, entry: entryType): studentProgressType {
    const entryProgress: studentProgressType = {
        progress: 0,
        name: entry.name,
    }

    const reponseContent = ["select", "multiSelect", "rank", "rate", "prompt"]
    const n = entry.contents.filter(content => reponseContent.includes(content.type)).length
    if (n) {
        entryProgress.progress = entry.contents.reduce((score, content) => isValidResponse(content.type, content.responses.find(response => response.id === studentId)?.response)? 1 + score : score, 0) / n
    }

    return entryProgress;
}

function isValidResponse(type: contentTypes, response: any): boolean {
    switch (type) {
        case "rank": 
            if (response) return true;
            break;
        case "select":
            break;
        case "multiSelect":
            break;
        case "prompt":
            if (response) return true;
            break; 
        case "rate": 
            if (typeof response === "number") return true
            break;
        default: return false
    }
    return false;
}