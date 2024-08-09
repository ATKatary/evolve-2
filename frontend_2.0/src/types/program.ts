import { coachType, studentType } from "./user"

export type programType = {
    id: string 
    title: string 

    owner: coachType
    students: stepType[]
    modules: moduleType[]

    progress?: number
    accessibleModules?: string[]
}

export type moduleType = {
    id: string 
    title: string 

    end: stepType
    start: stepType
    checkIn: stepType
    actionPlan: stepType

    submissions: submissionType[]
}

export type stepType = {
    id: string 
    title: string 

    displayMode: "doc" | "slide"
    entries: entryType[]
}

export type entryDataType = "text" | "rank" | "email" | "upload" | "prompt" | "rate"
export type entryType = {
    id: string 

    data: any 
    type: entryDataType
    responses: responseType[]
}

export type responseType = {
    id: string 

    data: any 
    student: studentType
}

export type submissionType = {
    id: string 

    checkedIn: boolean 
    student: studentType
}