import * as React from "react";

import { Container } from "react-bootstrap";

import "../assets/editor.css";

import Entry from "./entry";
import Editor from "./editor";
import { styles } from "../styles";
import { contentType } from "../types";

import "../assets/utils.css";

function Doc({...props}) {
    let {style, className, content, onChange, i, edit, ...rest} = props;
    content = content as contentType;

    return (
        <Editor 
            edit={edit}
            content={content}
            onChange={onChange} 
            data={content?.data}
            editorBlock={`editorjs-container-${i}`}
        />
    )
}

export default Doc;
