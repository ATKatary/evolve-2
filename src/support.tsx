import * as React from "react";

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, Slider, Snackbar, Typography } from '@mui/material';

import { COLORS, THEME } from "./constants";
import { styles } from "./styles";

export function Notification({...props}) {
    const {notification, setNotification, ...other} = props;

    const {message, notify} = notification;
    const handleClose = () => {setNotification({value: "", notify: false});}

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

export function Loading({...props}) {
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
            <Box sx={{width: "50%", margin: 2}}>
                <LinearProgress 
                    // color="success" 
                    style={{borderRadius: 10, height: 7}}
                    sx={{
                        backgroundColor: THEME.BACKGROUND_ACCENT,
                        '& .MuiLinearProgress-bar': {backgroundColor: THEME.ACTIVE_ACCENT}
                    }}
                />
            </Box>
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
                    style={{backgroundColor: !agreeAutoFocus? THEME.ACTIVE_ACCENT : THEME.BUTTON_ACCENT, color: THEME.BACKGROUND_ACCENT, borderRadius: 0}}
                    onClick={handleDisagree} 
                    className="public-sans"
                    autoFocus={!agreeAutoFocus}
                >
                        {disagreeText}
                </Button>
                <Button 
                    style={{backgroundColor: agreeAutoFocus? THEME.ACTIVE_ACCENT : THEME.BUTTON_ACCENT, borderRadius: 0}}
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

export function StyledInput({...props}) {
    const {style, className, onChange, ...rest} = props;

    return (
        <input 
            {...rest}
            style={{...style}}
            className={`${className || ""}`}
            onChange={(event) => {
                console.log(event.target.parentElement)
                if (onChange) onChange(event.target.value)
            }}
            onClick={(event) => event.currentTarget.parentElement?.click()}
        />
    )
}