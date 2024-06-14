import { COLORS, THEME } from "./constants";

export const styles: any = {
    button: {
        width: 275,
        height: 40,
        borderRadius: "5px",
        boxShadow: "none",
        color: COLORS.WHITE,
        margin: `7.5px 0 0 0`,
        textTransform: "none",
        fontSize: THEME.FONT.SUB_HEADING,
        backgroundColor: THEME.BUTTON_ACCENT,
        '&:hover': {
            backgroundColor: THEME.ACTIVE_ACCENT,
        },
        '&:active': {
            backgroundColor: THEME.ACTIVE_ACCENT,
        },
    },

    testimonialImage: {
        maxWidth: "98%", 
        height: 350, 
        border: `1px solid ${THEME.ACTIVE_ACCENT}`
    },

    formField: {
        width: 275,
        margin: 7.5,
        borderRadius: "5px",
        fontSize: THEME.FONT.PARAGRAPH,
        '&:active': {
            border: `1px solid ${COLORS.WHITE}`
        }
    },

    /*** Custom Table ***/
    customTableCell: {
        padding: 0,
        border: "none"
    },

    /*** Admin Panel ***/
    adminPanel: {
        // height: "calc(100% - 110px)"
    },
    
    adminHeaderStyle: {
        height: 50, 
        marginBottom: 10,
        borderRadius: "5px",
        width: "calc(80% - 2px)",
        border: `1px solid ${COLORS.LIGHT_GRAY}`, 
    },

    adminTable: (width?: number, orientation?: string) => ({
        marginTop: 0,
        width: "80%",
        scrollbarWidth: "none",
        maxHeight: "calc(100vh - 250px)"
    }),

    adminSelect: {
        width: 100,
        height: 40,
        borderRadius: "5px",
        fontSize: THEME.FONT.PARAGRAPH,
    },

    adminHeaderButton: (active?: boolean) => ({
        width: 200,
        height: "40px", 
        margin: "10px",
        textTransform: "none",
        // opacity: active? 1 : 0.5,
        fontSize: THEME.FONT.SUB_HEADING, 
        color: active? THEME.BUTTON_ACCENT : THEME.DOMINANT,
    }),

    /*** Sidebar ***/
    sidebarSectionButton: (active?: boolean) => ({
        borderRadius: 0,
        textTransform: "none", 
        color: active? THEME.BACKGROUND_ACCENT : THEME.DOMINANT,
        justifyContent: "flex-start", 
        padding: "20px 20px 20px 20px",
        fontSize: THEME.FONT.SUB_HEADING,
        backgroundColor: active? THEME.ACTIVE_ACCENT : COLORS.TRANSPARENT,
        '&:hover': {
            color: THEME.BACKGROUND_ACCENT,
            backgroundColor: THEME.DOMINANT,
        },
    }),

    /*** Navigation ***/
    navigationButton: (active?: boolean, width?: number, height?: number, fontSize?: number, keepColor?: boolean) => ({
        margin: "10px",
        borderRadius: "5px",
        width: width || 150, 
        textTransform: "none",
        height: height || 150, 
        opacity: active? 1 : 0.5,
        color: THEME.BACKGROUND_ACCENT,
        backgroundColor: `${THEME.BUTTON_ACCENT}`,
        fontSize: fontSize || THEME.FONT.SUB_HEADING,
        '&:hover': {
            opacity: 1,
            backgroundColor: keepColor? THEME.BUTTON_ACCENT : `${THEME.ACTIVE_ACCENT}`,
        }
    }),

    /*** Module ***/
    stepButton: (active?: boolean) => ({
        width: 40,
        height: 40, 
        minWidth: 0,
        borderRadius: "50%",
        color: THEME.BACKGROUND_ACCENT,
        fontSize: THEME.FONT.SUB_HEADING,
        backgroundColor: `${THEME.BUTTON_ACCENT}`,
        '&:hover': {
            color: THEME.BACKGROUND_ACCENT,
            backgroundColor: `${THEME.ACTIVE_ACCENT}`,
        }
    }),

    tabIndicator: (active?: boolean) => ({
        backgroundColor: active? THEME.ACTIVE_ACCENT : COLORS.TRANSPARENT,
    }),

    tabLabel: (active?: boolean) => ({
        margin: "0 20px 0 20px",
        color: active? THEME.ACTIVE_ACCENT : THEME.BUTTON_ACCENT
    }),

    entryDivider: (show?: boolean) => ({
        width: "100%",
        opacity: show? 1 : 0,
        "&:hover": {
            opacity: 1
        }
    }),

    entryButton: {
        margin: "0 5px 0 5px",
        textTransform: "none",
        color: THEME.DOMINANT,
        fontSize: THEME.FONT.PARAGRAPH,
    },

    tabs: {
    },

    tabDeleteButton: (active?: boolean) => ({
        width: 75,
        opacity: 0,
        margin: "0 -15px 0 10px",
        "&:hover": {opacity: active? 1 : 0}
    }),

    saveContentButton: {
        color: THEME.BUTTON_ACCENT,
        opacity: 0.5,
        "&:hover": {
            opacity: 1
        }
    },

    deleteContentButton: (show?: boolean) => ({
        display: show? "" : "none",
        opacity: 0.5,
        color: THEME.ERROR,
        "&:hover": {
            opacity: 1
        }
    }),

    programHeaderButton: {
        margin: "5px 10px 5px 10px",
        color: THEME.DOMINANT,
        opacity: .5,
        "&:hover": {
            opacity: 1,
        }
    },

    title: (edit?: boolean) => ({
        width: "min-content",
        opacity: edit? 1 : 0.5,
        fontSize: THEME.FONT.HEADING, 
        // borderBottom: edit? `1px solid ${THEME.DOMINANT}` : "none",
    })
}