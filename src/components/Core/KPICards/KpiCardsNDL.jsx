import React from "react";
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"


export default function KpiCardsNDL(props){
    const [curTheme]=useRecoilState(themeMode)

    return(
<div class={`block w-full h-full  p-4 border-Border-border-50 dark:border-Border-border-dark-50  border rounded-2xl   dark:bg-Background-bg-primary-dark bg-Background-bg-primary ` + props.className}
 id={props.id}
 style={props.style}
 onClick={props.onClick}
 >
    {props.children}
</div>
    )
}