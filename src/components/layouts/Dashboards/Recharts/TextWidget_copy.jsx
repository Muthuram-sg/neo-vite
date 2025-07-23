import Typography from 'components/Core/Typography/TypographyNDL';
import React from 'react';
function TextWidget_copy(props){
    return(
        <Typography variant={props.meta && props.meta.variant?props.meta.variant:'Body2'} value={props.meta && props.meta.text?props.meta.text:"No Text"}/>
    )
}
export default TextWidget_copy;