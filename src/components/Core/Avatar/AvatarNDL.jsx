import React from "react";
import TypographyNDL from '../Typography/TypographyNDL';


function AvatarNDL(props) {

    return (
        <React.Fragment>
            {props.src ? 
        <div className={props.profileStyle ? "w-[100px] h-[100px] rounded-full" : "w-[24px] h-[24px]"}>
        <img
          className={props.className}
          style={props.style}
          src={props.src}
          alt={props.alt}
        />
      </div>
              
                :
                <div className={
                    `relative inline-flex items-center justify-center overflow-hidden 
                    bg-Neutral-neutral-base-alt dark:bg-Neutral-neutral-base-alt-dark 
                      ${props.className} ${props.profileStyle ? " w-[64px] h-[64px] rounded-md" : "w-[30px] h-[30px]"}`
                    
                  }>
                   <div>
    <TypographyNDL 
        value={props.initial ? props.initial.toUpperCase() : ''} 
        variant="paragraph-s" 
        style={{ fontSize: props.profileStyle ? '24px' : '16px' }} 
    />
</div>
                 
                   
                </div>
            }

            
        </React.Fragment>
    );

}



export default AvatarNDL;