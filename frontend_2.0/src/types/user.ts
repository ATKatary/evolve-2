import { programType } from "./program"

export type studentType = {
    id: string
    name: string
    email: string

    coach: coachType
    // firebase only
    role?: string

    parentalEmail: string
    programs?: programType[]
}

export type coachType = {
    id: string
    name: string
    email: string

    calendlyLink: string 
    // firebase only
    role?: string

    students: studentType[]
    programs?: programType[]
}