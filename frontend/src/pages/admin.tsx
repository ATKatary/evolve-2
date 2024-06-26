import * as React from "react";

import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../assets/utils.css";
import { styles } from "../styles";
import { useAdmin } from "../classes/admin";
import AdminPanel from "../components/adminPanel";
import { Button, Typography } from "@mui/material";
import { THEME, COLORS, FIELDS } from "../constants";
import { LoadingContext, NotificationContext } from "..";
import { Loading, Notification, useScreenOrientation, useViewport } from "../support";
import { auth, db, getFromCollection, saveToCollection } from "../api/firebase";
import { DocumentReference, doc } from "firebase/firestore";
import { entryType, moduleType, objWithId, programType, stepType, studentProgressType } from "../types";
import { createUserWithEmailAndPassword } from "firebase/auth";

function AdminPage({...props}) {
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const [i, setI] = React.useState<number>(0);
    const {students, coaches, setStudents, setCoaches, programs} = useAdmin();

    const createUser = async (data: any, updateCallback: CallableFunction) => {
        console.log("[Admin][createRow] >> creating student...")
        if (!data.email) {
            return
        }
        loading?.setLoading({message: "Creating user...", load: true});
        const user = await createUserWithEmailAndPassword(auth, data.email, "Evolve123")
        loading?.setLoading({message: null, load: false});

        if (user.user.uid) {
            updateCallback(user.user.uid, data)
            notification?.setNotification({message: "User created! Temp password is Evolve123", notify: true})
        }
    }

    const updateStudent = async (id: string, data: any) => {
        console.log("[Admin][updateStudent] (data) >>", data)
        loading?.setLoading({message: "Updating students....", load: true})
        const updated = await updateStudentDoc(id, data);
        loading?.setLoading({message: null, load: false})
        
        const updatedStudents: objWithId<any>[] = []
        if (students.find(([studentId, _]) => studentId === id)) {
            for (const [studentId, student] of students) {
                if (studentId === id && updated) {
                    let updatedStudent = {...student, ...data}
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
        const coachId = data.coach;
        const updatedData = {...data}
        
        const coach = await updateStudentCoach(id, coachId);
        
        if (coach) {
            updatedData["coach"] = [coach.name, doc(db, "users", coachId)]
        } else {
            updatedData["coach"] = []
        }

        return await saveToCollection(id, "users", updatedData, {})
    }

    const updateStudentCoach = async (id: string, coachId?: string) => {
        if (!coachId || !id) return;
        
        const studentDoc = await getFromCollection(id, "users") as any;
        const coach = await getFromCollection(coachId, "users") as any;
        
        const prevId = studentDoc?.coach? studentDoc.coach[1]?.id : undefined;
        const prevCoach = prevId? await getFromCollection(prevId, "users") as any : undefined;
        
        if (prevCoach) {
            await updateCoach(prevId, {
                students: prevCoach.students.filter((studentRef: DocumentReference) => studentRef.id !== id)
            })
        }
        
        if (coach) {
            const ref = doc(db, "users", id);
            let updatedCoachStudents: DocumentReference[] = [ref];
            if (coach.students.length > 0) {
                updatedCoachStudents = coach.students.filter((studentRef: DocumentReference) => studentRef.id !== id)
                updatedCoachStudents = [...updatedCoachStudents, ref]
            } 
            await updateCoach(coachId, {
                students: updatedCoachStudents
            })
        }
        return coach
    }

    const updateCoach = async (id: string, data: any) => {
        loading?.setLoading({message: "Updating coaches....", load: true})
        const updated = await saveToCollection(id, "users", {...data}, {})
        loading?.setLoading({message: null, load: false})
        
        let updatedCoaches: objWithId<any>[];
        if (coaches.find(([studentId, _]) => studentId === id)) { 
            updatedCoaches = coaches.map((([coachId, coach]) => [coachId, id === coachId? ({...coach, ...data}) : coach]))
        } else {
            updatedCoaches = [...coaches, [id, updated? data : {email: data.email}]]
        }
        setCoaches(updatedCoaches)
    }

    return (
        <>
            <Container fluid className="width-100 column flex align-center justify-end" style={{maxWidth: 1400}}>
                <Typography fontSize={36} color={THEME.DOMINANT} style={{height: "50px", marginTop: 75}}>Evolve</Typography>
                <div className="flex align-center">
                    <Button sx={{...styles.adminHeaderButton(i === 0)}} onClick={() => setI(0)}>Students</Button>
                    <Button sx={{...styles.adminHeaderButton(i === 1)}} onClick={() => setI(1)}>Coaches</Button>
                </div>

                {/* Students */}
                {i === 0?
                    <AdminPanel 
                        rows={students}
                        saveRow={updateStudent}
                        style={{...styles.adminPanel()}}
                        createRow={(data: any) => createUser(data, updateStudent)}
                        fields={[
                            ...FIELDS.BASE, 
                            ...FIELDS.STUDENTS_ADMIN(
                                coaches.map(([id, coach]) => ({name: coach.name, id: id}))
                            )
                        ]}
                    /> : <></>
                }

                {/* Coaches */}
                {i === 1?
                <AdminPanel 
                    rows={coaches}
                    saveRow={updateCoach}
                    style={{...styles.adminPanel()}}
                    createRow={(data: any) => createUser(data, updateCoach)}
                    fields={[
                        ...FIELDS.BASE, 
                        ...FIELDS.COACHES(students.map(([id, student]) => ({name: student.name, id: id})))
                    ]}
                /> : <></>
                }
            </Container>
            <Loading loading={loading?.loading} setLoading={loading?.setLoading}/>
            <Notification notification={notification?.notification} setNotification={notification?.setNotification}/>
        </>
    )
}

export default AdminPage;
