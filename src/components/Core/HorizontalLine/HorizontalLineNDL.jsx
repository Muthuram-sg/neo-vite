import React from "react";  
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"


export default function HorizontalLineNDL(props) {
    const [curTheme]=useRecoilState(themeMode)
    var color = ""
    if(props.variant === "divider1"){
        color = "bg-primary-divider "
    }else if(props.variant === "divider2"){
        color = "bg-secondary-divider"
    }else if(props.color){
        color = `"bg-[${props.color}]"`
    }
    const orientationClass = props.orientation === "vertical" ? "mt-1 rotate-90  " : "";
    var width = ""
    if(props.middle){
        width = "w-[calc(100%-10px)]"
    }else{
        width = "w-full"
    }
   
    return (
        <React.Fragment>
                <hr class={`${width}  mx-auto ${color}  border-1 rounded dark:border-Border-border-dark-50  ${orientationClass}`}
                     style={props.style} id={props.id} />
        </React.Fragment>
    )
}