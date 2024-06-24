import { DocumentReference } from "firebase/firestore"
import { interfaceStateType, objWithId, studentProgressType, userType } from "./types"

export interface GenericClassInterface<T> {
    state: interfaceStateType

    obj: T | null
    id: string | null
    ref: DocumentReference | null

    initialize(id: string | null): Promise<void> 

    get<T>(id: string, defaultData?: T): Promise<T | null>
    save(data: any): Promise<boolean>
}

export interface AuthInterface {
    id: string | null
    isAuthenticated: boolean | null
    user: GenericClassInterface<userType> | null

    logout(): Promise<boolean>
    needsPasswordChange(): Promise<any>
    updatePassword(password : string): Promise<any>
    login(email: string, password: string): Promise<any>
    sendResetPasswordEmail(email : string): Promise<any>
    signup(email: string, password: string, name: string): Promise<any>
    initialize(name?: string): Promise<GenericClassInterface<userType> | null | null>
}

export interface StudentInterface extends GenericClassInterface<userType> {
    parentalEmail: string | null

    coach: objWithId<DocumentReference> | null
    programs: objWithId<DocumentReference>[]
    progress: studentProgressType[]
}   

export interface CoachInterface extends GenericClassInterface<userType> {
    isAdmin: boolean;
    modules: DocumentReference[]
    programs: DocumentReference[]
    students: DocumentReference[]
}   
