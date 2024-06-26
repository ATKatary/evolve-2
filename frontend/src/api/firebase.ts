import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { DocumentReference, addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, onSnapshot, query, setDoc } from "firebase/firestore";
import { emailType, objWithId } from "../types";

const firebaseConfig = {
    apiKey: "AIzaSyB5O6TbLD-tqCErc1LAS-HwymQziaYfjWA",
    authDomain: "evolve-2706f.firebaseapp.com",
    projectId: "evolve-2706f",
    storageBucket: "evolve-2706f.appspot.com",
    messagingSenderId: "447029779019",
    appId: "1:447029779019:web:b5f5125217e96e91200bce",
    measurementId: "G-9FLCPQQHBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const multiMediaStorage = getStorage(app);

export async function saveToStorage(id: string, storageId: string, file: Blob | Uint8Array | ArrayBuffer, metadata?: any) {
    const storageRef = ref(multiMediaStorage, `${storageId}/${id}`);

    const uploadTask = await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(uploadTask.ref)
}

export function watchDoc(
    id: string, 
    collectionId: string,
    
    onUpdate?: CallableFunction,
    args?: any,
) {
    const docRef = doc(db, collectionId, id);
    // console.log(`[firebase][watchDoc] >> watching ${collectionId} ${id}`);

    onSnapshot(docRef, (doc) => {
        // console.log("[firebase][watchDoc] (doc) >>", doc.data())
        if (onUpdate && args) onUpdate(doc, args);
        else if (onUpdate) onUpdate(doc);
    })
}

export function watchCollection(
    id: string,
    
    onUpdate?: CallableFunction,
    args?: any,
) {
    const collectionRef = collection(db, id);
    // console.log(`[firebase][watchCollection] >> watching ${id}`);

    onSnapshot(collectionRef, (snapshot) => {
        if (onUpdate && args) onUpdate(snapshot, args);
        else if (onUpdate) onUpdate(snapshot);
    })
}

export async function addToCollection<T>(collectionId: string, data: any): Promise<T | DocumentReference> {
    const collectionRef = collection(db, collectionId);
    // console.log(`[firebase][addToCollection] >> adding to  ${collectionId}....`);

    const docRef = await addDoc(collectionRef, data);
    if (docRef) {
        const data = (await getDoc(docRef)).data() as T
        return {
            ...data,
            id: docRef.id
        };
    }
    return docRef
}

export async function getOrCreate<T>(id: string, collectionId: string, defaultData?: T, getRef?: boolean): Promise<[T, DocumentReference] | T | null> {
    // console.log(`[firebase][getOrCreate] >> getting ${id} from ${collectionId}....`);

    const data = await getFromCollection<T>(id, collectionId, true, getRef);

    if (data) return data;
    if (!defaultData) return null;
    
    await saveToCollection(id, collectionId, defaultData, {});
    return defaultData;
}

export async function getFromCollection<T>(id: string, collectionId: string, createIfDoesNotExist?: boolean, getRef?: boolean): Promise<[T, DocumentReference] | T | null> {
    // console.log(`[firebase][getFromCollection] >> getting ${id} from ${collectionId}....`);
    try {
        const docRef = doc(db, collectionId, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (getRef) return [docSnap.data() as T, docRef]
            return docSnap.data() as T;
        } else if (createIfDoesNotExist) {
            await saveToCollection(id, collectionId, {}, {});
        } return null;
    } catch (e) {
        console.error(e)
        return null;
    }
}

export async function saveToCollection(id: string, collectionId: string, data: any, {...options}): Promise<boolean> {
    try {
        const docRef = doc(db, collectionId, id);

        await setDoc(docRef, data, {merge: true, ...options});
        return true;
    } catch (e) {
        console.error(e)
        return false;
    }
} 

export async function getCollection<T>(id: string): Promise<objWithId<T>[]> {
    const collectionRef = collection(db, id);

    return (await getDocs(query(collectionRef, limit(500)))).docs.map((snapshot) => [snapshot.id, snapshot.data() as T]);
}

export async function sendEmail(email: emailType): Promise<boolean> {
    const collectionRef = collection(db, "mail");
    console.log(email)
    const emailDoc = await addDoc(collectionRef, email)
    return emailDoc.id? true : false;
}