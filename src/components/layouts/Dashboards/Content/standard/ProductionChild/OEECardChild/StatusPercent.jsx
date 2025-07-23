import React from 'react'; 
import Typography from "components/Core/Typography/TypographyNDL";

 

function StatusPercentFunction(props){ 
    let value = Number(props.value) >= 0 ? props.value : 0
    let returValue = isFinite(parseInt(value * 100)) ? parseInt(value * 100) + '%' : '0%'
    return(  
        <Typography variant="label-02-xl" mono style={{ color: props.color }}
        value={props.value ? returValue : '0%' }
        />  
    )
}
function reRender(prevprops, nextprops) { 
    return false; // do not rerender when sidenav is expanding
  }
const StatusPercent = React.memo(StatusPercentFunction,reRender);
export default StatusPercent;