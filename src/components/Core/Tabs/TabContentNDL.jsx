import React from "react";  
import {useRecoilState} from 'recoil';
import {themeMode} from 'recoilStore/atoms' 


export default function TabContentNDL(props){
    const [curTheme]=useRecoilState(themeMode);
    const iconCss = `stroke-current align-middle${props.value?" w-4 h-4  mr-2":""}`
   
  
    return( 
        <React.Fragment>
            <li class="block font-geist-sans  " style={{width :props.width ? props.width : "100%"}}>
            <button id={props.id} class={` ${props.lessHeight ?  "h-8 p-2" : "h-12 py-3 px-2" }  text-[14px] leading-[16px]   ${props.selected ? "text-Text-text-primary dark:text-Text-text-primary-dark border-b-2  border-Primary_Interaction-primary-default dark:border-Primary_Interaction-primary-default-dark font-medium"  : " text-Text-text-tertiary dark:text-Text-text-tertiary-dark  hover:bg-Surface-surface-hover  dark:hover:bg-Surface-surface-hover-dark font-normal  "} bg-Background-bg-primary dark:bg-Background-bg-primary-dark font-geist-sans    flex items-center justify-left`} style={{width :props.width ? props.width : "calc(100%)",justifyContent : props.justifyContent ? props.justifyContent : undefined}} onClick={props.onClick} >
            {props.icon?<props.icon  class={iconCss}/>:""}
            {props.value}
            </button>
            </li>
        </React.Fragment>
    )
}