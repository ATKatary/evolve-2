import * as React from "react";
import { objWithId } from "../types";
import { getCollection } from "../api/firebase";

export class Admin {
    static async getAll(): Promise<objWithId<any>> {
        return await getCollection<any>("users");
    }
}

export function useAdmin() {
    const [coaches, setCoaches] = React.useState<objWithId<any>[]>([]);
    const [students, setStudents] = React.useState<objWithId<any>[]>([]);

    const [initialized, setInitialized] = React.useState<boolean>(false);
    
    React.useEffect(() => {
        if (!initialized) {
            setInitialized(true)

            const getAllWrapper = async () => {
                const users = await Admin.getAll();
                setCoaches(users.filter(([_, user]) => user.role === "coach") as objWithId<any>)

                let loadedStudents = users.filter(([_, user]) => user.role === "student") as objWithId<any>;
                setStudents(loadedStudents.map(([id, user]) => [id, {...user, coach: user.coach? user.coach[1].id : undefined}]))
            }
            getAllWrapper();
        }
    }, [initialized])
    
    return {students, coaches}
}