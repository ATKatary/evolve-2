import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import "../assets/utils.css";
import { styles } from "../styles";
import Module from "../components/module";
import Sidebar from "../components/sidebar";
import { useCoach } from "../classes/coach";
import Program from "../components/program";
import { COLORS, THEME } from "../constants";
import { db, saveToCollection } from "../api/firebase";
import { LoadingContext, NotificationContext } from "..";
import { Breadcrumbs, Button, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { moduleType, objWithId, programType, stateType, studentProgressType } from "../types";
import { Loading, Notification, useScreenOrientation, useViewport } from "../support";
import { SelectField } from "../forms/fields";
import { getDevOrDepUrl, makeId, nullify } from "../utils";
import { deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/auth";


function CoachPage({...props}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(1);
    const [editedModule, setEditedModule] = React.useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = React.useState<number>(0);
    const [editedProgram, setEditedProgram] = React.useState<boolean>(false);
    const [selectedModule, setSelectedModule] = React.useState<number | null>(null);
    const [selectedProgram, setSelectedProgram] = React.useState<number | null>(null);
    const {coach, modules, setModules, programs, setPrograms, students, setStudents} = useCoach(state?.id);

    const sections = [
        {
            icon: PlayLessonIcon,
            name: "Programs",
            onClick: () => {setI(0)}
        },
        {
            icon: ViewModuleIcon,
            name: "Modules",
            onClick: () => {setI(1)}
        },
    ]

    const updateModule = (updatedModule: moduleType) => {
        if (selectedModule !== null) {
            setModules(modules.map((([id, module]: objWithId<moduleType>, i: number) => 
                i === selectedModule? [id, updatedModule] : [id, module]
            )))
        }
    }

    const updateProgram = async (updatedProgram: programType) => {
        setPrograms(programs.map(([id, program], i) => i === selectedProgram? [id, updatedProgram] : [id, program]));
    }

    const saveProgram = async () => {
        if (selectedProgram === null) return;
        loading?.setLoading({message: "Saving program...", load: true})
        const program = programs[selectedProgram]
        let saved = await saveToCollection(program[0], "programs", program[1], {});

        if (!coach.programs.find(programRef => programRef.id === program[0])) {
            const programRefs = programs.map(([id, _]) =>  doc(db, "programs", id));
            saved = await coach.save({programs: programRefs})
        }
        loading?.setLoading({message: null, load: false})

        if (saved) {
            notification?.setNotification({message: "Program updated.", notify: true});
        } else {
            notification?.setNotification({message: "Could not update program!", notify: true});
        }
    }

    const saveModule = async () => {
        if (selectedModule === null) return;
        loading?.setLoading({message: "Saving module...", load: true});
        
        const module = modules[selectedModule]
        let saved = await saveToCollection(module[0], "modules", nullify(module[1]), {})

        const moduleRefs = modules.map(([id, module]) =>  doc(db, "modules", id));
        saved = await coach.save({modules: moduleRefs});

        loading?.setLoading({message: null, load: false})

        if (saved) {
            notification?.setNotification({message: "Module updated.", notify: true})
        } else {
            notification?.setNotification({message: "Could not update module.", notify: true})
        }
    }

    const createModule = async () => {
        const newModule: moduleType = {
            steps: [
                { name: "Start", entries: [{name: `Start`, contents: [], displayMode: "doc"}] },
                { name: "Check-In", entries: [{name: `Check-In`, contents: [], displayMode: "doc"}] },
                { name: "Action Plan", entries: [{name: `Action Plan`, contents: [], displayMode: "doc"}] },
                { name: "End", entries: [{name: `End`, contents: [], displayMode: "doc"}] }
            ],
            name: "New module",
            icon: undefined,
            description: ""
        }
        setSelectedModule(modules.length);
        setModules([...modules, [makeId(20), newModule]]);
    }

    const createProgram = async () => {
        const newProgram: programType = {
            name: "New Program",
            description: "",
            modules: [],
            icon: null
        }
        setSelectedModule(programs.length);
        setPrograms([...programs, [makeId(20), newProgram]]);
    }

    const deleteModule = async (i: number) => {
        console.log("deleting...")
        setSelectedModule(null);

        loading?.setLoading({message: "Deleting module...", load: true})
        let deleted = await coach.save({modules: modules.filter(([id, module], j) => i !== j).map(([id, module]) => doc(db, "modules", id))});
        deleteDoc(doc(db, "modules", modules[i][0]))
        loading?.setLoading({message: null, load: false})

        setModules(modules.filter(((_, j) => i !== j)))
    }

    const deleteProgram = async (i: number) => {
        console.log("deleting...")
        setSelectedProgram(null);

        loading?.setLoading({message: "Deleting program...", load: true})
        let deleted = await coach.save({programs: programs.filter(([id, program], j) => i !== j).map(([id, program]) => doc(db, "programs", id))});
        deleteDoc(doc(db, "programs", programs[i][0]))
        loading?.setLoading({message: null, load: false})

        setPrograms(programs.filter(((_, j) => i !== j)))
    }

    const studentCheckedIn = async (moduleId: string, checked: boolean) => {
        const student = students[selectedStudent - 1];

        loading?.setLoading({message: `Checking ${student[1].name} off...`, load: true})
        
        let progress: studentProgressType[];
        if (student[1]?.progress) {
            progress = student[1]?.progress.map((module: studentProgressType) => {
                if (module.id === moduleId) {
                    return {
                        ...module, 
                        progress: checked? 0.5 : 0.25,
                        children: module.children?.map((step, i) => i == 1? {...step, progress: checked? 1 : 0} : step)
                    }
                } return module
            })
        } else {
            progress = [{
                id: moduleId, 
                progress: checked? 0.5 : 0.25,
                children: [{progress: checked? 1 : 0}, {progress: checked? 1 : 0}, {progress: 0}, {progress: 0}]
            }]
        }
        setStudents(students.map(([id, s], i) => i === selectedStudent - 1? [id, {...s, progress: progress}] : [id, s]))
        await saveToCollection(student[0], "users", {progress: progress}, {})
        loading?.setLoading({message: null, load: false})
    }

    return (
        <>
            <Container fluid className="width-100 column flex height-100 align-center" style={{maxWidth: 1400}}>
                <Sidebar 
                    j={i}
                    auth={auth}
                    coach={coach}
                    id={state?.id}
                    sections={sections}
                    students={students}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                    style={{borderRight: `1px solid ${COLORS.LIGHT_GRAY}`, left: 0}}
                />

                {i === 0?
                    selectedProgram !== null && programs[selectedProgram]?
                        <>
                            <Breadcrumbs sx={{fontSize: THEME.FONT.PARAGRAPH, top: 30, left: 250}} className="fixed">
                                <Link underline="hover" className="pointer" onClick={() => setSelectedProgram(null)}>Programs</Link>
                                <Typography fontSize={THEME.FONT.PARAGRAPH}>{programs[selectedProgram][1].name}</Typography>
                            </Breadcrumbs>
                            <Program 
                                modules={modules}
                                loading={loading}
                                edited={editedProgram}
                                saveProgram={saveProgram}
                                notification={notification}
                                setEdited={setEditedProgram}
                                updateProgram={updateProgram}
                                id={programs[selectedProgram][0]}
                                program={programs[selectedProgram][1]} 
                                key={`selected-${programs[selectedProgram][0]}`} 
                                deleteProgram={() => deleteProgram(selectedProgram)}
                            /> 
                        </>
                        : 
                        <div className="flex height-100 align-center justify-center" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
                            <div className="flex align-center wrap justify-center">
                                {programs?.map((program, i) => 
                                    <Button 
                                        key={program[0]} 
                                        className="flex column align-center"
                                        onClick={() => {setSelectedProgram(i)}}
                                        sx={{...styles.navigationButton(true)}} 
                                    >
                                        <AccountTreeIcon style={{width: 50, height: 50, marginBottom: 10}}/>
                                        {program[1].name}
                                    </Button>
                                )}
                                <Button 
                                    className="flex column align-center"
                                    onClick={() => {createProgram()}}
                                    sx={{...styles.navigationButton(true), backgroundColor: THEME.DOMINANT}} 
                                >
                                    <Typography className="text-overflow-ellipsis overflow-auto width-100" color={COLORS.WHITE} fontSize={THEME.FONT.TITLE}>+</Typography>
                                </Button>
                            </div>
                        </div>
                    : <></>
                }

                {i === 1?
                    selectedModule !== null && modules[selectedModule]?
                        <>
                            <Breadcrumbs sx={{fontSize: THEME.FONT.PARAGRAPH, top: 30, left: 250}} className="fixed">
                                <Link underline="hover" className="pointer" onClick={() => setSelectedModule(null)}>Modules</Link>
                                <Typography fontSize={THEME.FONT.PARAGRAPH}>{modules[selectedModule][1].name}</Typography>
                            </Breadcrumbs>
                            <Module 
                                isCoach
                                edited={editedModule}
                                saveModule={saveModule} 
                                setEdited={setEditedModule}
                                updateModule={updateModule} 
                                id={modules[selectedModule][0]}
                                studentCheckedIn={studentCheckedIn}
                                module={modules[selectedModule][1]} 
                                key={`selected-${modules[selectedModule][0]}`} 
                                deleteModule={() => deleteModule(selectedModule)}
                                student={selectedStudent? students[selectedStudent - 1][1] : undefined}
                                studentId={selectedStudent? coach.students[selectedStudent - 1].id : undefined}
                            /> 
                        </>
                        : 
                        <div className="flex height-100 align-center justify-center" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
                            <div className="flex align-center wrap justify-center">
                                {modules?.map((module, i) => 
                                    <Button 
                                        key={module[0]} 
                                        className="flex column align-center"
                                        onClick={() => {setSelectedModule(i)}}
                                        sx={{...styles.navigationButton(true)}} 
                                    >
                                        <MenuBookIcon style={{width: 50, height: 50, marginBottom: 10}}/>
                                        <Tooltip title={module[1].name}>
                                            <Typography className="text-overflow-ellipsis overflow-auto width-100" color={COLORS.WHITE}>{module[1].name}</Typography>
                                        </Tooltip>
                                    </Button>
                                )}
                                <Button 
                                    className="flex column align-center"
                                    onClick={() => {createModule()}}
                                    sx={{...styles.navigationButton(true), backgroundColor: THEME.DOMINANT}} 
                                >
                                    <Typography className="text-overflow-ellipsis overflow-auto width-100" color={COLORS.WHITE} fontSize={THEME.FONT.TITLE}>+</Typography>
                                </Button>
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

export default CoachPage;
