import React from "react";  
import Statusicon from 'assets/StatusNDL_Icon.svg?react';
 
export default function StatusNDL(props) { 
    // const ClassColor = 
    function capitalizeWords(text) {
      if (!text) return ''; // Handle empty or undefined input
      return text
          .toLowerCase() // Convert entire text to lowercase
          .split(' ') // Split by spaces to handle multiple words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(' '); // Join the words back into a single string
  }
    let ClassColor1
      if(props.colorbg === "error"){
        ClassColor1 = `text-[14px] leading-4  text-Error-error-text bg-Error-error-base dark:bg-Error-error-base-dark dark:text-Error-error-text `
      }else if(props.colorbg === "error-alt"){
        ClassColor1 = `text-[14px] leading-4  text-Error-error-text-alt bg-Error-error-base-alt dark:bg-Error-error-base-alt-dark dark:text-Error-error-text-alt `
      }
      else if(props.colorbg==="neutral"){
        ClassColor1 = `text-[14px]  leading-4 bg-Neutral-neutral-base dark:bg-Neutral-neutral-base-dark text-Neutral-neutral-text dark:text-Neutral-neutral-text-dark `
      }else if(props.colorbg==="neutral-alt"){
        ClassColor1 = `text-[14px]  leading-4 bg-Neutral-neutral-base-alt dark:bg-Neutral-neutral-base-alt-dark text-Neutral-neutral-text-alt dark:text-Neutral-neutral-text-alt-dark `
      }
      else if(props.colorbg==="success"){
        ClassColor1 = `text-[14px] leading-4 bg-Success-success-base dark:bg-Success-success-base-dark text-Success-success-text dark:text-Success-success-text-dark `
      }else if(props.colorbg==="success-alt"){
        ClassColor1 = `text-[14px] leading-4 bg-Success-success-base-alt dark:bg-Success-success-base-alt-dark text-Success-success-text-alt dark;text-Success-success-text-alt-dark `
      }
      else if(props.colorbg==="warning02-alt"){
        ClassColor1 = `text-[14px] leading-4 bg-Warning02-warning-02-base-alt dark:bg-Warning02-warning-02-base-alt-dark text-Warning02-warning-02-text-alt dark:text-Warning02-warning-02-text-alt-dark `
      }else if(props.colorbg==="warning02"){
        ClassColor1 = `text-[14px] leading-4 bg-Warning02-warning-02-base dark:bg-Warning02-warning-02-base-dark text-Warning02-warning-02-text dark:text-Warning02-warning-02-text-dark `
      }else if(props.colorbg === 'info'){
        ClassColor1 = `text-[14px] leading-4 bg-Info-info-base dark:bg-Info-info-base-dark text-Info-info-text dark:text-Info-info-text-dark `
    }else if(props.colorbg === 'info-alt'){
        ClassColor1 = `text-[14px] leading-4 bg-Info-info-base-alt dark:bg-Info-info-base-alt-dark text-Info-info-text-alt dark:text-Info-info-text-alt-dark `
    }else if(props.colorbg === 'warning01-alt'){
        ClassColor1 = `text-[14px] leading-4 bg-Warning01-warning-01-base-alt dark:bg-Warning01-warning-01-base-alt-dark text-Warning01-warning-01-text-alt dark:text-Warning01-warning-01-text-alt-dark `
    }else if(props.colorbg === 'warning01'){
        ClassColor1 = `text-[14px] leading-4 bg-Warning01-warning-01-base dark:bg-Warning01-warning-01-base-dark text-Warning01-warning-01-text dark:text-Warning01-warning-01-text-dark `

    }
    return (            
            <button id="badge-dismiss-default" class={`flex gap-1 ${props.lessHeight ? 'h-[24px] px-2 py-1 rounded-[6px]' : 'h-[32px] p-2 rounded-[8px]'}  items-center justify-center text-center text-[14px] font-medium leading-[16px] min-w-[80px] `  + ClassColor1} style={props.style}
>
               
             
               {props.icon ? <props.icon fill={props.stroke ? props.stroke : undefined}/>: <Statusicon className={`fill-${props.colortxt}-800`} />}
            
 

                {<p style={props.style ? props.style: undefined} className={`my-0 ${props.icon ? "mx-1 mr-2" : ''} font-geist-sans text-[14px]`}>{capitalizeWords(props.name)}</p>}
               
            </button>
           
    )
}