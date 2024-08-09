import * as React from "react";

import { Backdrop, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, Snackbar, Tooltip, Typography } from '@mui/material';

import { theme } from "../theme";
import { COLORS } from "../constants";
import { propsPropogatePropsType, controlsArrayPropsType, loadingPropsType, notificationPropsType } from "../types";
import { Link } from "react-router-dom";

export function Notification(props: notificationPropsType) {
    const {notification, setNotification, ...other} = props;

    const {message, notify} = notification;
    const handleClose = () => {setNotification({message: "", notify: false});}

    return (
        <Snackbar 
            {...other}
            open={notify}
            message={message}
            onClose={handleClose}
            autoHideDuration={props.duration}
            anchorOrigin={{
                vertical: props.vertical || "top", 
                horizontal: props.horizontal || "right"
            }}
        />
    )
}

export function Loading(props: loadingPropsType) {
    const {loading, setLoading, ...other} = props;

    const {load, message} = loading;
    const handleClose = () => {setLoading({load: false, message: ""})};
    
    return (
        <Backdrop 
            open={load || false}
            sx={{
                zIndex: 10000,
                color: COLORS.WHITE,
            }}
            className="flex align-center column"
        >
            <div style={{width: "50%", margin: 2}}>
                <LinearProgress 
                    // color="success" 
                    style={{borderRadius: 10, height: 7}}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        '& .MuiLinearProgress-bar': {backgroundColor: theme.palette.secondary.main}
                    }}
                />
            </div>
            <Typography fontSize={14}>{message}</Typography>
        </Backdrop>
    )
}

export function useViewport() {
    const [width, setWidth] = React.useState(window.visualViewport?.width || window.innerWidth);

    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.visualViewport?.width || window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return { width };
}

export function useScreenOrientation() {
    const [orientation, setOrientation] = React.useState(window.screen.orientation.type)
    const updateOrientation = () => setOrientation(window.screen.orientation.type)

    React.useEffect(() => {
        window.addEventListener(
            'orientationchange',
            updateOrientation
        )
        
        return () => {
            window.removeEventListener(
                'orientationchange',
                updateOrientation
            )
        }
    }, [])

    return orientation
}

export function Confirm({...props}) {
    const {
        title,
        content, 
        agreeText,
        handleAgree,
        disagreeText, 
        agreeAutoFocus,
        handleDisagree,
        open, 
        setOpen,
        ...other
    } = props

    return (
        <Dialog
            open={open} 
            onClose={() => setOpen(false)}
            PaperProps={{style: {...props.style}}}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            
            <DialogActions>
                <Button 
                    style={{borderRadius: 0}}
                    onClick={handleDisagree} 
                    className="public-sans"
                    autoFocus={!agreeAutoFocus}
                >
                        {disagreeText}
                </Button>
                <Button 
                    style={{borderRadius: 0}}
                    onClick={handleAgree} 
                    className="public-sans"
                    autoFocus={agreeAutoFocus}
                >
                        {agreeText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export function ControlsArray(props: controlsArrayPropsType) {
    const {...domProps} = props;
    const {children, className, style, svgStyle, btnStyle, ...rest} = domProps;

    return (
        <div className={`flex align-center ${className || ""}`} style={{...style}}>
            {children? 
                React.Children.map(children, (child: React.ReactElement) => {
                    const {onClick, style, name, ...childProps} = child.props;
                    if (child.type === React.Fragment) return <></>
                    if (child.type === Link) return child;
                    
                    return (
                        <IconButton onClick={onClick} sx={{...btnStyle}}>
                            <Tooltip title={name}>
                                {<child.type {...childProps} style={{...svgStyle, ...style}}/>}
                            </Tooltip>
                        </IconButton>
                    )
                }) : <></>
            }
        </div>
    )
}

export function PropsPropogate(props: propsPropogatePropsType) {
    const {additionalProps, ...domProps} = props;
    const {className, style, children, ...rest} = domProps;
    
    return children? 
        <div className={`flex align-center ${className || ""}`} style={{...style}}>
            {React.Children.map(children, (child: React.ReactElement) => {
                return {...child, props: {...child.props, ...additionalProps, additionalProps: additionalProps}}
            })}
        </div> : <></>
}

export function StyledInput({...props}) {
    const {style, className, onChange, value, disableTooltip, ...rest} = props;

    return (
        <Tooltip title={value} disableHoverListener={disableTooltip} disableFocusListener={disableTooltip}>
            <input 
                {...rest}
                value={value}
                className={`${className || ""}`}
                style={{textAlign: "center", ...style}}
                onChange={(event) => {
                    if (onChange) onChange(event.target.value)
                }}
                onClick={(event) => event.currentTarget.parentElement?.click()}
            />
        </Tooltip>
    )
}