import { COLORS, THEME } from "./constants";
import { theme } from "./theme";
import { stylesType } from "./types";

export const styles: stylesType = {
    title: (fontSize?: number, color?: string) => ({
        color: color || THEME.DOMINANT, 
        fontFamily: theme.typography.fontFamily,
        fontSize: fontSize || THEME.FONT.HEADING(),
    }),

    button: (width?: number, disabled?: boolean) => ({
        height: 40,
        borderRadius: 0,
        boxShadow: "none",
        width: width || 275,
        color: COLORS.WHITE,
        margin: `7.5px 0 0 0`,
        textTransform: "none",
        fontSize: THEME.FONT.SUB_HEADING(),
        backgroundColor: disabled? "#0000008a" : THEME.BUTTON_ACCENT,
        '&:hover': {
            backgroundColor: disabled? "#0000008a" : THEME.ACTIVE_ACCENT,
        },
        '&:active': {
            backgroundColor: disabled? "#0000008a" : THEME.ACTIVE_ACCENT,
        },
    }),

    formField: (disable?: boolean) => ({
        width: 275,
        margin: 7.5,
        borderRadius: 0,
        fontSize: THEME.FONT.PARAGRAPH(),
        '&:active': {
            border: disable? "" : `1px solid ${COLORS.WHITE}`
        }
    }),

    formFieldHelper: () => ({
        margin: "0 7.5px",
        fontSize: THEME.FONT.PARAGRAPH(), 
        color: COLORS.LIGHT_GRAY,
        '&:hover': {
            color: THEME.DOMINANT
        }
    }),

    /*** Admin Table ***/
    adminSelect: () => ({
        width: 100,
        height: 40,
        borderRadius: "5px",
        fontSize: THEME.FONT.PARAGRAPH(),
    }),

    /*** Custom Table ***/
    customTableCell: () => ({
        padding: 0,
        border: "none"
    }),

    /*** Editables ***/
    editable: (edit?: boolean, filled?: boolean, color?: string) => ({
        // width: "auto",
        minWidth: 25,
        outline: "none",
        opacity: edit? 1 : 0.8,
        wordBreak: "break-all",
        fontFamily: 'KG Broken Vessels Sketch',
        
        padding: filled? "10px" : "",
        margin: filled? "20px 0 10px 0" : "",
        border: filled && edit? `1px solid ${color || THEME.ACTIVE_ACCENT}` : "",
        
        borderBottom: edit? `1px solid ${THEME.ACTIVE_ACCENT}` : "", 
        backgroundColor: filled && edit? `${color || THEME.ACTIVE_ACCENT}32` : COLORS.TRANSPARENT,
    }),

    /*** Navigation ***/
    navRail: () => ({
        margin: 20,
        alignSelf: "flex-start"
    }),

    navRailLink: () => ({
        padding: "5px 5px 5px 0",
        '&:hover': {
            color: THEME.BACKGROUND_ACCENT,
        },
    }),

    navRailLinkText: (active: boolean, fontSize?: string | number, hoverColor?: string) => ({
        color: active? THEME.DOMINANT : THEME.TEXT,
        fontSize: fontSize || THEME.FONT.PARAGRAPH(),
        '&:hover': {
            color: hoverColor? hoverColor : active? THEME.DOMINANT : THEME.ACTIVE_ACCENT,
        },
    }),

    navArrayLink: (active: boolean, backgroundColor?: string) => ({
        width: "130px", 
        height: "130px", 
        margin: "10px",
        borderRadius: 5,
        textDecoration: "none", 
        backgroundColor: `${backgroundColor || THEME.BUTTON_ACCENT}`,
    }),

    divider: (marginTop?: number) => ({
        width: "100%", 
        color: COLORS.WHITE,
        marginTop: `${marginTop || -1.5}vw`,
        "&::before, &::after": {
            borderColor: COLORS.WHITE,
        }
    }),

    /*** Sidebar ***/
    sidebarSectionButton: (active?: boolean) => ({
        borderRadius: 0,
        textTransform: "none", 
        color: active? THEME.BACKGROUND_ACCENT : THEME.DOMINANT,
        justifyContent: "flex-start", 
        padding: "20px 20px 20px 20px",
        fontSize: THEME.FONT.SUB_HEADING(),
        backgroundColor: active? THEME.ACTIVE_ACCENT : COLORS.TRANSPARENT,
        '&:hover': {
            backgroundColor: THEME.DOMINANT,
            color: THEME.BACKGROUND_ACCENT,
        },
    }),

    /*** Module ***/
    stepButton: (active?: boolean) => ({
        width: 40,
        height: 40, 
        minWidth: 0,
        borderRadius: "50%",
        color: THEME.BACKGROUND_ACCENT,
        fontSize: THEME.FONT.SUB_HEADING(),
        backgroundColor: `${THEME.BUTTON_ACCENT}`,
        '&:hover': {
            color: THEME.BACKGROUND_ACCENT,
            backgroundColor: `${THEME.ACTIVE_ACCENT}`,
        }
    }),

    entryDivider: (show?: boolean) => ({
        width: "calc(100% - 150px)",
        opacity: show? 1 : 0,
        "&:hover": {
            opacity: 1
        }
    }),

    entryButton: () => ({
        margin: "0 5px 0 5px",
        textTransform: "none",
        color: THEME.DOMINANT,
        fontSize: THEME.FONT.PARAGRAPH(),
    }),

    tabDeleteButton: (active?: boolean) => ({
        width: 75,
        opacity: 0,
        margin: "0 -15px 0 10px",
        "&:hover": {opacity: active? 1 : 0}
    }),

    saveContentButton: () => ({
        color: THEME.BUTTON_ACCENT,
        opacity: 0.5,
        "&:hover": {
            opacity: 1
        }
    }),

    deleteContentButton: (show?: boolean) => ({
        display: show? "" : "none",
        opacity: 0.5,
        color: THEME.ERROR,
        "&:hover": {
            opacity: 1
        }
    }),

    programHeaderButton: () => ({
        margin: "5px 10px 5px 10px",
        color: THEME.DOMINANT,
        opacity: .5,
        "&:hover": {
            opacity: 1,
        }
    }),

    entryHeader: (edit?: boolean, opacity?: number) => ({
        width: "100%",
        borderBottom: "none", 
        opacity: opacity || edit? 1 : 0.5,
        fontSize: THEME.FONT.PARAGRAPH(), 
    }),

    promptEntry: (edit?: boolean, opacity?: number) => ({
        padding: 10,
        minHeight: 150,
        maxHeight: 300,
        outline: "none",
        resize: "vertical",
        opacity: opacity? opacity : edit? 1 : 0.5,
        width: "calc(100% - 20px)",
        fontSize: THEME.FONT.PARAGRAPH(), 
        border: `1px solid ${THEME.DOMINANT}`, 
    }),

    moveContentButton: (show?: boolean) => ({
        display: show? "" : "none",
        opacity: 0.5,
        color: THEME.DOMINANT,
        "&:hover": {
            opacity: 1
        }
    }),
}