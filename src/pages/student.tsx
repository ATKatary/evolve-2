import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import "../assets/utils.css";
import { styles } from "../styles";
import { THEME } from "../constants";
import { stateType } from "../types";
import { LoadingContext, NotificationContext } from "..";
import { Loading, Notification, useScreenOrientation, useViewport } from "../support";
import { useStudent } from "../classes/student";


function StudentPage({...props}) {
    const navigate = useNavigate();
    const state = useLocation().state as stateType;
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const {width} = useViewport();
    const orientation = useScreenOrientation();

    const {student} = useStudent(state?.id);
    console.log("[AdminPage] (student) >>", student);

    return (
        <>
            <Container fluid className="width-100 column flex height-100 align-center justify-center">
            </Container>
            <Loading loading={loading?.loading} setLoading={loading?.setLoading}/>
            <Notification notification={notification?.notification} setNotification={notification?.setNotification}/>
        </>
    )
}

export default StudentPage;
