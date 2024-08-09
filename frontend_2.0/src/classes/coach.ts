import * as React from "react";
import { useQuery } from "@apollo/client";

import { GET_COACH } from "../queries";
import { coachType } from "../types/user";
import { useCustomState } from "../utils";
import { CoachInterface } from "../interfaces";
import { GenericClass } from "./genericClass";
import { interfaceStateType } from "../types";
import { programType } from "../types/program";

export class Coach extends GenericClass<coachType> implements CoachInterface {
    addProgram(program: programType) {
        let programs = [program];
        if (this.obj?.programs) {
            programs = [
                ...this.obj.programs,
                {...program}
            ]
        }

        if (this.obj) {
            this.setObj({
                ...this.obj, 
                programs: programs
            })
        }
    }

    removeProgram(pid: String) {
        if (this.obj) {
            this.setObj({
                ...this.obj, 
                programs: this.obj.programs?.filter(program => program.id !== pid)
            })
        }
    }
}

export function useCoach(id?: string) {
    const coach = new Coach(id || null);
    
    [coach.obj, coach.setObj] = React.useState<coachType | null>(null);
    [coach.state, coach.setState] = useCustomState<interfaceStateType>({});
    [coach.id, coach.setId] = React.useState<string | null>(id || null);

    const { error, refetch } = useQuery(GET_COACH, {skip: true});

    React.useEffect(() => {
        if (!coach.state.initialized) {
            coach.setState({initialized: true});
            const getGymWrapper = async () => {
                if (id) {
                    coach.setId(id);
                    const loadedCoach = (await refetch({id: id})).data.coach as coachType
                    coach.setObj(loadedCoach);
                }
            }
            getGymWrapper()
        }
    }, [coach.state])

    React.useEffect(() => {
        if (id !== coach.id) {
            coach.setState({initialized: false});
        }
    }, [id])

    return {coach}
}

