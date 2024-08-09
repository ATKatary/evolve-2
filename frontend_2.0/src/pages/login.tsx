import * as React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Typography } from "@mui/material";

import "../assets/utils.css";
import logo from "../assets/media/logo-tree.png";


import { styles } from "../styles";
import { COLORS, THEME } from "../constants";
import { NotificationContext } from "..";
import { loginInfoType } from "../types";
import { Notification } from "../support";
import { useAuth } from "../context/auth";
import { checkPassword, login } from "../api/user";
import { FormField, PassFormField } from "../forms/fields";
import { getDevOrDepUrl, useCustomState, validateEmail, validatePassword } from "../utils";
import Signup from "../components/signup";


function Login({...props}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const {isCoach, ...domProps} = props;
    const notification = React.useContext(NotificationContext);

    const [loginInfo, setLoginInfo] = useCustomState<loginInfoType>({});
    const [signup, setSignup] = React.useState<boolean>(isCoach? true : false);

    React.useEffect(() => {
        const loginWrapper = async () => {
            if (loginInfo.loggedIn && !loginInfo.resetPass) {
                if (await auth?.needsPasswordChange()) {
                    setLoginInfo({resetPass: true});
                } else if (auth?.user?.role === "coach") {
                    navigate(getDevOrDepUrl("coach"));
                } else if (auth?.user?.role === "student") {
                    navigate(getDevOrDepUrl("student"));
                }
            }

            if (loginInfo.message) {
                notification?.setNotification({message: loginInfo.message, notify: true});
                setLoginInfo({message: undefined});
            } else login(auth, loginInfo, setLoginInfo, navigate);
        }
        loginWrapper();
    }, [loginInfo]);

    React.useEffect(() => {
        checkPassword(auth, setLoginInfo);
    }, [auth?.isAuthenticated])

    const validateForm = async () => {
        if (!validateEmail(loginInfo.email)) setLoginInfo({status: 403, emailMessage: "Invalid email"});
        else if (!validatePassword(loginInfo.password)) setLoginInfo({status: 403, passMessage: "Password too short", emailMessage: undefined});
        else setLoginInfo({status: 200, emailMessage: undefined, passMessage: undefined});
    }

    const validateResetForm = async () => {
        if (!validatePassword(loginInfo.password)) setLoginInfo({status: 403, passMessage: "Password too short", emailMessage: undefined});
        else setLoginInfo({status: 201, emailMessage: undefined, passMessage: undefined});
    }

    const validateForgotForm = async () => {
        if (!validateEmail(loginInfo.email)) setLoginInfo({status: 403, emailMessage: "Invalid email", passMessage: undefined});
        else setLoginInfo({status: 300, emailMessage: undefined, passMessage: undefined});
    }

    return (
        <div className="width-100 column flex height-100 align-center justify-center">
            <div className="flex align-center" style={{marginBottom: 20}} onClick={() => {
                navigate(getDevOrDepUrl("evolve"))
            }}>
                <img src={logo} height="75px" className="margin-top-20px pointer"></img>
            </div>
            {!signup?
                !loginInfo.resetPass? 
                    <>
                    <FormField 
                        variant="outlined" 
                        placeholder="Email"
                        value={loginInfo.email}
                        helperText={loginInfo.emailMessage}
                        style={{...styles.formField()}} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLoginInfo({email: event.target.value})}
                    />
                    {!loginInfo.forgotPass?
                        <div className="flex column">
                            <PassFormField 
                                variant="outlined" 
                                value={loginInfo.password}
                                helperText={loginInfo.passMessage}
                                style={{...styles.formField()}} 
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLoginInfo({password: event.target.value})}
                            /> 
                            <Typography 
                                className="pointer"
                                onClick={() => {setLoginInfo({forgotPass: true})}}
                                sx={{...styles.formFieldHelper()}} 
                            >Forgot password</Typography>
                        </div>
                        : <></>
                    }
            
                    <Button sx={{...styles.button()}} variant="contained" onClick={() => !loginInfo.forgotPass? validateForm() : validateForgotForm()}>{!loginInfo.forgotPass? "Login" : "Send Reset Email"}</Button>
                    </>
                    : 
                    <>
                    <Typography fontSize={16} color={THEME.TEXT} style={{marginBottom: 20}}>Make a new password</Typography>
                    <PassFormField 
                        variant="outlined" 
                        value={loginInfo.password}
                        style={{...styles.formField()}} 
                        helperText={loginInfo.passMessage}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLoginInfo({password: event.target.value})}
                    />
            
                    <Button sx={{...styles.button()}} variant="contained" onClick={validateResetForm}>Update Password</Button>
                    </>
                : <Signup role={isCoach? "coach" : "student"}/>
            }
            {!loginInfo.forgotPass? 
                <Button 
                    sx={{...styles.button(), color: COLORS.LIGHT_GRAY, backgroundColor: COLORS.TRANSPARENT}} 
                    onClick={() => setSignup(!signup)}
                >
                    {signup? "Login" : "Signup"}
                </Button> : <></>
            }
        </div>
    )
}

export default Login;
