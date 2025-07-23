import TypographyNDL from "components/Core/Typography/TypographyNDL";
import React from "react";
import Grid from "components/Core/GridNDL";
import '../index.css';

const EnergyMeter = (props) => {
    console.log("ENERGY __ PROPS - ", props)
    const getvalue = (val) => {
        
        return props.data
            .filter(x => x.key === val)
            ?.sort((a, b) => new Date(b.time) - new Date(a.time))
            ?.[0]?.value || '-'
    }

    return (
        <div style={{ borderWidth: '10px', borderBottomWidth: '20px', borderColor: '#B4BBC8', height: '97%', borderRadius: 5 }}>
            <div style={{ borderRadius: 5, borderWidth: '10px', borderColor: '#3A414E', height: '100%', }}>
        <Grid container spacing={2} style={{ flexDirection: 'column', backgroundColor: 'black', height: '100%', paddingTop: '10px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {
                props?.meta?.metric.map((x) => {
                    return (
                    <Grid key={x} item xs={12} style={{ paddingBottom: props?.width <= 235 ? '10%' : '1%' }}>
                        <div style={{display: "flex", flexWrap:'wrap'}}>
      
                            <div style={{ justifySelf: 'flex-end', width: '40%'}}>
                
                                <Grid container spacing={1} style={{ flexDirection: 'column' }}>
                                    <Grid item xs={12}>
                                        <TypographyNDL style={{ fontSize: 'smaller', textAlign: 'end', color: 'white' }} >{x.split('-')[1]}</TypographyNDL>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TypographyNDL style={{ fontWeight: 600, fontSize: 'larger', color: 'white', textAlign: 'end' }}>{x.split('-')[x.split('-')?.length-1]}</TypographyNDL>
                                    </Grid>
                                </Grid>
                   
                            </div>
                            <div>
         
                                <p style={{ fontFamily: 'Digital Numbers', fontSize: '200%', color: '#DA1E28'}}>{ } &nbsp; { (!isNaN(props?.meta.decimalPoint) && getvalue(x.split('-')[0])!== '-') ? Number(getvalue(x.split('-')[0])).toFixed(Number(props?.meta.decimalPoint)) : getvalue(x.split('-')[0])}</p>
                  
                            </div>
              
                        </div>
                    </Grid>
                    )
                })
            }
        </Grid>
            </div>
        </div>
    )
}

export default EnergyMeter;