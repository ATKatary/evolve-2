import * as React from "react";

import { Container } from "react-bootstrap";

import "../assets/utils.css";
import { styles } from "../styles";
import { THEME } from "../constants";
import { sidebarSectionType, stepType } from "../types";
import { Button, Typography } from "@mui/material";


function Slides({...props}) {
    let {style, className, step, ...rest} = props;
    step = step as stepType;
    
    return (
        <div style={{...style}} className={`${className || ""}`}>
            This is slides
        </div>
    )
}

export default Slides;
