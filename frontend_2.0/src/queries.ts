import { gql } from "@apollo/client";


export const GET_STUDENT = gql`
query MyQuery($id: String!) {
    student(id: $id) {
        id
        name
        email 

        parentalEmail 
        programs {
            id 
            title 
            progress
            accessibleModules
        }

        coach {
            id
            email
            calendlyLink
        }
    }
}
`;

export const GET_COACH = gql`
query MyQuery($id: String!) {
    coach(id: $id) {
        id
        name
        email 
        calendlyLink
        
        programs {
            id 
            title 
        }

        students {
            id
            name 
            email 
            parentalEmail
        }
    }
}
`;


export const GET_PROGRAM = gql`
query MyQuery($id: String!) {
    program(id: $id) {
        id
        title

        modules {
            id 
            title 
        }
    }
}
`;

export const GET_MODULE = gql`
query MyQuery($id: String!) {
    module(id: $id) {
        id
        title 

        start {
            id
            title 
        }

        checkIn {
            id
            title 
        }

        actionPlan {
            id
            title 
        }

        end {
            id
            title 
        }

        submissions {
            id 
            student {
                id 
                name 
            }
            checkedIn
        }
    }
}
`

export const GET_STEP = gql`
query MyQuery($id: String!) {
    step(id: $id) {
        id
        title 
        displayMode

        entries {
            id 
            type
            data 

            responses {
                id 
                data 
                student {
                    id 
                    name
                }
            }
        }
    }
}
`


export const PROGRAM_PROGRESS = gql`
query programProgress($id: String!, $sid: String!) {
    programProgress(id: $id, sid: $sid) 
}
`

export const MODULE_PROGRESS = gql`
query moduleProgress($id: String!, $sid: String!) {
    moduleProgress(id: $id, sid: $sid) 
}
`