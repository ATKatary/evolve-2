import { MutableRefObject } from "react";
import { interfaceStateType} from "../types";
import { GenericClassInterface } from "../interfaces";

export abstract class GenericClass<T> implements GenericClassInterface<T> {
    state: interfaceStateType
    setState: (newState: interfaceStateType) => any

    id: string | null
    setId: (id: string) => any

    obj: T | null
    setObj: (obj: T) => any

    collectionId: string = ""

    constructor(id: string | null) {
        this.state = {}
        this.setState = (state) => {}

        this.id = id
        this.setId = (id) => {}

        this.obj = null
        this.setObj = (obj) => {}
    }

    async initialize(id: string | null) {
        return
    }

    async get<T>(id: string): Promise<T | null> {
        return null
    }
}