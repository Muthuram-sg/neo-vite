import { useRecoilState } from "recoil";
import {  themeMode} from "recoilStore/atoms";

export default function TailwindTheme() {
    const [curTheme] = useRecoilState(themeMode);
    return{
        typography: {
        fontFamily: "Inter, sans-serif",
        },
        colorPalette: {
        primary: curTheme === "dark" ? "#FCFCFC" : "#101010",
        activeClor:"#E0E0E0",
        secondary: "#585757",
        disabled: "#c4c4c4",
        darkSecondary: "#c4c4c4",
        hover: curTheme === "dark" ? "#3A3B3C" : "#EEEEEE",
        divider: curTheme === "dark" ? "#1F2021" : "#E8E8E8",
        inputFields: curTheme === "dark" ? "#1E1E1E" : "#F4F4F4",
        dropdown: curTheme === "dark" ? "#232323" : "#FCFCFC",
        cards: curTheme === "dark" ? "#171717" : "#FCFCFC",
        foreGround: curTheme === "dark" ? "#0D0D0D" : "#FFFFFF",
        backGround: curTheme === "dark" ? "#000000" : "#FFFFFF",
        blue: "#0F6FFF",
        accentOrange: "#FF9500",
        accentRed: "#FFCFCC",
        genericRed: "#FF0D00",
        colorpicker1: "#76CA66",
        colorpicker2: "#FBC756",
        colorpicker3: "#F35151",
        divcolor: "#F4F4F4"
        },
        palette: {
        background: {
            default: curTheme === "dark" ? "#161616" : "#F4F4F4",
            paper: curTheme === "dark" ? "#262626" : "#fff", 
            grey: "#E5E5E5",
            white: "#FCFCFC",
            dark: "#101010",
            darkGrey: "#181818",
            blue: "#F3F8FF",
            lightGrey: "#F8F8F8"
        },
        border: {
            grey: "#E8E8E8",
            dark: "#3E4042"
        },
        type: curTheme,
        primary: {
            main: "#0F6FFF",
            light: "#3f81fe",
            dark: "#0a44b1"

        },
        secondaryText: {
            main: "#585757",
            primary: "#101010",
            secondary: "#0D0D0D"
        },
        secondary: {
            main: "#8a3ffc",
            light: "#a165fc",
            dark: "#602cb0"

        },
        error: {
            main: "#da1e28"

        },
        warning: {
            main: "#f57922",
        },
        info: {
            main: "#f1c21b",
        },
        success: {
            main: "#24a148",
        },
        contrastThreshold: 1,
        // Used to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.1,
        },
        props: {
        // Name of the component
        MuiButtonBase: {
            // The properties to apply
            disableRipple: true // No more ripple, on the whole application!
        }
        },
        divider: {
        border: '2px solid #E8E8E8'
        },
        list: {
        padding: '4px'
        },
        menuPaper: {
        maxHeight: 250,
        background: curTheme === "dark" ? "#232323" : "#FCFCFC",
        },
        menuBackground: {
        background: curTheme === "dark" ? "#232323" : "#FCFCFC",
        },
        subList: {
        padding: '4px 4px 16px 4px'
        },
        textField: {
        background: curTheme === "dark" ? "#1E1E1E" : "#F4F4F4",
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 500,
        color: curTheme === "dark" ? "#FCFCFC" : "#101010",
        padding: '10px',
        marginTop: '5px',
        height: '2.6rem'
        },
        textField1: {
        background: curTheme === "dark" ? "#1E1E1E" : "#F4F4F4",
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 500,
        color: curTheme === "dark" ? "#FCFCFC" : "#101010",
        padding: '10px',
        height: '3.3rem'
        },
        border: '1px solid #E8E8E8',
        padding: '0px !important',
        height: '94vh',
        headerColor: '#101010',
        color2: '#585757',
        blueColor: '#0F6FFF',
        blueborder: '1px solid #0F6FFF',
        warning: '#FF9500',
        critical: '#FF0D00',
        ok: '#4AD962',
        text1: {
        fontSize: 9,
        fontWeight: 400,
        lineHeight: '18px'
        },
        text2: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: '24px'
        },
        actionIcons: {
        margin: '0px 5px',
        cursor: 'pointer'
        },
        overrides: {
        MuiCssBaseline: {
            '@global': {
            '*::-webkit-scrollbar': {
                width: '10px',
                height: '10px'
            },
            '*::-webkit-scrollbar-track': {
                background: "#E3E3E3"
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: "#9A9A9A",
                borderRadius: 16
            },
            '::-webkit-scrollbar-thumb': {
                '&:hover': {
                backgroundColor: "#787878",
                },
            }
            }
        }
        }
    }
}