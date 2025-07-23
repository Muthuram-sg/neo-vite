import React from "react"; 
import ParagraphText from "components/Core/Typography/TypographyNDL";

function ListItemText(props) {    
    return (  
        <React.Fragment>
            <div style={{paddingTop: 5,paddingLeft: 5}}>
            <ParagraphText variant='Body2' value={props.name}/>
            </div> 
           
        </React.Fragment>
        
    )
    
}

export default ListItemText;
