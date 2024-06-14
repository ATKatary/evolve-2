import { interfaceStateType} from "../types";
import { GenericClassInterface } from "../interfaces";
import { getFromCollection, getOrCreate, saveToCollection } from "../api/firebase";
import { DocumentReference } from "firebase/firestore";

export abstract class GenericClass<T> implements GenericClassInterface<T> {
    state: interfaceStateType
    setState: (newState: any) => any

    id: string | null
    setId: (id: string) => any

    ref: DocumentReference | null
    setRef: (ref: DocumentReference) => any

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

        this.ref = null
        this.setRef = (ref) => {}
    }

    async initialize(id: string | null) {
        if (this.state.initialized) return;
        this.setState({initialized: true});
        console.log(`[genericClass<T>][initialize] >> initializing ${id} from ${this.collectionId}...`)
        if (!id) {
            // const ref = await addToCollection<T>(this.collectionId, {});
            // if (ref instanceof DocumentReference) id = ref.id
            // else 
            return;
        }

        const obj = await this.get<T>(id)
        if (obj) {
            console.log(`[genericClass<T>][initialize] (obj) >>`, obj)
            this.setObj(obj)
        }
    }

    async get<T>(id: string, defaultData?: T): Promise<T | null> {
        if (!id) return null;

        let data;
        if (defaultData) {
            data = await getOrCreate<T>(id, this.collectionId, defaultData, true);
        } else {
            data = await getFromCollection<T>(id, this.collectionId, undefined, true)
        }
        // console.log("[genericClass<T>][get] (data) >>", data);

        if (data instanceof Array) {
            this.setRef(data[1])
            return data[0]
        }
        return null;
    }

    async save(data: any): Promise<boolean> {
        if (!this.id) return false;
        return await saveToCollection(this.id, this.collectionId, data, {});
    }
}