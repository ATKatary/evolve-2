import { gql } from "@apollo/client";

export const WATCH_PROGRAM = gql`
subscription MySubscription($id: String) {
    watchProgram(id: $id) {
        id
        title

        modules {
            id 
            title 
        }
    }
}
`

export const WATCH_MODULE = gql`
subscription MySubscription($id: String) {
    watchModule(id: $id) {
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

export const WATCH_STEP = gql`
subscription MySubscription($id: String) {
    watchStep(id: $id) {
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