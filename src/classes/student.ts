import * as React from "react";
import { useCustomState } from "../utils";
import { interfaceStateType, objWithId, studentProgressType, userType } from "../types";
import { GenericClass } from "./genericClass";
import { StudentInterface } from "../interfaces";
import { DocumentReference, doc } from "firebase/firestore";
import { db, getFromCollection, saveToCollection } from "../api/firebase";

export class Student extends GenericClass<any> implements StudentInterface {
    collectionId = "users"
    
    coach: objWithId<DocumentReference> | null = null;
    setCoach: (coach: any) => any;

    setPrograms: (programs: any) => any;
    programs: objWithId<DocumentReference>[] = [];

    setProgress: (programs: any) => any;
    progress: studentProgressType[] = [];
    
    parentalEmail: string | null = null;
    setParentalEmail: (parentalEmail: any) => any;


    constructor(uid: string | null, coach?: objWithId<DocumentReference>, programs?: objWithId<DocumentReference>[], parentalEmail?: string, progress?: studentProgressType[]) {
        super(uid);
        if (coach) this.coach = coach;
        this.setCoach = (newState) => {};

        if (programs) this.programs = programs;
        this.setPrograms = (newState) => {};

        if (progress) this.progress = progress;
        this.setProgress = (newState) => {};

        if (parentalEmail) this.parentalEmail = parentalEmail;
        this.setParentalEmail = (newState) => {};
    }

    static async assign(id: string, coachId: string): Promise<boolean> {
        const coach = await getFromCollection(coachId, "users") as any;
        if (coach) {
            const coachAssigned = await saveToCollection(id, "users", {coach: [coach.name, doc(db, "users", coachId)]}, {});
            let studentAssigned = true;
            if (!coach.students.find((studentRef: DocumentReference) => studentRef.id === id)) {
                studentAssigned = await saveToCollection(coachId, "users", {students: [...coach.students, doc(db, "users", id)]}, {});
            }

            return coachAssigned && studentAssigned;
        }

        return false;
    }

    async initialize(id: string | null) {
        if (this.state.initialized) return;
        this.setState({initialized: true});

        console.log(`[Student][initialize] >> initializing ${id} from ${this.collectionId}...`)
        if (!id) return

        const obj = await this.get<any>(id)
        console.log(`[Student][initialize] (obj) >>`, obj)
        if (obj) {
            this.setObj(obj as userType)

            if (obj.coach) this.setCoach(obj.coach)
            if (obj.programs) this.setCoach(obj.programs)
            if (obj.parentalEmail) this.setCoach(obj.parentalEmail)
        }
    }
}

export function useStudent(id?: string) {
    const student = new Student(id || null);

    [student.obj, student.setObj] = useCustomState<userType>({});
    [student.id, student.setId] = React.useState<string | null>(id || null);
    [student.state, student.setState] = useCustomState<interfaceStateType>({});

    [student.programs, student.setPrograms] = React.useState<objWithId<DocumentReference>[]>([]);
    [student.progress, student.setProgress] = React.useState<studentProgressType[]>([]);
    [student.coach, student.setCoach] = React.useState<objWithId<DocumentReference> | null>(null);
    [student.parentalEmail, student.setParentalEmail] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!student.state.initialized) {
            student.initialize(id || null);
        }
    }, [student.state])
    
    return {student}
}