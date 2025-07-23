/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React from "react";
import Typography from "components/Core/Typography/TypographyNDL";

function Cards(props) {
  
    
    return (
        <React.Fragment>
            {props.slots.map((s, index) => {
                      // eslint-disable-next-line array-callback-return
                return (
                    <React.Fragment>
                        <div className={`${index === props.slots.length-1 ? '' : 'border-r border-Border-border-50 dark:border-Border-border-dark-50' } p-2 w-full`} >
                           
                                <Typography variant='lable-01-xs' value={s.name}  color='tertiary' />
                                {/* <Divider style={classes.dividerMargin} variant="divider1"/> */}
                                <Typography  variant='lable-01-lg' mono   value={isNaN(Number(s.value)) ? "-" :Math.round(s.value, 2) + " kWh"} />
                                <div style={{ display: "flex", justifyContent: "space-between" , paddingTop : 3 }}>
                                    <Typography variant='lable-01-xs' mono
                                        value={"Min-" + ((isFinite(Math.min(...s.consumption).toFixed(2)) && !isNaN(Math.min(...s.consumption).toFixed(2))) ? Math.min(...s.consumption).toFixed(2) : "-") + " kWh"} />
                                    <Typography  variant='lable-01-xs' mono
                                        value={"Max-" + ((isFinite(Math.max(...s.consumption).toFixed(2)) && !isNaN(Math.max(...s.consumption).toFixed(2))) ? Math.max(...s.consumption).toFixed(2) : "-") + " kWh"} />

                                </div> 
                        </div >
                        
                    </React.Fragment>

                )

            })
            }
        </React.Fragment>

    )
}

export default Cards;
