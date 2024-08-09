import { Button, Typography } from "@mui/material";

import { Link } from "react-router-dom";

import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import { makeId } from "../utils";
import { styles } from "../styles";
import { COLORS, THEME } from "../constants";
import { navRailPropsType, navArrayPropsType, navRailLinkPropsType } from "../types/nav";
import { ControlsArray } from ".";

export function NavRail(props: navRailPropsType) {
    const {links, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    return (
        <div style={{...styles.navRail(), ...style}} className={`flex align-center justify-center ${className || ""}`}>
            {links.map(link => {
                return <NavRailLink {...link} key={makeId()} style={{textDecoration: "none"}}/>
            })}
        </div>
    )
}

export function NavArray(props: navArrayPropsType) {
    const {links, onAdd, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    return (
        <div className={`flex align-center ${className || ""}`}>
            {links.map(link => {
                return (
                    <NavRailLink 
                        {...link} 
                        seperator=""
                        key={makeId()} 
                        className="flex align-center justify-center"
                        style={{padding: 0, ...styles.navArrayLink(), ...style}}
                    />
                )
            })}
            {onAdd?
                <NavRailLink>
                    <div 
                        className="flex align-center justify-center"
                        style={{padding: 0, ...styles.navArrayLink(undefined, THEME.SUCCESS), ...style}}
                    >
                        <ControlsArray svgStyle={{color: COLORS.WHITE}}>
                            <AddCircleRoundedIcon name="add" onClick={onAdd}/>
                        </ControlsArray>
                    </div>
                </NavRailLink> : <></>
            }
        </div>
    )
}

export function NavRailLink(props: navRailLinkPropsType) {
    const {state, title, active, seperator, disabled, ...domProps} = props;
    const {style, textStyle, className, href, onClick, children, textFontSize, textHoverColor, ...rest} = domProps;

    return (
        <>
        {children?
            children
            :
            onClick?
                <Button 
                    onClick={onClick}
                    disabled={disabled}
                    sx={{textTransform: "none"}}
                    className={`pointer ${className || ""}`}
                    style={{...styles.navRailLink(), ...style}}
                >
                    <Typography sx={{...styles.navRailLinkText(active)}} style={{...textStyle}}>
                        {title} {seperator !== undefined? seperator : "/"}
                    </Typography>
                </Button>
                :
                href? 
                    <Link 
                        state={state}
                        to={href as string}
                        className={`pointer ${className || ""}`}
                        style={{...styles.navRailLink(), ...style}}
                    >
                        <Typography sx={{...styles.navRailLinkText(active, textFontSize, textHoverColor)}} style={{...textStyle}}>
                            {title} {seperator !== undefined? seperator : "/"}
                        </Typography>
                    </Link>
                    :
                    <Typography sx={{...styles.navRailLinkText(true, textFontSize, textHoverColor)}} style={{...textStyle}}>
                        {title}
                    </Typography>
        }
        </>
    )
}
