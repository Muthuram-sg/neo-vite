import React from "react";   


export default function TabListItemNDL(props){

    return(
        <React.Fragment>
            
<ul class=" flex w-full ">
   
      {props.children}
   
    
</ul>

        </React.Fragment>
    )
}