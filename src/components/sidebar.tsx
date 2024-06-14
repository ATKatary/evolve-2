import * as React from "react";

import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import "../assets/utils.css";
import { styles } from "../styles";
import { THEME } from "../constants";
import { sidebarSectionType } from "../types";
import { Button, Typography } from "@mui/material";


function Sidebar({...props}) {
    // j is index of selectedSection
    let {j, sections, header, style, className, ...rest} = props;
    sections = sections as sidebarSectionType[];

    return (
        <div style={{width: 225, ...style}} className={`fixed height-100 ${className || ""}`}>
            <div style={{height: 210}}></div>
            {sections.map((section: sidebarSectionType, i: number) => {
                return (
                    <Button 
                        key={`section-${i}`}
                        className="width-100 flex align-center"
                        onClick={section.onClick? section.onClick : () => {}} 
                        sx={{...styles.sidebarSectionButton(j === i)}}
                    >
                        <section.icon style={{width: 30, height: 30, margin: "-4px 20px 0px 0px"}}/>
                        {section.name}
                    </Button>
                )
            })}
        </div>
    )
}

export default Sidebar;
