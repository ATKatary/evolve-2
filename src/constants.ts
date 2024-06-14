import List from "@editorjs/list";
import Link from "@editorjs/link";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

import { Image } from "./components/plugins/image";
import { fieldType, selectMenuOptionType } from "./types"

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
        {name: "Email", type: "text", editable: false, style: {width: 200}} as fieldType,
    ],

    STUDENTS: (coaches?: selectMenuOptionType[], programs?: selectMenuOptionType[]) => [
        {name: "Coach", type: "select", editable: true, style: {width: 150}, options: coaches} as fieldType,
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
    header: Header,
    // image: Image
};