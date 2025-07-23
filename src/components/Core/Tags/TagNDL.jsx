import React from "react";  



export default function TagNDL(props) { 
    const ClassColor = `text-${props.color}-800 bg-${props.color}-100 dark:bg-${props.color}-900 dark:text-${props.color}-300 bg-${props.color}`
    const BtnColor = `text-${props.color}-400 hover:bg-${props.color}-200 hover:text-${props.color}-900 dark:hover:bg-${props.color}-800 dark:hover:text-${props.color}-300`
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
        ClassColor1 = `text-[14px] leading-4  text-Error-error-text bg-Error-error-base dark:bg-Error-error-base-dark dark:text-Error-error-text`
      }else if(props.colorbg === "error-alt"){
        ClassColor1 = `text-[14px] leading-4  text-Error-error-text-alt bg-Error-error-base-alt dark:bg-Error-error-base-alt-dark dark:text-Error-error-text-alt`
      }
      else if(props.colorbg==="neutral"){
        ClassColor1 = `text-[14px]  leading-4 bg-Neutral-neutral-base dark:bg-Neutral-neutral-base-dark text-Neutral-neutral-text dark:text-Neutral-neutral-text-dark`
      }else if(props.colorbg==="neutral-alt"){
        ClassColor1 = `text-[14px]  leading-4 bg-Neutral-neutral-base-alt dark:bg-Neutral-neutral-base-alt-dark text-Neutral-neutral-text-alt dark:text-Neutral-neutral-text-alt-dark`
      }
      else if(props.colorbg==="success"){
        ClassColor1 = `text-[14px] leading-4 bg-Success-success-base dark:bg-Success-success-base-dark text-Success-success-text dark:text-Success-success-text-dark `
      }else if(props.colorbg==="success-alt"){
        ClassColor1 = `text-[14px] leading-4 bg-Success-success-base-alt dark:bg-Success-success-base-alt-dark text-Success-success-text-alt dark:text-Success-success-text-alt-dark `
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
            <span style={{ minWidth:props.noWidth ? undefined : "80px",width:!props.noWidth ? undefined : props.noWidth,height:props.noHeight ? undefined : props.lessHeight ? "24px" : "32px", justifyContent:"center", ...props.style ? { ...props.bordercolor, ...props.style } : {} }}
             id="badge-dismiss-default" class={`flex  ${props.lessHeight ? "px-2 py-1" : 'px-3 py-2'} items-center cursor-pointer  rounded-lg   `+ClassColor + ClassColor1} onClick={props.onClick}>
                
                {props.icon && <props.icon class={`${props.stroke ? '' : `stroke-${props.color}-800`}`} stroke={props.stroke ? props.stroke : undefined}/>}

                {
                  props.value ? 
                   
                  <div className={`flex items-center gap-1 ${props.icon && !props.lessHeight ? "mx-2 mr-0" : "mx-0 mr-0"} `}>
<p style={props.style ? props.style: undefined} className={`my-0  text-[14px] leading-4 font-normal font-geist-sans `}>{capitalizeWords(props.name)}</p>
<p style={props.style ? props.style: undefined} className={`my-0  text-[14px] leading-4 font-normal  font-geist-mono `}>{props.value}</p>
                    </div>

                    :
                    <div className={`flex items-center gap-1 ${props.icon && !props.lessHeight ? "m-2" : "mx-0 mr-0"} `}>
<p style={props.style ? props.style: undefined} className={`my-0  text-[14px] leading-4 font-normal font-geist-sans`}>{capitalizeWords(props.name)}</p>
                   </div>
                    
                    
                    }
                {props.Lefticon && <props.Lefticon  stroke={props.Lefticon ? props.Lefticon : undefined}/>}
                {props.close &&
                <button  style={props.style ? props.style: undefined} type="button" class={"inline-flex items-center   bg-transparent rounded-full-sm"+BtnColor} data-dismiss-target="#badge-dismiss-default" aria-label="Remove" onClick={props.onClick}>
                    <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Remove badge</span> 
                </button>
                }
            </span>
            
    )
}