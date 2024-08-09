import { SelectChangeEvent, SxProps } from "@mui/material"
import React from "react"

export type selectFieldPropsType = {
    multiple?: boolean 
    options: selectMenuOptionType[]

    value?: any
    onChange?: (event: SelectChangeEvent) => any 

    sx?: SxProps
    className?: string 
    style?: React.CSSProperties
}

export type selectMenuOptionType = {
    name: string
    style?: React.CSSProperties
    id?: string | number | readonly string[]
}

export type fieldType = {
    name: string 
    editable?: boolean 
    onChange?: CallableFunction
    style?: React.CSSProperties
    type: "text" | "select" | "multiSelect" | "checkbox" | "total"
    
    options: selectMenuOptionType[]
}