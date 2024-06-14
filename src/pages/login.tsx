import * as React from "react";

import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import logo from "../assets/media/logo-tree.png";

import "../assets/utils.css";
import { styles } from "../styles";
import { loginInfoType } from "../types";
import { NotificationContext } from "..";
import { useAuth } from "../context/auth";
import { Notification } from "../support";
import { Coach } from "../classes/coach";
import { Student } from "../classes/student";
import { COLORS, THEME } from "../constants";
import { checkPassword, login } from "../api/user";
import { FormField, PassFormField } from "../forms/fields";
import { addToLocalStorage, getDevOrDepUrl, useCustomState, validateEmail, validatePassword } from "../utils";


function Login({...props}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const notification = React.useContext(NotificationContext);
    const [loginInfo, setLoginInfo] = useCustomState<loginInfoType>({});

    React.useEffect(() => {
        const loginWrapper = async () => {
            if (loginInfo.loggedIn && auth?.user) {
                let url;
                
                if (auth.user instanceof Coach) {
                    url = getDevOrDepUrl("coach")
                } else if (auth.user instanceof Student) {
                    url = getDevOrDepUrl("student")
                }

                console.log("[Login] (url, auth.user) >>", url, auth.user)
                if (url) navigate(url, {state: {id: auth.id}})
                
            } if (loginInfo.message) {
                notification?.setNotification({message: loginInfo.message, notify: true, error: loginInfo.error, success: loginInfo.success});
                setLoginInfo({message: null, error: false, success: false});
            } else login(auth, loginInfo, setLoginInfo, navigate);
        }
        loginWrapper();
    }, [loginInfo, auth?.user]);

    React.useEffect(() => {
        checkPassword(auth, setLoginInfo);
    }, [auth?.isAuthenticated])

    const validateForm = async (login: boolean = true) => {
        if (!validateEmail(loginInfo.email)) setLoginInfo({status: 403, emailMessage: "Invalid email"});
        else if (!validatePassword(loginInfo.password)) setLoginInfo({status: 403, passMessage: "Password too short", emailMessage: null});
        else if (login) setLoginInfo({status: 200, emailMessage: null, passMessage: null});
        else setLoginInfo({emailMessage: null, passMessage: null});
    }

    return (
        <Container fluid className="width-100 column flex height-100 align-center justify-center">
            <div className="flex align-center">
                <img src={logo} height="75px" className="margin-top-20px pointer"></img>
            </div>
            <>
            <FormField 
                variant="outlined" 
                placeholder="Username"
                style={{...styles.formField}} 
                value={loginInfo.email || ""}
                helperText={loginInfo.emailMessage}
                inputStyle={{border: `1px solid ${COLORS.WHITE}`, borderRadius: 5}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setLoginInfo({email: event.target.value}); validateForm(false)}}
            />
            
            <PassFormField 
                variant="outlined" 
                style={{...styles.formField}} 
                // adornmentColor={COLORS.WHITE}
                value={loginInfo.password || ""}
                helperText={loginInfo.passMessage}
                inputStyle={{border: `1px solid ${COLORS.WHITE}`, borderRadius: 5}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setLoginInfo({password: event.target.value}); validateForm(false)}}
            />
    
            <Button sx={{...styles.button}} variant="contained" onClick={() => validateForm()}>Login</Button>
            </>
            
            <Notification notification={notification?.notification} setNotification={notification?.setNotification} duration={6000}/>
        </Container>
    )
}

export default Login;
