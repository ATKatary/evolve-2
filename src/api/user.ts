import { loginInfoType } from "../types";
import { AuthContextType } from "../providers";

export async function login(auth: AuthContextType, loginInfo: loginInfoType, setLoginInfo: CallableFunction, navigate: CallableFunction) {
    switch (loginInfo.status) {
        case 200:
            try {
                let error: any = await auth?.login(loginInfo.email, loginInfo.password);
                switch (error?.code || "") {
                    case "auth/invalid-credential": 
                        setLoginInfo({status: 403, message: "Invalid email or password", error: true});
                        break;
                    default: 
                        setLoginInfo({status: null, message: "Logged in!", success: true});
                        break;
                }
            } catch (error: any) {console.error(error.message)}
            break;
        case 201:
            try {
                let error: any = await auth?.updatePassword(loginInfo.password);
                switch (error?.code || "") {
                    case "auth/weak-password": 
                        setLoginInfo({status: 403, message: "Password is too weak", error: true});
                        break;
                    default: 
                        setLoginInfo({status: null, message: "Login in!", error: true});
                        navigate("/main")
                        break;
                }
            } catch (error: any) {console.error(error.message)}
            break;
        case 300: 
            try {
                let error: any = await auth?.sendResetPasswordEmail(loginInfo.email);
                
                switch (error?.code || "") {
                    case "auth/missing-email": 
                        setLoginInfo({status: 403, message: "Please fill in email.", error: true});
                        break;
                    case "auth/invalid-email":
                        setLoginInfo({status: 403, message: "Invalid email provided", error: true});
                        break;
                    default: 
                        setLoginInfo({status: null, message: "Check your email for password reset link!", forgotPass: false});
                        break;
                }
            } catch (error: any) {console.error(error.message)}
            break;
        case 403: 
            break;
        default: 
            break;
    }
}

export async function checkPassword(auth: AuthContextType, setLoginInfo: CallableFunction) {
    if (auth?.isAuthenticated) {
        setLoginInfo({resetPass: await auth.needsPasswordChange(), loggedIn: true});
    }
}
