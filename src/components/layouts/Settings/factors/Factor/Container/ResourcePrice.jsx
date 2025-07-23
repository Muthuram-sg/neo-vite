import React from 'react';
import InputFieldNDL from 'components/Core/InputFieldNDL';
const  ResourcePrice = (props) =>{
 
    return(
      
        <React.Fragment>
        
        <InputFieldNDL 
           id={"formula-name"+props.resource} 
           label={props.resource} 
           onChange={props.onChange}
            value={props.resourceUnitPrice} 
            type="number" 
            inputProps={props.inputProps}
            />
          
    </React.Fragment>
    
    )
}
const isRender = (prev,next)=>{ 
    return  true;
} 
export default React.memo(ResourcePrice,isRender);
