import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import SchoolIcon from '@mui/icons-material/School';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import "../assets/utils.css";
import { styles } from "../styles";
import Module from "../components/module";
import Sidebar from "../components/sidebar";
import { Coach, useCoach } from "../classes/coach";
import Program from "../components/program";
import { COLORS, FIELDS, THEME } from "../constants";
import { db, getFromCollection, saveToCollection } from "../api/firebase";
import { LoadingContext, NotificationContext } from "..";
import { Breadcrumbs, Button, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { emailType, entryType, moduleType, objWithId, programType, selectMenuOptionType, stateType, stepType, studentProgressType } from "../types";
import { Loading, Notification, useScreenOrientation, useViewport } from "../support";
import { ProgressField, SelectField } from "../forms/fields";
import { camelize, computeProgramProgressScore, getDevOrDepUrl, makeId, nullify } from "../utils";
import { DocumentReference, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/auth";
import { sendEmail } from "../api/evolve";


function CoachPage({...props}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(2);
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
        {
            icon: SchoolIcon,
            name: "Student",
            onClick: () => {setI(2)}
        },
    ]

    React.useEffect(() => {
        if (!auth?.user || !(auth.user instanceof Coach)) {
            const url = getDevOrDepUrl("evolve");
            if (url) navigate(url)
        }
    }, [auth?.user])
    
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

    const assignProgram = async (id: string, data: any) => {
        console.log("[Admin][assignProgram] (data) >>", data)
        loading?.setLoading({message: "Assigning program....", load: true})
        const updated = await updateStudentDoc(id, data);
        loading?.setLoading({message: null, load: false})

        const programIds = data?.programs || [];
        const updatedStudents: objWithId<any>[] = []
        if (students.find(([studentId, _]) => studentId === id)) {
            for (const [studentId, student] of students) {
                if (studentId === id && updated) {
                    let updatedStudent = {...student, ...data, programs: programIds?.map((programId: string) => doc(db, "programs", programId))}
                    console.log(updatedStudent)
                    updatedStudents.push([studentId, updatedStudent])
                } else {
                    updatedStudents.push([studentId, student])
                }
            }
        } else {
            updatedStudents.push(...students, [id, updated? data : {email: data.email}])
        }
        setStudents(updatedStudents)
    }

    const updateStudentDoc = async (id: string, data: any): Promise<boolean> => {
        const updatedData = {...data}
        const programIds = data.programs;
        
        if (programIds) {
            const student = students.find(([studentId, _]) => id === studentId);
            updatedData["programs"] = programIds?.map((programId: string) => doc(db, "programs", programId))

            updatedData["progress"] = student? student[1].progress || [] : [];

            for (const programId of programIds) {
                const program = programs.find(([id, _]) => id === programId);
                console.log("[Admin][updateStudentDoc] (program) >>", program)

                if (program) {
                    for (const module of program[1].modules) {
                        console.log(`[Admin][updateStudentDoc] >> initializing ${student?.[1].name} module ${module.id}`)
                        if (!student || !student[1].progress?.find((moduleProgress: studentProgressType) => moduleProgress.id === module.id)) {
                            updatedData["progress"] = [...updatedData["progress"], await initializeProgress(module.id)]
                        }
                    }
                }
            }
        } else {
            updatedData["programs"] = []
        }

        return await saveToCollection(id, "users", updatedData, {})
    }

    const initializeProgress = async (id?: string, step?: stepType, entry?: entryType): Promise<studentProgressType> => {
        if (id) {
             const module = await getFromCollection<moduleType>(id, "modules") as moduleType;
             const children = []
             for (const step of module.steps) children.push(await initializeProgress(undefined, step));
 
             return {
                 id: id, 
                 progress: 0,
                 children: children
             }
        } else if (step) {
             const children = []
             for (const entry of step.entries) children.push(await initializeProgress(undefined, undefined, entry))
             return {
                 progress: 0,
                 name: step.name, 
                 children: children
             }
        } else if (entry) {
             return {
                 progress: 0,
                 name: entry.name, 
             }
        }
 
        throw new Error("You must supply id, step, or entry to initalize Progress")
    }

    const getProgramName = (id: string) => {
        const program = programs.find(([programId, program]) => programId === id)

        if (program) return program[1].name
        return "Unnamed Program"
    }

    const getProgramModules = (id: string) => {
        const program = programs.find(([programId, program]) => programId === id)
        if (program) return program[1]?.modules.map(ref => ref.id) || []
        return []
    }

    return (
        <>
            <Container fluid className="width-100 column flex height-100 align-center" style={{maxWidth: 1400}}>
                <Sidebar 
                    j={i}
                    auth={auth}
                    coach={coach}
                    id={state?.id}
                    isCoach={true}
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
                                        <Tooltip title={program[1].name}>
                                            <Typography className="text-overflow-ellipsis overflow-auto width-100" color={COLORS.WHITE}>{program[1].name}</Typography>
                                        </Tooltip>
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

                { i === 2?
                    <div className="flex align-center column" style={{width: "80%", margin: "75px 0 0 225px"}}>
                    {selectedStudent?
                        <>
                        <Typography fontSize={THEME.FONT.HEADING} color={THEME.DOMINANT} style={{height: "50px"}}>{students[selectedStudent - 1][1].name}</Typography>
                        <Typography fontSize={THEME.FONT.SUB_HEADING} color={THEME.BUTTON_ACCENT}>Assigned programs</Typography>
                        <SelectField 
                            multiple={true}
                            value={students[selectedStudent - 1][1]?.programs?.map((ref: DocumentReference) => ref.id) || []}
                            style={{...styles.formField(), ...styles.adminSelect(), width: 275, marign: "0"}}
                            options={programs?.map(([id, program]) => ({id: id, name: program.name}))}
                            onChange={async (event: any) => assignProgram(students[selectedStudent - 1][0], {programs: event.target.value})}
                        />
                        
                        {students[selectedStudent - 1][1]?.programs?.map((ref: DocumentReference) => {
                            const id = ref.id;
                            
                            return (
                                <div className="flex justify-between align-center" style={{width: "80%"}}>
                                    <Typography sx={{...styles.formField(true), margin: "15px"}}>{getProgramName(id)}</Typography>
                                    <ProgressField 
                                        style={{width: "50%"}}
                                        value={computeProgramProgressScore(getProgramModules(id), students[selectedStudent - 1][1].progress)}
                                    />
                                </div>
                            )
                        })}
                        </> 
                        : <Typography fontSize={THEME.FONT.HEADING} color={THEME.DOMINANT} style={{height: "50px", opacity: 0.5}}>Select student to manage</Typography>
                    }
                    </div> : <></>
                }

                
            </Container>
            <Loading loading={loading?.loading} setLoading={loading?.setLoading}/>
            <Notification notification={notification?.notification} setNotification={notification?.setNotification}/>
        </>
    )
}

export default CoachPage;
