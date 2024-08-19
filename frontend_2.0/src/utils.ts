import * as React from "react";

import { API, REGEX } from "./constants";
import { loadingContextType, notificationContextType, signupInfoType, timeType } from "./types";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function nullify(obj: any) {
    if (!obj) return obj
    return JSON.parse(JSON.stringify(obj))
}

export function useCustomState<T>(initialState: T): [T, (newState: T) => any] {
    const [state, setState] = React.useState(initialState);
    const setCustomSate = (newState: T) => {
        setState((prevState: T) => ({...prevState, ...newState}))
    };
    
    return [state, setCustomSate];
}

export async function post(url: RequestInfo | URL, body: any, headers: HeadersInit, other?: any) {
    return await fetch(url, {
        method: API.POST,
        headers: {
            // 'Content-Type': API.APPLICATION_JSON,
            ...headers
        },
        credentials: 'same-origin',
        body: body,
        ...other
    })
}

export async function get(url: string, args: Object, headers: HeadersInit) {
    url += "?";
    for (const [arg, value] of Object.entries(args)) {
        url += `${arg}=${value}&`
    }

    return await fetch(url, {
        method: API.GET,
        headers: {
            'Content-Type': API.APPLICATION_JSON,
            ...headers
        },
    })
}

export function validateEmail(email: string | undefined): boolean {
    if (email === undefined) return false;
    return email.toLowerCase().match(REGEX.EMAIL) !== null;
}

export function validatePassword(password: string | undefined): boolean {
    if (password === undefined) return false;
    return password.length >= 6;
}

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function addToLocalStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        clearLocalStorage();
        localStorage.setItem(key, value);
    }
}

export function clearLocalStorage() {
    const permanent = ["sybSchedule", "nowPlaying", "currentLocationId"];
    const n = localStorage.length;

    for (let i = 0; i < n; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (permanent.includes(key)) continue;
        localStorage.removeItem(key);
    }
}

/**
 * Wraps functions to collapse / un-collapse on resizing of window 
 * 
 * @param callback function expected to be run
 * @param setCollapse hook to handle changing collapse state 
 * @param width of the current window
 * @param orientation portrait or landscape
 * @returns a callback to first execute the callback then un-=-collapse
 */
export function dynamicResizeCallbackWrapper(callback: CallableFunction, setCollapse: CallableFunction, width?: number, orientation?: string) {
    return (args: any) => {
        callback(args);
        if (!resize(width, orientation)) setCollapse(true)
    }
}

/***
 * Checks if website should be dynamically resized to width > widthBreakpoint
 * @returns true if width > widthBreakpoint and orientation is landscape else false
 */
export function resize(width: number | undefined, orientation: string | undefined): boolean {
    if (width && orientation) return width > 1000 && (isMobile? orientation.includes("landscape") : true);
    return false;
}

//TODO: add pages
export function getDevOrDepUrl(urlToGet: "evolve" | "sign" | "coach" | "student" | "evolveCoach"): string {
    let prefix = "";
    const appName = "evolve"
    if (window.location.hostname === "fabhous.com") {
        if (localStorage.getItem("fabAuthenticatedFor") !== appName) {window.location.href = "/"; return "/"}
        prefix += "/" + appName
    }

    switch (urlToGet) {
        case "evolve": return prefix + "/"
        case "sign": return prefix + "/sign"
        case "coach": return prefix + "/coach"
        case "student": return prefix + "/student"
        case "evolveCoach": return prefix + "/signup-coach"
        default: break
    }

    return prefix + "/"
}

export function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, i) => {
        return i === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function makeId(n: number = 9) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function updateCaretPosition(elementId: string, position?: number) {
    const fieldElement = document.getElementById(elementId);
    const selection = window.getSelection();
    const range = document.createRange();
    
    if (fieldElement) {
        if (position) {
            range.setStart(fieldElement.childNodes[0], position);
        } else {
            range.setStart(fieldElement, fieldElement.childNodes.length);
        }
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        fieldElement.focus();
    }
}

export function setVolume(id: string, value: number) {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) audio.volume = value;
}

export function timeToMs(time?: timeType): number {
    const hours = (time?.hours || 0) * 60 * 60 * 1000
    const minutes = (time?.minutes || 0) * 60 * 1000
    const seconds = (time?.seconds || 0) * 1000

    return hours + minutes + seconds
}

export function msToTime(ms: number): timeType {
    return {
        hours: Math.floor(Math.floor(ms / 1000) / 60 / 60),
        minutes: Math.floor(Math.floor(ms / 1000) / 60) % 60,
        seconds:  Math.floor(ms / 1000) % 60,
    }
}

export function say(speech: SpeechSynthesisUtterance, text: string) {
    speech.text = text;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

export async function loadAndNotify(
    f: (...args: any) => any, 
    [...args],

    loading: loadingContextType | null, 
    loadMessage: string,

    notification: notificationContextType, 
    notifySuccessMessage?: string, 
    notifyErrorMessage?: string,
) {
    loading?.setLoading({message: loadMessage, load: true});
    let result: any;
    try {
        result = await f(...args);

        if (notifySuccessMessage) {
            notification?.setNotification({message: notifySuccessMessage, notify: true});
        }
    } catch (error) {
        if (notifyErrorMessage) {
            notification?.setNotification({message: notifyErrorMessage, notify: true});
        }
    }
    loading?.setLoading({message: undefined, load: false});
    return result
}

export function validateUrl(urlString?: string): boolean {
    if (!urlString) return false;
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
}

export function validateSignupForm(signupInfo: signupInfoType, isCoach?: boolean): [boolean, any] {
    let valid = false;
    let messages: any = {
        emailMessage: undefined, 
        passwordMessage: undefined,
        confirmPasswordMessage: undefined, 
        parentalEmailMessage: undefined, 
        firstNameMessage: undefined, 
        lastNameMessage: undefined,
        calendlyLinkMessage: undefined
    };

    if (!signupInfo.firstName) {
        messages.firstNameMessage = "Missing";
    } else if (!signupInfo.lastName) {
        messages.lastNameMessage = "Missing";
    } else if (!validateEmail(signupInfo.email)) {
        messages.emailMessage = "Invalid email";
    } else if (!isCoach && !validateEmail(signupInfo.parentalEmail)) {
        messages.parentalEmailMessage = "Invalid email";
    } else if (isCoach && !validateUrl(signupInfo.calendlyLink)) {
        messages.calendlyLinkMessage = "Invalid link";
    } else if (!validatePassword(signupInfo.password)) {
        messages.passwordMessage = "Password too short";
    } else if (signupInfo.confirmPassword !== signupInfo.password) {
        messages.confirmPasswordMessage = "Password does not match";
    } else {
        valid = true;
    }

    return [valid, messages];
}

export function convertDataToHtml(blocks: any[]) {
    var convertedHtml = "";

    blocks.map(block => {
      switch (block.type) {
            case "header":
                convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case "paragraph":
                convertedHtml += `<p>${block.data.text}</p>`;
                break;
            case "delimiter":
                convertedHtml += "<hr />";
                break;
            case "image":
                convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                break;
            case "list":
                convertedHtml += "<ul>";
                block.data.items.forEach((li: any) => {
                    convertedHtml += `<li>${li}</li>`;
                });
                convertedHtml += "</ul>";
                break;
            default:
                console.log("Unknown block type", block.type);
                break;
        }
    });
    return convertedHtml;
}

export function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`; 
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }