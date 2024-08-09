import * as React from "react";
import { useQuery } from "@apollo/client";

import { GET_STUDENT } from "../queries";
import { useCustomState } from "../utils";
import { studentType } from "../types/user";
import { interfaceStateType } from "../types";
import { GenericClass } from "./genericClass";
import { StudentInterface } from "../interfaces";

export class Student extends GenericClass<studentType> implements StudentInterface {}

export function useStudent(id?: string) {
    const student = new Student(id || null);
    
    [student.obj, student.setObj] = React.useState<studentType | null>(null);
    [student.state, student.setState] = useCustomState<interfaceStateType>({});
    [student.id, student.setId] = React.useState<string | null>(id || null);

    const { error, refetch } = useQuery(GET_STUDENT, {skip: true});

    React.useEffect(() => {
        if (!student.state.initialized) {
            student.setState({initialized: true});
            const getGymWrapper = async () => {
                if (id) {
                    student.setId(id);
                    const loadedStudent = (await refetch({id: id})).data.student as studentType
                    student.setObj(loadedStudent);
                }
            }
            getGymWrapper()
        }
    }, [student.state])

    React.useEffect(() => {
        if (id !== student.id) {
            student.setState({initialized: false});
        }
    }, [id])

    return {student}
}

