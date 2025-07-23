import React from 'react';
function LinkNDL(props){
    const linkstyle = `${props.disabled ? "text-Link-link-disable dark:text-Link-link-disable-dark" : "font-normal font-geist-sans text-Link-link-default dark:text-Link-link-default-dark active:underline hover:underline active:text-Links-link-active dark:active:text-Link-link-active-dark cursor-pointer hover:text-Link-link-hover dark:hover:text-Link-link-hover-dark  visited:text-Link-link-visited dark:visited:text-Link-link-visited-dark "} inline-flex items-center justify-center  leading-[16px] text-[14px] justify-content`
    const iconCss = `stroke-current align-middle${props.text?" w-4 h-4 ml-2  ":"w-10 h-10"}`
   
    return (  
       <React.Fragment>
       <div class={'flex'}>
        <a href={props.path} style={props.style} class={linkstyle} onClick={props.onClick && !props.disabled?props.onClick:{}}>
            {props.text}
            {props.icon?<props.icon class={iconCss}/>:""}
        </a>
        
       
      
        
        </div>
       </React.Fragment>
    )
}
export default LinkNDL;