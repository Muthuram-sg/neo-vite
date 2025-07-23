import React from "react";  
 
export default function Datacapsule(props) { 
    function capitalizeWords(text) {
      if (!text) return ''; // Handle empty or undefined input
      return text
          .toLowerCase() // Convert entire text to lowercase
          .split(' ') // Split by spaces to handle multiple words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(' '); // Join the words back into a single string
  }
    let ClassColor1
    let ClassColor2
      if(props.colorbg==="red"){
        ClassColor1 = `text-[14px] leading-4  text-Error-error-text-alt bg-Error-error-base-alt dark:bg-Error-error-base-alt-dark dark:text-Error-error-text-alt-dark;`
        ClassColor2 = `text-[14px] leading-4  bg-Error-error-base dark:bg-Error-error-base-dark dark:bg-Error-error-text-dark text-Error-error-text dark:text-Error-error-text-dark`

      }
      else if(props.colorbg==="silver"){
        ClassColor1 = `text-[14px]  leading-4 bg-Neutral-neutral-base-alt dark:bg-Neutral-neutral-base-alt-dark text-Neutral-neutral-text-alt dark:text-Neutral-neutral-text-alt-dark `
        ClassColor2 = `text-[14px] leading-4  bg-Neutral-neutral-base dark:bg-Neutral-neutral-base-dark text-Neutral-neutral-text dark:text-Neutral-neutral-text-dark `
      }
      else if (props.colorbg === "yellow") {
        ClassColor1 = `text-[14px] leading-4 bg-Warning01-warning-01-base-alt dark:bg-Warning01-warning-01-base-alt-dark text-Neutral-neutral-text-alt `;
        ClassColor2 = `text-[14px] leading-4 bg-Warning01-warning-01-base dark:bg-Warning01-warning-01-base-dark text-Neutral-neutral-text `;
    }    
      else if(props.colorbg==="green"){
        ClassColor1 = `text-[14px] leading-4 bg-Success-success-base-alt dark:bg-Success-success-base-alt-dark text-Success-success-text-alt  dark:text-Success-success-text-alt-dark`
        ClassColor2 = `text-[14px] leading-4  bg-Success-success-base dark:bg-Success-success-base-dark text-Success-success-text dark:text-Success-success-text-dark `
      }
      else if(props.colorbg==="orange"){
        // console.log("orange")
        ClassColor1 = `text-[14px] leading-4 bg-Warning02-warning-02-base-alt dark:bg-Warning02-warning-02-base-alt-dark text-Warning02-warning-02-text-alt`;
        ClassColor2 = `text-[14px] leading-4 bg-Warning02-warning-02-base dark:bg-Warning02-warning-02-base-dark text-Warning02-warning-02-text dark:text-Warning02-warning-02-text-dark `
      }
 
    
    return ( 
        <React.Fragment>   
            <div className={`flex items-center ${props.small ? 'h-6' :'h-8'}  `} >
            <button 
        id="badge-dismiss-default"
        className={`flex gap-2 ${props.small ? 'px-2 py-1 ' : 'p-2'} items-center text-[14px]  font-regular leading-[16px] ${ClassColor1}`}
        style={{
            borderStartStartRadius:"6px" ,
            borderEndStartRadius:"6px" ,...props.style 
        }}  
    >
        {props.icon && (
            <props.icon className={`${props.stroke ? '' : 'stroke-current'}`} />
        )}

        <p className={`my-0 ${props.icon ? 'mx-1 mr-2' : ''} font-geist-sans`}>
            {capitalizeWords(props.name)}
        </p>
    </button>
      <button 
      id="badge-dismiss-default"
      className={`flex gap-2 ${props.small ? 'p-1' : 'p-2'} items-center text-[14px] font-regular leading-[16px] ${ClassColor2}`}
      style={{
        borderStartEndRadius:"6px" ,
        borderEndEndRadius:"6px",...props.style 
      }}  
  >

      <p className={`my-0 ${props.icon ? 'mx-1 mr-2' : ''} font-geist-mono`}>
          {props.value ? props.value : '-'}
      </p>
  </button>  

                </div>       
      
  </React.Fragment>     
           
    )
}