import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

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
import { saveToCollection } from "../api/firebase";
import { LoadingContext, NotificationContext } from "..";
import { Breadcrumbs, Button, Link, Typography } from "@mui/material";
import { moduleType, objWithId, programType, stateType } from "../types";
import { Loading, Notification, useScreenOrientation, useViewport } from "../support";
import { SelectField } from "../forms/fields";


function CoachPage({...props}) {
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(0);
    const [editedModule, setEditedModule] = React.useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = React.useState<number>(0);
    const [selectedModule, setSelectedModule] = React.useState<number | null>(null);
    const [selectedProgram, setSelectedProgram] = React.useState<number | null>(null);
    const {coach, modules, setModules, programs, setPrograms, students} = useCoach(state?.id);

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
        console.log("[Program][updateProgram] (updatedProgram) >>", updatedProgram);

        if (selectedProgram === null) return;
        loading?.setLoading({message: "Updating program...", load: true})
        const program = programs[selectedProgram]
        console.log("[Program][updateProgram] (program) >>", program);
        
        const saved = await saveToCollection(program[0], "programs", updatedProgram, {})
        loading?.setLoading({message: null, load: false})

        if (saved) {
            setPrograms(programs.map(([id, program], i) => i === selectedProgram? [id, updatedProgram] : [id, program]));
            notification?.setNotification({message: "Program updated.", notify: true});
        } else {
            notification?.setNotification({message: "Could not update program!", notify: true});
        }
    }

    const saveModule = async () => {
        if (selectedModule === null) return;
        
        const module = modules[selectedModule]
        loading?.setLoading({message: "Saving module...", load: true})
        const saved = await saveToCollection(module[0], "modules", module[1], {})
        loading?.setLoading({message: null, load: false})

        if (saved) {
            notification?.setNotification({message: "Module updated.", notify: true})
        } else {
            notification?.setNotification({message: "Could not update module.", notify: true})
        }
    }
    return (
        <>
            <Container fluid className="width-100 column flex height-100 align-center" style={{maxWidth: 1400}}>
                <Sidebar 
                    j={i}
                    sections={sections}
                    style={{borderRight: `1px solid ${COLORS.LIGHT_GRAY}`, left: 0}}
                />
                <div className="fixed flex align-center" style={{left: 250, top: 80, zIndex: 1}}>
                    <SelectField 
                        className="fixed"
                        value={selectedStudent}
                        onChange={(event: any) => setSelectedStudent(event.target.value)}
                        sx={{...styles.formField, margin: 0, width: 150, height: 40, opacity: selectedStudent? 1 : 0.5}}
                        options={[{id: 0, name: "View Student", style: {opacity: 0.5}}, ...students.map((student, i) => ({id: i + 1, name: student[1]}))]}
                    />
                </div>
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
                                notification={notification}
                                updateProgram={updateProgram}
                                id={programs[selectedProgram][0]}
                                program={programs[selectedProgram][1]} 
                                key={`selected-${programs[selectedProgram][0]}`} 
                            /> 
                        </>
                        : 
                        <div className="flex align-center flex-wrap justify-center height-100" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
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
                                module={modules[selectedModule][1]} 
                                key={`selected-${modules[selectedModule][0]}`} 
                                studentId={selectedStudent? coach.students[selectedStudent - 1].id : undefined}
                            /> 
                        </>
                        : 
                        <div className="flex align-center flex-wrap justify-center height-100" style={{width: "calc(100% - 225px)", margin: "0 0 0 225px"}}>
                            {modules?.map((module, i) => 
                                <Button 
                                    key={module[0]} 
                                    className="flex column align-center"
                                    onClick={() => {setSelectedModule(i)}}
                                    sx={{...styles.navigationButton(true)}} 
                                >
                                    <MenuBookIcon style={{width: 50, height: 50, marginBottom: 10}}/>
                                    {module[1].name}
                                </Button>
                            )}
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
