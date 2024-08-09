import * as React from "react"
import { SxProps } from "@mui/material"

export type editablePropsType = {
    type?: String 
    
    edit?: boolean 
    filled?: boolean
    disable?: boolean

    value?: String | number 
    defaultValue?: String | number
    setValue: (target: HTMLDivElement) => any

    min?: number 
    max?: number
    
    color?: String
    fontSize?: String 
    className?: String
    style?: React.CSSProperties
}

export type editableControlsPropsType = {
    edit: boolean 
    setEdit: (edit: boolean) => any

    onSave?: (...args: any) => any
    onDelete?: (...args: any) => any

    className?: String
    btnStyle?: SxProps
    svgStyle?: SxProps
    style?: React.CSSProperties
}

export type editableHeaderPropsType = {
    propogate?: boolean
    disableEditing?: boolean

    title: string
    setTitle: (title: string) => any
    
    onSave?: (...args: any) => any
    onDelete?: (...args: any) => any

    editProp?: boolean, 
    setEditProp?: (edit: boolean) => any

    className?: String
    propogateClassName?: String
    
    style?: React.CSSProperties
    titleStyle?: React.CSSProperties
    controlsStyle?: React.CSSProperties
    propogateStyle?: React.CSSProperties
    
    children?: React.ReactElement | React.ReactElement[]
    controls?: React.ReactElement | React.ReactElement[]
}

export type editableTimePropsType = {
    edit?: boolean
    setEdit?: (edit: boolean) => any

    hours?: number
    setHours?: (hours: number) => any

    minutes: number
    setMinutes: (minutes: number) => any

    seconds: number
    setSeconds: (seconds: number) => any

    label?: String
    color?: String
    className?: String
    style?: React.CSSProperties
    timeStyle?: React.CSSProperties
    children?: React.ReactElement | React.ReactElement[]
}