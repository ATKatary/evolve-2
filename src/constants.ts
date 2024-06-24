import List from "@editorjs/list";
import Link from "@editorjs/link";
import Header from "@editorjs/header";
import ImageTool from '@editorjs/image';
import Paragraph from "@editorjs/paragraph";
import VideoTool from "@weekwood/editorjs-video";


import { contentTypes, fieldType, selectMenuOptionType } from "./types"
import { Student } from "./classes/student";
import { Coach } from "./classes/coach";
import { db, getFromCollection, saveToStorage } from "./api/firebase";
import { doc } from "firebase/firestore";
import { makeId } from "./utils";

export const API = {
    GET: "get",
    POST: "post",
    DELETE: "delete",
    APPLICATION_JSON: "application/json",
}

export const COLORS = {
    WHITE: "#FFFFFF",
    LIGHT_GRAY: "#B2B2B2",
    TRANSPARENT: "transparent",
}

export const THEME = {
    TEXT: "#0D0D0D",
    ERROR: "#FF3333",
    DOMINANT: "#365E32",
    ACTIVE_ACCENT: "#81A263",
    BUTTON_ACCENT: "#FD9B63",
    BACKGROUND_ACCENT: "#F2EFEA",
    BACKGROUND_ACCENT_2: "#E7D37F",

    FONT: {
        TITLE: 24,
        HEADING: 22,
        SUB_HEADING: 16,
        PARAGRAPH: 12
    }
}

export const REGEX = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}

export const FIELDS = {
    BASE: [
        {name: "Name", type: "text", editable: true, style: {width: 150}} as fieldType,
        {name: "Email", type: "text", editable: false, style: {width: 150}} as fieldType,
    ],

    STUDENTS: (coaches?: selectMenuOptionType[], programs?: selectMenuOptionType[]) => [
        {name: "ParentalEmail", type: "text", editable: true, style: {width: 150}} as fieldType,
        {name: "Coach", type: "select", editable: true, options: coaches, style: {width: 150}} as fieldType,
        {name: "Programs", type: "multiSelect", editable: true, options: programs, style: {width: 150}} as fieldType,
    ],

    COACHES: (students?: selectMenuOptionType[]) => [
        {name: "Students", type: "total", editable: false, style: {width: 85}} as fieldType,
        {name: "Programs", type: "total", editable: false, style: {width: 95}} as fieldType,
        {name: "Modules", type: "total", editable: false, style: {width: 85}} as fieldType,
        {name: "Admin", type: "checkbox", editable: true, style: {width: 85}} as fieldType,
    ],
}

export const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    header: {
        class: Header,
        inlineToolbar: true,
    },
    video: {
        class: VideoTool,
        inlineToolbar: true,
        config: {
            endpoints: {
                byFile: '', // Your backend file uploader endpoint
                byUrl: '', // Your endpoint that provides uploading by Url
            },
            player: {
                controls: true,
                autoplay: false
            },
            uploader: {
                async uploadByFile(file: any) {
                    console.log("uploading...", file.type)

                    return {
                        success: 1,
                        file: {
                            url: await saveToStorage(`${makeId(9)}.${file.type.split("/")[1]}`, "videos", file),
                            width: "400px",
                            height: "fit-content"
                            // any other image data you want to store, such as width, height, color, extension, etc
                        }
                    }
                },
                async uploadByUrl(url: string) {
                    console.log("uploading...", url)
                    return {
                        success: 1,
                        file: {
                            url: url,
                            // any other image data you want to store, such as width, height, color, extension, etc
                        }
                    }
                },
            }
        }
    },
    image: {
        class: ImageTool,
        inlineToolbar: true,
        config: {
            endpoints: {
                byFile: '', // Your backend file uploader endpoint
                byUrl: '', // Your endpoint that provides uploading by Url
            },
            uploader: {
                async uploadByFile(file: any) {
                    console.log("uploading...", file.type)

                    return {
                        success: 1,
                        file: {
                            url: await saveToStorage(`${makeId(9)}.${file.type.split("/")[1]}`, "images", file),
                            // any other image data you want to store, such as width, height, color, extension, etc
                        }
                    }
                },
                async uploadByUrl(url: string) {
                    console.log("uploading...", url)
                    return {
                        success: 1,
                        file: {
                            url: url,
                            // any other image data you want to store, such as width, height, color, extension, etc
                        }
                    }
                },
            }
        }
    }
};

export const EMAIL = {
    TEMPLATES: {
        NUDGE: (student: string, coach: string) => `Hey ${student},\nThis is a nudge message\n\n-\n\t${coach}`
    }
}

export const DEFAULT_CONTENT_DATA = (type: contentTypes) => {
    switch (type) {
        case "text": return {}
        case "rate": return {header: ""}
        case "email": return {subject: "", html: "", sendOnComplete: true, sendToParent: false}
        case "rank": return {items: Array(5).fill(0).map((_, i) => ({id: `${i}`, text: `Statement ${i}`}))}
        case "select":
        case "multiSelect":
        default: return
    }
}
export const NEW_CONTENT = (type: contentTypes) => ({data: DEFAULT_CONTENT_DATA(type), type: type, responses: []})
