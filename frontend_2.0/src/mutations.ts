import { gql } from "@apollo/client";

export const CREATE_STUDENT = gql`
mutation MyQuery($id: String!, $first: String!, $last: String!, $email: String!, $password: String!, $parental: String!) {
    createStudent(id: $id, first: $first, last: $last, email: $email, password: $password, parental: $parental) {
        id
    }
}
`

export const CREATE_COACH = gql`
mutation MyQuery($id: String!, $first: String!, $last: String!, $email: String!, $password: String!, $calendly: String!) {
    createCoach(id: $id, first: $first, last: $last, email: $email, password: $password, calendly: $calendly) {
        id
    }
}
`

export const CREATE_PROGRAM = gql`
mutation MyQuery($cid: String!, $title: String!) {
    createProgram(cid: $cid, title: $title) {
        id
        title 
    }
}
`;

export const ASSIGN_STUDENT_PROGRAM = gql`
mutation MyQuery($id: String!, $pids: [String]!, $action: String!) {
    assignStudentProgram(id: $id, pids: $pids, action: $action) {
        id
    }
}
`;

export const UPDATE_PROGRAM = gql`
mutation MyQuery($id: String!, $title: String) {
    updateProgram(id: $id, title: $title) {
        id
    }
}
`;

export const DELETE_PROGRAM = gql`
mutation MyQuery($id: String!) {
    deleteProgram(id: $id)
}
`;

export const CREATE_MODULE = gql`
mutation MyQuery($pid: String!, $title: String!) {
    createModule(pid: $pid, title: $title) {
        id
    }
}
`;

export const UPDATE_MODULE = gql`
mutation MyQuery($id: String!, $title: String) {
    updateModule(id: $id, title: $title) {
        id
    }
}
`;

export const SUBMIT_MODULE = gql`
mutation MyQuery($id: String!, $sid: String!) {
    submitModule(id: $id, sid: $sid) {
        id
        student {
            id 
            name
            email
            parentalEmail
            coach {
                email
                calendlyLink
            }
        }
    }
}
`;

export const UNSUBMIT_MODULE = gql`
mutation MyQuery($id: String!, $sid: String!) {
    unsubmitModule(id: $id, sid: $sid) {
        id
    }
}
`;

export const CHECK_IN_MODULE = gql`
mutation MyQuery($id: String!, $sid: String!, $checkedIn: Boolean) {
    checkInModule(id: $id, sid: $sid, checkedIn: $checkedIn) {
        id
    }
}
`;

export const DELETE_MODULE = gql`
mutation MyQuery($id: String!) {
    deleteModule(id: $id)
}
`;

export const UPDATE_STEP = gql`
mutation MyQuery($id: String!, $title: String, $displayMode: String) {
    updateStep(id: $id, title: $title, displayMode: $displayMode) {
        id
    }
}
`;

export const CREATE_ENTRY = gql`
mutation MyQuery($sid: String!, $type: String!, $data: String) {
    createEntry(sid: $sid, type: $type, data: $data) {
        id
    }
}
`;


export const UPDATE_ENTRY = gql`
mutation MyQuery($id: String!, $data: String) {
    updateEntry(id: $id, data: $data) {
        id
    }
}
`;

export const RESPOND_ENTRY = gql`
mutation MyQuery($id: String!, $sid: String!, $data: String!) {
    respondEntry(id: $id, sid: $sid, data: $data) {
        id
    }
}
`;

export const DELETE_ENTRY = gql`
mutation MyQuery($id: String!) {
    deleteEntry(id: $id)
}
`;