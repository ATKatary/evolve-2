import { interfaceStateType} from "./types"
import { moduleType, programType, stepType } from "./types/program"
import { studentType, coachType } from "./types/user"

export interface GenericClassInterface<T> {
    state: interfaceStateType

    obj: T | null
    id: string | null 

    initialize(id: string | null): Promise<void> 

    get<T>(id: string): Promise<T | null>
}

export interface AuthInterface {
    id: string | null
    isAuthenticated: boolean | null
    user: studentType | coachType | null

    logout(): Promise<boolean>
    needsPasswordChange(): Promise<any>
    updatePassword(password : string): Promise<any>
    login(email: string, password: string): Promise<any>
    sendResetPasswordEmail(email : string): Promise<any>
    initialize(name?: string): Promise<studentType | coachType | null>
    signup(email: string, password: string, firstName: string, lastName: string, role: "coach" | "student"): Promise<any>
}

export interface StepInterface extends GenericClassInterface<stepType> {}
export interface CoachInterface extends GenericClassInterface<coachType> {}
export interface ModuleInterface extends GenericClassInterface<moduleType> {}
export interface StudentInterface extends GenericClassInterface<studentType> {}
export interface ProgramInterface extends GenericClassInterface<programType> {}