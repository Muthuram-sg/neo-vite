import React from 'react';
import Typography from "components/Core/Typography/TypographyNDL";


function TimeLoss(props){  
      
    const downtimeCalc = (lossTime) => Math.abs(parseInt(lossTime / 60));
    const status = props.value >= 0 ? "loss" : 'gain'
    return( 
        <div style={{marginTop: 4}}>
        <Typography variant="lable-01-m" color ="secondary" value={(props.value ? downtimeCalc(props.value) : 0) + (" mins " + status) } />
        </div>
    )
}

export default TimeLoss;