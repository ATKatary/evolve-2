import List from "@editorjs/list";
import Link from "@editorjs/link";
import Embed from '@editorjs/embed';
import Header from "@editorjs/header";
import ImageTool from '@editorjs/image';
import Paragraph from "@editorjs/paragraph";
import VideoTool from "@weekwood/editorjs-video";
import { saveToStorage } from "./api/firebase";
import { makeId } from "./utils";
import { entryDataType, entryType } from "./types/program";

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
    SUCCESS: "#53A653",
    DOMINANT: "#365E32",
    ACTIVE_ACCENT: "#81A263",
    BUTTON_ACCENT: "#FD9B63",
    BACKGROUND_ACCENT: "#F2EFEA",
    BACKGROUND_ACCENT_2: "#E7D37F",

    // Hex Color:
    // Green: 00c661
    // Dark Gray of logo (not black): 353d3e
    // Dark blue background: 011737

    FONT: {
        TITLE: () => 24,
        HEADING: () => 22,
        SUB_HEADING: () => 16,
        PARAGRAPH: () => 12
    }
}

export const REGEX = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
    embed: {
        class: Embed,
        inlineToolbar: true,
        config: {
            services: {
                youtube: true,
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


export const DEFAULT_ENTRY_DATA = (type: entryDataType) => {
    switch (type) {
        case "text": return {}
        case "rate": return {header: ""}
        case "email": return {subject: "", html: "", sendOnComplete: true, sendToParent: false}
        case "rank": return {items: Array(5).fill(0).map((_, i) => ({id: `${i}`, text: `Statement ${i}`}))}
        default: return
    }
}
export const NEW_ENTRY = (type: entryDataType) => ({data: DEFAULT_ENTRY_DATA(type), type: type, responses: []})
