import { createTheme } from "@mui/material";

export const theme = createTheme({
    typography: {
      fontFamily: 'Helios Extended',
      body1: {
        // color: THEME.TEXT
      },
      h1: {
        // fontSize: "3.5vh"
      }
    },
    palette: {
        background: {
            default: "#F2EFEA"
        },
        primary: {
            main: "#F2EFEA"
        },
        secondary: {
            main: "#365E32"
        },
        error: {
            main: "#FF3333"
        },
        warning: {
            main: "#E7D37F"
        },
        info: {
            main: "#365E32"
        },
        success: {
            main: "#81A263"
        },
        text: {
            primary: "#000000",
            secondary: "#0D0D0D"
        }
    }
  })