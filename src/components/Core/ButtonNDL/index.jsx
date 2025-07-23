import React from 'react';
import {useRecoilState} from 'recoil'
import {themeMode} from 'recoilStore/atoms'
import ChervonDown from 'assets/neo_icons/Notification/chevron_down_btn.svg?react';
function ButtonNDL(props){
    // eslint-disable-next-line no-unused-vars 
    const [curTheme]=useRecoilState(themeMode)
    let buttonType = "";
    let Icons ="p-2"
    let ThemCss = (curTheme === 'dark') ? 'hover:text-gray-800' : ''

    if(props.danger){
         if(props.type ==='ghost'){
            buttonType = `${props.disabled ? "text-Danger_Button-danger-button-disable dark:text-Danger_Button-danger-button-disable-dark" :"hover:bg-Danger_Button-danger-button-hover dark:hover:bg-Danger_Button-danger-button-hover-dark hover:text-Danger_Button-danger-button-text dark:hover:text-Danger_Button-danger-button-text-dark   active:bg-Danger_Button-danger-button-active dark:active:bg-Danger_Button-danger-button-active-dark active:text-Danger_Button-danger-button-text dark:active:text-Danger_Button-danger-button-text-dark text-Danger_Button-danger-button-default dark:text-Danger_Button-danger-button-default-dark focus:bg-Danger_Button-danger-button-hover focus:text-Danger_Button-danger-button-text dark:focus:bg-Danger_Button-danger-button-hover-dark focus:border-Blue-color-blue-400 dark:focus:border-Blue-color-blue-600 focus:border dark:focus:text-Danger_Button-danger-button-text-dark "} leading-[16px]   rounded-md font-normal  text-[14px]   h-8 inline-flex items-center justify-center font-geist-sans  ${Icons}`
        }else{
            buttonType = `text-white ${props.disabled? "bg-Danger_Button-danger-button-disable dark:bg-Danger_Button-danger-button-disable-dark ":"bg-Danger_Button-danger-button-default dark:bg-Danger_Button-danger-button-default-dark hover:bg-Danger_Button-danger-button-hover dark:hover:bg-Danger_Button-danger-button-hover-dark  focus:bg-Danger_Button-danger-button-hover focus:border-Blue-color-blue-400 dark:focus:border-Blue-color-blue-400 focus:border   dark:focus:bg-Danger_Button-danger-button-hover-dark active:bg-Danger_Button-danger-button-active dark:active:bg-Danger_Button-danger-button-active-dark"} leading-[16px] rounded-md font-normal  text-[14px] h-8 inline-flex items-center justify-center font-geist-sans ${Icons}`
        } 
         
    }  
    else {
        if(props && props.type === 'secondary'){
            buttonType = `${props.disabled ? "bg-Secondary_Button-secondary-button-disable  text-Text-text-disabled dark:text-Text-text-disabled-dark " : "hover:bg-Secondary_Button-secondary-button-hover      focus:bg-Secondary_Button-secondary-button-hover dark:focus:bg-Secondary_Button-secondary-button-hover-dark dark:hover:bg-Secondary_Button-secondary-button-hover-dark  active:border-Focus-focus-primary dark:active:border-Focus-focus-primary-dark  focus:border-solid focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary-dark  active:bg-Secondary_Button-secondary-button-active dark:active:bg-Secondary_Button-secondary-button-active-dark bg-Secondary_Button-secondary-button-default dark:bg-Secondary_Button-secondary-button-default-dark text-Secondary_Button-secondary-button-text dark:text-Secondary_Button-secondary-button-text-dark"} 
            leading-[16px] text-[14px]  border border-solid border-Border-border-50 dark:border-Border-border-dark-50 rounded-md font-normal   h-8   inline-flex items-center justify-center  font-geist-sans  ${Icons} `   
        }else if(props.type === 'tertiary'){
            buttonType = `${props.disabled ? "border-Tertiary_Button-tertiary-button-disable dark:border-Tertiary_Button-tertiary-button-disable-dark   text-Tertiary_Button-tertiary-button-disable dark:text-Tertiary_Button-tertiary-button-disable-dark" : "dark:hover:bg-Tertiary_Button-tertiary-button-hover-dark hover:bg-Tertiary_Button-tertiary-button-hover focus:bg-Tertiary_Button-tertiary-button-hover dark:focus:bg-Tertiary_Button-tertiary-button-hover-dark  hover:stroke-white dark:active:bg-Tertiary_Button-tertiary-button-active-dark  active:bg-Tertiary_Button-tertiary-button-active border-Tertiary_Button-tertiary-button-default active:text-Text-text-alt  dark:active:text-Text-text-alt-dark active:border-Tertiary_Button-tertiary-button-active dark:active:border-Tertiary_Button-tertiary-button-active-dark  dark:border-Tertiary_Button-tertiary-button-default-dark dark:text-Tertiary_Button-tertiary-button-text-dark  text-Tertiary_Button-tertiary-button-text"}
             leading-[16px]  border  rounded-md font-normal text-[14px] h-8  inline-flex items-center justify-center font-geist-sans ${Icons}`
        }else if(props.type === 'ghost'){
            let disableCss = props.disabled ? "text-Tertiary_Button-tertiary-button-disable dark:text-Tertiary_Button-tertiary-button-disable-dark text-[14px] leading-[16px]  " : `hover:bg-Tertiary_Button-tertiary-button-hover dark:hover:bg-Tertiary_Button-tertiary-button-hover-dark  hover:text-Tertiary_Button-tertiary-button-text dark:hover:text-Tertiary_Button-tertiary-button-text-dark   text-[14px]  text-Tertiary_Button-tertiary-button-text dark:text-Tertiary_Button-tertiary-button-text-dark  focus:bg-Tertiary_Button-tertiary-button-hover dark:focus:bg-Tertiary_Button-tertiary-button-hover-dark  ${ThemCss} focus:border active:border  active:border-Tertiary_Button-tertiary-button-active dark:active:border-Tertiary_Button-tertiary-button-active-dark focus:border-Focus-focus-primary  dark:focus:border-Focus-focus-primary-dark active:text-Text-text-alt   focus:text-Tertiary_Button-tertiary-button-text
            dark:focus:text-Tertiary_Button-tertiary-button-text-dark
            dark:active:text-Text-text-alt-dark  active:bg-Tertiary_Button-tertiary-button-active dark:active:bg-Tertiary_Button-tertiary-button-active-dark font-geist-sans`
            buttonType = `${disableCss} leading-[16px]  rounded-md font-normal   h-8   inline-flex items-center justify-center  ${Icons}`
        }else{
            buttonType = `text-white ${props.disabled ? " bg-Primary_Button-primary-button-disable dark:bg-Primary_Button-primary-button-disable-dark cursor-not-allowed" : "bg-btn-prime-bg active:bg-Primary_Button-primary-button-active dark:active:bg-Primary_Button-primary-button-active-dark focus:bg-Primary_Button-primary-button-hover dark:focus:bg-Primary_Button-primary-button-hover-dark  hover:bg-Primary_Button-primary-button-hover dark:hover:bg-Primary_Button-primary-button-hover focus:bg-btn-prime-hover active:bg-btn-prime-active"}  leading-[16px] rounded-md font-normal text-[14px] ${Icons} font-geist-sans h-8    inline-flex items-center justify-center text-Primary_Button-primary-button-text dark:text-Primary_Button-primary-button-text-dark `
        }   
        
    }
    
    

    const iconCss = `${props.noStroke ? "" :"stroke-current"} align-middle${props.value ? " w-4 h-4 mr-2  ":"w-10 h-8"}`
    const leftIcon = `${props.noStroke ? "" :"stroke-current"} align-middle${props.value ? " w-2 h-2 ml-2  ":"w-10 h-8"}`
    const minWidth = props.icon && !props.value ? ' min-w-[32px] flex items-center justify-center'  :' min-w-[80px] flex items-center justify-center'
    return( 
        <button id={props.id} ref={props.inputRef} type="button" style={props.style ? props.style : undefined} class={buttonType + minWidth } onClick={props.onClick && !props.disabled && !props.loading ? props.onClick : undefined} >
            {
                props.loading?(
                    <React.Fragment> 
                        Loading...
                    </React.Fragment>
                ):(
                    <React.Fragment>

                        {props.icon && <props.icon class={iconCss} stroke={props.stroke}/>}
                        {props.value && <span className={""}>{props.value}</span>}
                        {
                            props.Righticon && 
                            <ChervonDown class={leftIcon} stroke={props.stroke}/>
                        }
                    </React.Fragment>
                )
            }
            
            
        </button> 
    )
}
export default ButtonNDL;