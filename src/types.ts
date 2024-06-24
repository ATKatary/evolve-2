import { SxProps } from "@mui/material";
import { DocumentReference } from "firebase/firestore";
import React, { MouseEventHandler } from "react";

/*** Notifications ***/
export type NotificationType = {notify: boolean, message: string};
export type NotificationContextType = {
    notification: NotificationType, 
    setNotification: CallableFunction
} | null;

/*** Loading ***/
export type loadingType = {
    load: boolean
    message: string
}

export type LoadingContextType = {
    loading: loadingType
    setLoading: CallableFunction
}

/*** Login ***/
export type loginInfoType = {
    status: number
    message: string
    loggedIn: boolean
    type: "signup" | "login"
    
    name: string 
    nameMessage: string 
    
    email: string
    emailMessage: string
    
    password: string
    resetPass: boolean
    forgotPass: boolean
    passMessage: string
    passConfirm: string

    error?: boolean, 
    success?: boolean
};

/*** Utility ***/
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

export type selectMenuOptionType = {
    name: string
    style?: React.CSSProperties
    id: string | number | undefined | readonly string[]
}

export type fieldType = {
    name: string 
    editable?: boolean 
    onChange?: CallableFunction
    style?: React.CSSProperties
    type: "text" | "select" | "multiSelect" | "checkbox" | "total" 
    
    options: selectMenuOptionType[]
}

export type objWithId<T> = [string, T]

export type sidebarSectionType = {
    icon: any
    name: string 
    onClick: MouseEventHandler<HTMLButtonElement>
}

export type confirmType = {
    title?: string
    editing?: string
    content?: string
    required?: boolean
    openDialogue?: boolean
    callback: CallableFunction
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

/*** User ***/
export type userRoleType = "student" | "admin" | "coach"
export type userType = {
    email: string
    name: string 
    role: userRoleType

}

/*** Program ***/
export type programType = {
    icon: any
    name: string 
    description: string 

    modules: DocumentReference[]
}

export type studentProgressType = {
    id?: string 
    name?: string 
    progress: number
    children?: studentProgressType[]
}

export type moduleType = {
    icon: any
    name: string 
    description: string 

    steps: stepType[]
}

export type stepType = {
    name: string 

    entries: entryType[]
}

export type entryType = {
    name: string 
    displayMode: "doc" | "slides"

    contents: contentType[]
}

export type contentTypes = "text" | "select" | "multiSelect" | "rank" | "rate" | "prompt" | "email"

export type contentType = {
    data: any 
    type: contentTypes
    responses: responseType[]
}

export type responseType = {
    id: string 
    response: any
}

export type stylesType = {
    tabs: ((...args: any) => (React.CSSProperties | SxProps))
    title: ((...args: any) => (React.CSSProperties | SxProps))
    button: ((...args: any) => (React.CSSProperties | SxProps))
    tabLabel: ((...args: any) => (React.CSSProperties | SxProps))
    formField: ((...args: any) => (React.CSSProperties | SxProps))
    adminPanel: ((...args: any) => (React.CSSProperties | SxProps))
    adminTable: ((...args: any) => (React.CSSProperties | SxProps))
    stepButton: ((...args: any) => (React.CSSProperties | SxProps))
    entryButton: ((...args: any) => (React.CSSProperties | SxProps))
    adminSelect: ((...args: any) => (React.CSSProperties | SxProps))
    entryHeader: ((...args: any) => (React.CSSProperties | SxProps))
    promptEntry: ((...args: any) => (React.CSSProperties | SxProps))
    tabIndicator: ((...args: any) => (React.CSSProperties | SxProps))
    entryDivider: ((...args: any) => (React.CSSProperties | SxProps))
    tabDeleteButton: ((...args: any) => (React.CSSProperties | SxProps))
    customTableCell: ((...args: any) => (React.CSSProperties | SxProps))
    navigationButton: ((...args: any) => (React.CSSProperties | SxProps))
    testimonialImage: ((...args: any) => (React.CSSProperties | SxProps))
    adminHeaderStyle: ((...args: any) => (React.CSSProperties | SxProps))
    saveContentButton: ((...args: any) => (React.CSSProperties | SxProps))
    adminHeaderButton: ((...args: any) => (React.CSSProperties | SxProps))
    moveContentButton: ((...args: any) => (React.CSSProperties | SxProps))
    deleteContentButton: ((...args: any) => (React.CSSProperties | SxProps))
    programHeaderButton: ((...args: any) => (React.CSSProperties | SxProps))
    sidebarSectionButton: ((...args: any) => (React.CSSProperties | SxProps))
} 