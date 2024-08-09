import { ReactElement } from "react"
import { stateType } from "."

export type navRailLinkPropsType = {
    title?: string 
    active?: boolean
    state?: stateType
    seperator?: string
    disabled?: boolean 
    
    href?: string 
    className?: string 
    onClick?: () => any
    textHoverColor?: string
    style?: React.CSSProperties
    textFontSize?: string | number 
    textStyle?: React.CSSProperties
    children?: ReactElement | ReactElement[]
}
export type navRailPropsType = {
    links: navRailLinkPropsType[]

    className?: string 
    style?: React.CSSProperties
}

export type navArrayPropsType = {
    onAdd?: () => any
    links: navRailLinkPropsType[]

    className?: string 
    style?: React.CSSProperties
}