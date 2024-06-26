import { API } from "../constants";
import { emailType } from "../types";
import { post } from "../utils";

export async function sendEmail(email: emailType, delay: number = 0): Promise<boolean> {
    // const url = "http://127.0.0.1:8003/api/evolve/auto/sendEmail"; // development url
    const url = "https://fabhous.com/api/evolve/auto/sendEmail"; 
    
    try {
        await post(url, JSON.stringify({
            subject: email.message.subject || "", 
            html: email.message.html || "",
            toUids: email.toUids || [],
            ccUids: email.ccUids || [],
            delay: delay
        }), {'Content-Type': API.APPLICATION_JSON})
        return true;
    } catch (e) {
        console.error("[evolve][sendEmail] >> Failed to send email")
        return false
    }
}

