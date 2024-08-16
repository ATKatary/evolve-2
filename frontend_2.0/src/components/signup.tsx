import * as React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Typography } from "@mui/material";

import "../assets/utils.css";

import { styles } from "../styles";
import { NotificationContext } from "..";
import { signupInfoType, signupPropsType } from "../types";
import { useAuth } from "../context/auth";
import { useMutation } from "@apollo/client";
import { CREATE_COACH, CREATE_STUDENT } from "../mutations";
import { FormField, PassFormField } from "../forms/fields";
import { getDevOrDepUrl, useCustomState, validateEmail, validatePassword, validateSignupForm } from "../utils";
import { sendEmail } from "../api/evolve";

function Signup(props: signupPropsType) {
    const {role, ...domProps} = props;
    
    const auth = useAuth();
    const navigate = useNavigate();
    const notification = React.useContext(NotificationContext);
    const [signupInfo, setSignupInfo] = useCustomState<signupInfoType>({});

    const [createCoach] = useMutation(CREATE_COACH);
    const [createStudent] = useMutation(CREATE_STUDENT);
    const isCoach = React.useMemo(() => role === "coach", [role]);

    const signup = async () => {
        const [valid, messages] = validateSignupForm(signupInfo, isCoach);

        if (valid && signupInfo.email && signupInfo.password && signupInfo.firstName && signupInfo.lastName) {
            const uid = await auth?.signup(signupInfo.email, signupInfo.password, signupInfo.firstName, signupInfo.lastName, role)

            if (uid?.message === "Firebase: Error (auth/email-already-in-use).") {
                notification?.setNotification({message: "Email already in use.", notify: true});
                return;
            } else if (isCoach && signupInfo.calendlyLink) { 
                await createCoach({variables: {
                    id: uid, 
                    first: signupInfo.firstName, 
                    last: signupInfo.lastName, 
                    email: signupInfo.email, 
                    password: signupInfo.password,
                    calendly: signupInfo.calendlyLink
                }})
            }
            else if (signupInfo.parentalEmail) {
                await createStudent({variables: {
                    id: uid, 
                    first: signupInfo.firstName, 
                    last: signupInfo.lastName, 
                    email: signupInfo.email, 
                    password: signupInfo.password,
                    parental: signupInfo.parentalEmail
                }})

                await sendEmail({
                    to: ["s.napier00@gmail.com"],
                    message: {
                        subject: "Welcome to Evolve!",
                        html: `${signupInfo.firstName} ${signupInfo.lastName} (${signupInfo.email}) has signed up for Evolve! Please assign them a coach.`
                    }
                });
            }

            navigate(getDevOrDepUrl("sign"));
        }
    }
    return (
        <>
            <FormField 
                variant="outlined" 
                placeholder="First name"
                value={signupInfo.firstName}
                style={{...styles.formField()}} 
                helperText={signupInfo.firstNameMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSignupInfo({firstName: event.target.value})}
            />

            <FormField 
                variant="outlined" 
                placeholder="Last name"
                value={signupInfo.lastName}
                style={{...styles.formField()}} 
                helperText={signupInfo.lastNameMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSignupInfo({lastName: event.target.value})}
            />

            <FormField 
                variant="outlined" 
                placeholder="Email"
                value={signupInfo.email}
                style={{...styles.formField()}} 
                helperText={signupInfo.emailMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSignupInfo({email: event.target.value})}
            />

            <FormField 
                variant="outlined" 
                style={{...styles.formField()}} 
                placeholder={isCoach? "Calendly link" : "Parental email"}
                value={isCoach? signupInfo.calendlyLink : signupInfo.parentalEmail}
                helperText={isCoach? signupInfo.calendlyLinkMessage : signupInfo.parentalEmailMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (isCoach) {
                        setSignupInfo({calendlyLink: event.target.value})
                    } else {
                        setSignupInfo({parentalEmail: event.target.value})
                    }
                }}
            />

            <PassFormField 
                variant="outlined" 
                placeholder="Password"
                value={signupInfo.password}
                style={{...styles.formField()}} 
                helperText={signupInfo.passwordMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSignupInfo({password: event.target.value})}
            />
            
            <PassFormField 
                variant="outlined" 
                value={signupInfo.confirmPassword}
                placeholder="Confirm password"
                style={{...styles.formField()}} 
                helperText={signupInfo.confirmPasswordMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSignupInfo({confirmPassword: event.target.value})}
            />
    
            <Button sx={{...styles.button()}} variant="contained" onClick={signup}>{"Signup"}</Button>
        </>
    )
}

export default Signup;
