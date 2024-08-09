import * as React from "react";

import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';

import logo from "../assets/media/logo-tree.png";

import { styles } from "../styles";
import { Button } from "@mui/material";
import { sendEmail } from "../api/evolve";
import { ControlsArray } from "../support";
import { sidebarPropsType } from "../types";
import { EMAIL, THEME } from "../constants";
import { SelectField } from "../forms/fields";
import { LoadingContext, NotificationContext } from "..";
import { getDevOrDepUrl, loadAndNotify } from "../utils";
import { useAuth } from "../context/auth";

function Sidebar(props: sidebarPropsType) {
    const auth = useAuth();
    const {coach, selected, isCoach, students, sid, setSid, ...domProps} = props;
    const {style, className, children, ...rest} = domProps;

    const navigate = useNavigate();
    const loading = React.useContext(LoadingContext);
    const notification = React.useContext(NotificationContext);

    const student = React.useMemo(() => students?.find(student => student.id === sid), [sid]);

    const nudge = async () => {
        if (student && coach?.obj) {
            loadAndNotify(
                sendEmail, 
                [{
                    to: [student.email],
                    cc: [coach.obj.email],
                    message: {
                        subject: "Your Coach Nudged You!",
                        html: EMAIL.TEMPLATES.NUDGE(student.name, coach.obj.name)
                    }
                }], 
                loading, 
                `Nudging ${student.name}`, 

                notification, 
                `${student.name} has been nudged!`
            )
        }
    }

    return (
        <div style={{width: 225, ...style}} className={`fixed height-100 ${className || ""}`}>
            <div className="flex align-center justify-center" style={{marginTop: 100}}>
                <img src={logo} height="60px" className="margin-top-20px pointer"></img>
            </div>
            <div className="flex align-center column" style={{zIndex: 1, padding: 20}}>
                <ControlsArray>
                    <ExitToAppIcon name="logout" onClick={async () => {
                        await auth?.logout(); 
                        navigate(getDevOrDepUrl("evolve"))
                    }}/>
                </ControlsArray>
                {isCoach && students?
                    <>
                    <SelectField   
                        value={sid}
                        sx={{...styles.formField()}}
                        onChange={event => {if (setSid) setSid(event.target.value)}}
                        style={{margin: "10px 0 5px 0", width: 150, height: 40, opacity: sid? 1 : 0.5}}
                        options={[{id: 0, name: "View Student", style: {opacity: 0.5}}, ...students.map(student => ({id: student.id, name: student.name}))]}
                    />
                    <ControlsArray>
                        <NotificationsActiveRoundedIcon 
                            name="nudge" 
                            onClick={nudge}
                            sx={{color: sid? THEME.BUTTON_ACCENT : ""}}
                        />
                    </ControlsArray>
                    </> : <></>
                }
            </div>
            {children? 
                React.Children.map(children, (child: React.ReactElement, i: number) => {
                    const {onClick, sx, style, name, ...childProps} = child.props;
                    if (child.type === React.Fragment) return <></>
                    
                    return (
                        <Button 
                            onClick={onClick}
                            style={{...style}}
                            className="width-100 flex align-center"
                            sx={{...styles.sidebarSectionButton(i === selected), ...sx}}
                        >
                            {<child.type {...childProps} style={{...style}}/>}
                        </Button>
                    )
                }) : <></>
            }
        </div>
    )
}

export default Sidebar;
