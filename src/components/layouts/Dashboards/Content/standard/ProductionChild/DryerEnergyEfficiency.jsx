import React from 'react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import Grid from 'components/Core/GridNDL' 
import Chart from "react-apexcharts"; 
import TypographyNDL from 'components/Core/Typography/TypographyNDL'; 
import KpiCards from "components/Core/KPICards/KpiCardsNDL";  
import { t } from 'i18next';
function DryerEnergyEfficiency(props){ 
    return(
        <KpiCards>
            <div style={{ padding: 10 }}>
                <div className='flex items-center'> 
                    <TypographyNDL color='secondary' variant="heading-01-xs" value={t("Energy Efficiency")}/>
                    {props.loading && <div style={{marginLeft: 10}}><CircularProgress disableShrink size={15} color="primary" /></div>}
                </div> 
                <Grid container spacing={0} style={{paddingTop: 35}}>
                    <Grid item xs={12} lg={8}> 
                        <Chart
                            height={280}
                            options={ {
                                chart: {
                                height: 280,
                                type: "radialBar"
                                }, 
                                plotOptions: {
                                radialBar: {
                                    hollow: {
                                    margin: 15,
                                    size: "70%"
                                    },
                                
                                    dataLabels: {
                                    showOn: "always",
                                    name: {
                                        offsetY: -10,
                                        show: true,
                                        color: "#888",
                                        fontSize: "13px"
                                    },
                                    value: {
                                        color: "#111",
                                        fontSize: "30px",
                                        show: true
                                    }
                                    }
                                }
                                },
                            
                                stroke: {
                                lineCap: "round",
                                },
                                labels: ["Progress"]
                            }} 
                            series= {[props.energy && (!isNaN(props.energy.energy_efficiency) || isFinite(props.energy.energy_efficiency))?props.energy.energy_efficiency:0]}
                            type="radialBar"
                        /> 
                    </Grid>
                    <Grid item xs={12} lg={4} style={{paddingLeft: 20}}> 
                        <div style={{paddingTop: 30,display:'grid',rowGap:'5px'}}>
                            <TypographyNDL color='secondary' variant="lable-01-xs" value={t("Total Energy")}/>
                            <TypographyNDL variant="label-02-xl" mono >
                            {props.energy && props.energy.totalEnergy?parseFloat(props.energy.totalEnergy).toFixed(2):0} <span className="text-[12px] text-Text-text-primary leading-[14px] font-normal">Kwh</span>
                            </TypographyNDL>
                        </div>
                        <div style={{paddingTop: 30,display:'grid',rowGap:'5px'}}>
                            <TypographyNDL color='secondary' variant="lable-01-xs" value={t("Gas Energy")}/>
                            <TypographyNDL variant="label-02-xl" mono >
                            {props.energy && props.energy.gasEnergy?parseFloat(props.energy.gasEnergy).toFixed(2):0} <span className="text-[12px] text-Text-text-primary leading-[14px] font-normal">Kwh</span>
                            </TypographyNDL>

                        </div>
                        <div style={{paddingTop: 30,display:'grid',rowGap:'5px'}}> 
                            <TypographyNDL color='secondary' variant="lable-01-xs" value={t("Electrical Energy")}/>
                            <TypographyNDL variant="label-02-xl" mono>
                            {props.energy && props.energy.electricalEnergy?parseFloat(props.energy.electricalEnergy).toFixed(2):0} <span className="text-[12px] text-Text-text-primary leading-[14px] font-normal">Kwh</span>
                            </TypographyNDL>
                        </div> 
                    </Grid>
                </Grid>
            </div>
        </KpiCards>
    )
}
export default DryerEnergyEfficiency;