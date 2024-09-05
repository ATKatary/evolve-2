import * as React from "react";

import { studentType } from "./user";
import { SxProps } from "@mui/material";
import { entryType, programType, responseType, submissionType } from "./program";
import { Student } from "../classes/student";
import { Program } from "../classes/program";
import { Step } from "../classes/step";
import { Coach } from "../classes/coach";

/*** Notifications ***/
export type notificationType = {notify?: boolean, message?: string, error?: boolean, success?: boolean};
export type notificationContextType = {
    notification: notificationType
    setNotification: (notification: notificationType) => void
} | null;
export type notificationPropsType = {
    notification: notificationType
    setNotification: (notification: notificationType) => void

    duration?: number
    vertical?: "top" | "bottom" 
    horizontal?: "center" | "right" | "left" 
}

/*** Loading ***/
export type loadingType = {
    load?: boolean
    message?: string
}
export type loadingContextType = {
    loading: loadingType
    setLoading: (loading: loadingType) => any
}
export type loadingPropsType = {
    loading: loadingType
    setLoading: (loading: loadingType) => void
}

/*** Login ***/
export type loginInfoType = {
    status?: number
    message?: string
    loggedIn?: boolean
    
    email?: string
    emailMessage?: string
    
    password?: string
    resetPass?: boolean
    forgotPass?: boolean
    passMessage?: string
    passConfirm?: string

    error?: boolean
    success?: boolean
};

/*** Signup ***/
export type signupInfoType = {
    email?: string
    emailMessage?: string

    password?: string
    confirmPassword?: string 
    passwordMessage?: string 
    confirmPasswordMessage?: string 

    firstName?: string 
    firstNameMessage?: string 

    lastName?: string 
    lastNameMessage?: string 

    parentalEmail?: string 
    parentalEmailMessage?: string 

    calendlyLink?: string 
    calendlyLinkMessage?: string
}

export type signupPropsType = {
    role: "student" | "coach"
}

/*** Utility ***/
export type itemType = {id: string, text: string}
export type confirmType = {
    title?: string
    editing?: string
    content?: string
    required?: boolean
    openDialogue?: boolean
    callback?: CallableFunction
}

export type confirmContextType = {
    confirm: confirmType
    setConfirm: (confirm: confirmType) => void
    confirmRequired: (callback?: CallableFunction, required?: boolean, title?: string, content?: string) => void
}

export type stateType = {
    id: string 
    
    prevName?: string
    prevState?: stateType
} | undefined

export type navigationLinkType = {
    name: string 
    state: stateType
}

export type interfaceStateType = {
    update?: boolean
    edited?: boolean
    watching?: boolean 
    initialized?: boolean
}

export type emailMessageType = {
    subject: string
    html: string 
    text?: string
}

export type emailType = {
    to?: string[] | string 
    toUids?: string[]
    
    cc?: string[]
    ccUids?: string[]
    
    bcc?: string[]
    bccUids?: string[]
    message: emailMessageType 
}

/*** Styles ***/
export type stylesType = {
    title: ((...args: any) => React.CSSProperties)

    button: ((...args: any) => (React.CSSProperties | SxProps))
    formField: ((...args: any) => (React.CSSProperties | SxProps))
    formFieldHelper: ((...args: any) => (React.CSSProperties | SxProps))

    adminSelect: ((...args: any) => (React.CSSProperties | SxProps))
    
    customTableCell: ((...args: any) => (React.CSSProperties | SxProps))
    
    editable: ((...args: any) => React.CSSProperties)

    navRail: ((...args: any) => React.CSSProperties)
    navRailLink: ((...args: any) => React.CSSProperties)
    navArrayLink: ((...args: any) => React.CSSProperties)
    navRailLinkText: ((...args: any) => (React.CSSProperties | SxProps))

    divider: ((...args: any) => React.CSSProperties | SxProps)

    sidebarSectionButton: ((...args: any) => (React.CSSProperties | SxProps))
    
    stepButton: ((...args: any) => (React.CSSProperties | SxProps))
    entryButton: ((...args: any) => (React.CSSProperties | SxProps))
    
    entryHeader: ((...args: any) => (React.CSSProperties | SxProps))
    promptEntry: ((...args: any) => (React.CSSProperties | SxProps))
    entryDivider: ((...args: any) => (React.CSSProperties | SxProps))
    tabDeleteButton: ((...args: any) => (React.CSSProperties | SxProps))
    

    saveContentButton: ((...args: any) => (React.CSSProperties | SxProps))
    moveContentButton: ((...args: any) => (React.CSSProperties | SxProps))
    deleteContentButton: ((...args: any) => (React.CSSProperties | SxProps))
    programHeaderButton: ((...args: any) => (React.CSSProperties | SxProps))
} 

