import React from 'react';
import Typography from "components/Core/Typography/TypographyNDL";
function StatusTitleFunction(props){      
   
    return(  
        <div style={{marginTop:10}} >
            <Typography variant="label-01-xs" color='secondary' value={props.title} />  
        </div>
    )
} 
const reRender = () => true;
const StatusTitle = React.memo(StatusTitleFunction,reRender);
export default StatusTitle;