import * as React from "react";

import { AuthInterface } from "../interfaces";
import { AuthContextType } from "../providers";
import { auth, getOrCreate, saveToCollection } from "../api/firebase";
import { studentType, coachType } from "../types/user";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";

const DEFAULT_ROLE = "student"
const USER_COLLECTION_ID = "users";
type authUserType = studentType | coachType | null;

export class Auth implements AuthInterface {
    id: string | null;
    setId: (id: string) => any;

    isAuthenticated;
    setAuthenticated: (state: boolean) => void;

    user: authUserType;
    setUser: (user: authUserType) => any;

    constructor() {
        this.id = null;
        this.setId = (id) => {};
        this.user = null;
        this.setUser = (user) => {};
        this.isAuthenticated = false;
        this.setAuthenticated = (state) => {};
        
        onAuthStateChanged(auth, async (user) => {
            if (user?.uid) {
                this.setId(user.uid);
                if (!this.user) {
                    this.setUser(await this.initialize());
                }
            }
            this.setAuthenticated(user ? true : false)
        }, (error) => console.error(error));
    }
    
    async logout(): Promise<boolean> {
        try {await signOut(auth); return true;} 
        catch (error) {return false;}
    }
    
    async needsPasswordChange(): Promise<any> {
        return false;
    }

    async updatePassword(password : string): Promise<any> {
        return false;
    }

    async sendResetPasswordEmail(email : string): Promise<any> {
        try {await sendPasswordResetEmail(auth, email)} 
        catch (error) {return error}
    }

    async initialize(): Promise<authUserType | null> {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            console.warn("[auth][initialize] >> User is not logged in. Failed to fetch!")
        } else {
            const user = await getOrCreate<authUserType>(uid, USER_COLLECTION_ID, auth.currentUser?.email? {email: auth.currentUser?.email, role: DEFAULT_ROLE} as authUserType: undefined);
            return user
        }

        return null;
    }

    async login(email: string, password: string): Promise<any> {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // await this.initialize();
        } catch (error) {return error}
    }

    async signup(email: string, password: string, firstName: string, lastName: string, role: "coach" | "student"): Promise<any> {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            await saveToCollection(user.user.uid, USER_COLLECTION_ID, {firstName: firstName, lastName: lastName, email: email, role: role}, {});

            return user.user.uid;
        } catch (error) {return error}
    }
}

export const AuthContext = React.createContext<AuthContextType>(null);

export function AuthProvider({...props}) {
    const auth = new Auth();
    const {children, ...rest} = props;

    [auth.id, auth.setId] = React.useState<string | null>(null);
    [auth.user, auth.setUser] = React.useState<authUserType>(null);
    [auth.isAuthenticated, auth.setAuthenticated] = React.useState<boolean>(false)
    
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => React.useContext(AuthContext);