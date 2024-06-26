import * as React from "react";
import { objWithId, programType } from "../types";
import { getCollection } from "../api/firebase";
import { DocumentReference } from "firebase/firestore";

export class Admin {
    static async getAll(): Promise<objWithId<any>[]> {
        return await getCollection<any>("users");
    }

    static async getPrograms(): Promise<objWithId<programType>[]> {
        return await getCollection<programType>("programs")
    }
}

export function useAdmin() {
    const [coaches, setCoaches] = React.useState<objWithId<any>[]>([]);
    const [students, setStudents] = React.useState<objWithId<any>[]>([]);
    const [programs, setPrograms] = React.useState<objWithId<programType>[]>([]);

    const [initialized, setInitialized] = React.useState<boolean>(false);
    
    React.useEffect(() => {
        if (!initialized) {
            setInitialized(true)

            const getAllWrapper = async () => {
                const users = await Admin.getAll();
                const programs = await Admin.getPrograms();

                setPrograms(programs)
                setCoaches(users.filter(([_, user]) => user.role === "coach") as objWithId<any>)

                let loadedStudents = users.filter(([_, user]) => user.role === "student") as objWithId<any>;
                setStudents(loadedStudents.map(([id, user]) => [id, {...user, programs: user.programs?.map((program: DocumentReference) => program.id), coach: user.coach? user.coach[1]?.id : undefined}]))
            }
            getAllWrapper();
        }
    }, [initialized])

    return {students, coaches, setStudents, setCoaches, programs}
}