export type timeType = {
    hours: number 
    minutes: number 
    seconds: number 
}


/*** Controls ***/
export type controlsArrayPropsType = {
    className?: string
    style?: React.CSSProperties
    btnStyle?: React.CSSProperties | SxProps
    svgStyle?: React.CSSProperties | SxProps
    children?: React.ReactElement[] | React.ReactElement
}

/*** PropsPropogate ***/
export type propsPropogatePropsType = {
    additionalProps?: any 

    className?: string
    style?: React.CSSProperties
    children?: React.ReactElement | React.ReactElement[]
}


/*** AndroidSwitch ***/
export type anroidSwitchPropsType = {
    onText: string 
    offText: string 
    checked?: boolean 
    onCheck?: (checked: boolean) => any 

    style?: SxProps
    className?: string 
    contClassName?: string 
    contStyle?: React.CSSProperties
}

/*** CoachPage ***/
export type coachPagePropsType = {
    
}

/*** Sidebar ***/
export type sidebarPropsType = {
    coach?: Coach
    selected: number 
    isCoach?: boolean 
    students?: studentType[]
    
    sid?: string 
    setSid?: (sid: string) => any 

    className?: string 
    style?: React.CSSProperties
    children?: React.ReactElement | React.ReactElement[]
}

/*** ManageStudent ***/
export type manageStudentPropsType = {
    sid?: string
    student: Student
    programs: programType[]

    className?: string 
    style?: React.CSSProperties
}

/*** ProgramComponent ***/
export type programComponentPropsType = {
    sid?: string 
    program: Program
    student?: Student
    isCoach?: boolean

    pid: string 
    onDelete?: () => any 
    setPid: (pid?: string) => any 

    className?: string 
    style?: React.CSSProperties
}

export type programNavPropsType = {
    pid: string 
    sid?: string 
    program: Program
    student?: Student
    isCoach?: boolean

    onDelete?: () => any 
    setMid: (mid?: string) => any 
    
    className?: string 
    style?: React.CSSProperties
}   

/*** ModuleComponent ***/
export type moduleComponentPropsType = {
    sid?: string
    mid: string
    isCoach?: boolean

    onDelete?: () => any 
     
    className?: string 
    style?: React.CSSProperties
}

/*** StepComponent ***/
export type stepComponentPropsType = {
    step: Step
    sid?: string 
    edit?: boolean
    locked?: boolean
    isCoach?: boolean

    onSave?: () => any
    onSubmit?: () => any
    onUnsubmit?: () => any
    onCheckIn?: (event: any, checkedIn: Boolean) => any

    submission?: submissionType
    type: "checkIn" | "start" | "actionPlan" | "end"

    className?: string 
    style?: React.CSSProperties
}

/*** EntryComponent ***/
export type entryComponentPropsType = {
    i: number 
    setI: (i: number) => any 
    
    sid?: string
    edit?: boolean
    locked?: boolean
    isCoach?: boolean
    entries: entryType[]
    displayMode: "slide" | "doc"

    onDelete: (id: String) => any

    onResponse: (id: String, data: any) => any

    className?: string 
    onChange: (id: String, data: any) => any
    style?: React.CSSProperties
}

export type entryPropsType = {
    sid?: string 
    edit?: boolean
    locked?: boolean
    entry: entryType
    isCoach?: boolean

    onDelete: () => any

    response?: any
    onResponse: (data: any) => any

    className?: string 
    style?: React.CSSProperties
    onChange: (data: any) => any
}

export type entrySettingsPropsType = {
    disabled?: boolean 
    onUp?: () => any
    onDown?: () => any
    onDelete?: () => any

    className?: string 
    style?: React.CSSProperties
}