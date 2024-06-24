import * as React from "react";
import { useCustomState } from "../utils";
import { GenericClass } from "./genericClass";
import { CoachInterface } from "../interfaces";
import { DocumentReference, getDoc } from "firebase/firestore";
import { interfaceStateType, moduleType, objWithId, programType, userType } from "../types";
import { OutputData } from "@editorjs/editorjs";
import { getFromCollection, saveToCollection } from "../api/firebase";

export class Coach extends GenericClass<any> implements CoachInterface {
    collectionId = "users"

    isAdmin: boolean = false;
    setIsAdmin: (isAdmin: boolean) => any;

    setStudents: (students: DocumentReference[]) => any;
    students: DocumentReference[] = [];

    setPrograms: (students: DocumentReference[]) => any;
    programs: DocumentReference[] = [];

    setModules: (students: DocumentReference[]) => any;
    modules: DocumentReference[] = [];

    constructor(uid: string | null, students?: DocumentReference[], programs?: DocumentReference[], modules?: DocumentReference[], isAdmin?: boolean) {
        super(uid);
        if (students) this.students = students;
        this.setStudents = (students) => {}

        if (programs) this.programs = programs;
        this.setPrograms = (programs) => {}

        if (modules) this.modules = modules;
        this.setModules = (modules) => {}

        if (isAdmin) this.isAdmin = isAdmin;
        this.setIsAdmin = (isAdmin) => {}
    }

    async initialize(id: string | null) {
        if (this.state.initialized) return;
        this.setState({initialized: true});

        console.log(`[Coach][initialize] >> initializing ${id} from ${this.collectionId}...`)
        if (!id) return

        const obj = await this.get<any>(id)
        console.log(`[Coach][initialize] (obj) >>`, obj)
        if (obj) {
            this.setObj(obj as userType)
            if (obj.modules) this.setModules(obj.modules)
            if (obj.isAdmin) this.setModules(obj.isAdmin)
            if (obj.students) this.setStudents(obj.students)
            if (obj.programs) this.setPrograms(obj.programs)
        }
    }

    async getModules(): Promise<objWithId<moduleType>[]> {
        const modules: objWithId<moduleType>[] = [];

        for (const module of this.modules) {
            modules.push([module.id, (await getDoc(module)).data() as moduleType])
        }
        return modules;
    }

    async getPrograms(): Promise<objWithId<programType>[]> {
        const programs: objWithId<programType>[] = [];

        for (const program of this.programs) {
            programs.push([program.id, (await getDoc(program)).data() as programType])
        }
        return programs;
    }

    async getStudents(): Promise<objWithId<any>[]> {
        const students: objWithId<any>[] = [];

        for (const student of this.students) {
            const studentData = (await getDoc(student)).data() as userType
            students.push([student.id, studentData])
        }
        return students;
    }

    static async removeStudent(id: string, studentId: string): Promise<boolean> {
        const coach = await getFromCollection(id, "users") as any;
        if (coach) {
            let studentRemoved = true;
            if (coach.students.find((studentRef: DocumentReference) => studentRef.id === studentId)) {
                studentRemoved = await saveToCollection(id, "users", {students: coach.students.filter((studentRef: DocumentReference) => studentRef.id !== studentId)}, {});
            }

            return studentRemoved;
        }

        return false;
    }
}

export function useCoach(id?: string) {
    const coach = new Coach(id || null, []);

    [coach.obj, coach.setObj] = useCustomState<userType>({});
    [coach.id, coach.setId] = React.useState<string | null>(id || null);
    [coach.state, coach.setState] = useCustomState<interfaceStateType>({});
    
    [coach.students, coach.setStudents] = React.useState<DocumentReference[]>([]);
    [coach.programs, coach.setPrograms] = React.useState<DocumentReference[]>([]);
    [coach.modules, coach.setModules] = React.useState<DocumentReference[]>([]);

    const [students, setStudents] = React.useState<objWithId<any>[]>([]);
    const [modules, setModules] = React.useState<objWithId<moduleType>[]>([]);
    const [programs, setPrograms] = React.useState<objWithId<programType>[]>([]);

    React.useEffect(() => {
        if (!coach.state.initialized) {
            coach.initialize(id || null);
        }
    }, [coach.state])


    React.useEffect(() => {
        if (coach.modules.length !== modules.length) {
            const getModulesWrapper = async () => {
                setModules(await coach.getModules())
            }
            getModulesWrapper()
        }
    }, [coach.modules])

    React.useEffect(() => {
        if (coach.programs.length !== programs.length) {
            const getProgramsWrapper = async () => {
                setPrograms(await coach.getPrograms())
            }
            getProgramsWrapper()
        }
    }, [coach.programs])

    React.useEffect(() => {
        if (coach.students.length !== students.length) {
            const getStudentsWrapper = async () => {
                setStudents(await coach.getStudents())
            }
            getStudentsWrapper()
        }
    }, [coach.students])
    
    return {coach, modules, setModules, programs, setPrograms, students, setStudents}
}