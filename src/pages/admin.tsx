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

function AdminPage({...props}) {
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const {students, coaches} = useAdmin();
    const [i, setI] = React.useState<number>(0);

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
                        style={{...styles.adminPanel}}
                        fields={[
                            ...FIELDS.BASE, 
                            ...FIELDS.STUDENTS(coaches.map(coach => ({name: coach[1].name, id: coach[0]})))
                        ]}
                    /> : <></>
                }

                {/* Coaches */}
                {i === 1?
                <AdminPanel 
                    rows={coaches}
                    style={{...styles.adminPanel}}
                    fields={[
                        ...FIELDS.BASE, 
                        ...FIELDS.COACHES(students.map(student => ({name: student[1].name, id: student[0]})))
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
