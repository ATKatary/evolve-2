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
export type selectMenuOptionType = {
    name: string
    style?: React.CSSProperties
    id: string | number | undefined | readonly string[]
}

export type fieldType = {
    name: string 
    editable: boolean 
    style: React.CSSProperties
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

export type contentTypes = "text" | "select" | "multiSelect" | "rank"

export type contentType = {
    data: any 
    type: contentTypes
    responses: responseType[]
}

export type responseType = {
    id: string 
    response: any
}