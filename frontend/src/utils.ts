import * as React from "react";
import { API, REGEX } from "./constants";
import { studentProgressType } from "./types";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function nullify(obj: any) {
    if (!obj) return obj
    return JSON.parse(JSON.stringify(obj))
}

export function useCustomState<T>(initialState: any): [T, (newState: any) => any] {
    const [state, setState] = React.useState(initialState);
    const setCustomSate = (newState: any) => {
        setState((prevState: any) => ({...prevState, ...newState}))
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

export function validateUrl(url: string) {
    return /^https?:\/\/([\w-]+\.)+\w{2,}(\/.+)?$/.test(url);
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

export function getDevOrDepUrl(urlToGet: "evolve" | "coach" | "student" | "admin") {
    let prefix = "";
    if (window.location.hostname === "fabhous.com") {
        if (localStorage.getItem("fabAuthenticatedFor") !== "evolve") {window.location.href = "/"; return}
        prefix += "/evolve"
    }

    switch (urlToGet) {
        case "evolve": return prefix + "/"
        case "coach": return prefix + "/coach"
        case "admin": return prefix + "/admin"
        case "student": return prefix + "/student"
        default: return "/"
    }
}

export function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, i) => {
        return i === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function removeAllEditors() {
    while (true) {
        let i = 0
        const editor = document.getElementById(`editorjs-container-${i}`)
        if (!editor) return 
        editor.remove()
        i++
    }
}

export function makeId(n: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

export function computeProgramProgressScore(moduleIds: string[], progresses: studentProgressType[]) {
    let score = 0;

    for (const moduleId of moduleIds) {
        const moduleProgress = progresses?.find(progress => progress.id === moduleId)
        if (moduleProgress) {
            score +=  moduleProgress.progress
        }
    }
    return score
}
