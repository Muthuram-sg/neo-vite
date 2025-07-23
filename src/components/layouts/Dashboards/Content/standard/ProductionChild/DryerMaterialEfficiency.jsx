import React, { useEffect,useState } from 'react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import Grid from 'components/Core/GridNDL' 
import Chart from "react-apexcharts"; 
import configParam from 'config';
import TypographyNDL from 'components/Core/Typography/TypographyNDL'; 
import KpiCards from "components/Core/KPICards/KpiCardsNDL"; 
import { useTranslation } from 'react-i18next'; 
function DryerMaterialEfficiency(props){ 
    const [MatEfficiency,setMaterialEfficiency] = useState(0)
    const { t } = useTranslation();
    useEffect(()=>{
      if(props.materialData){
        const matEfficiency = configParam.MAT_EFFICIENCY(props.materialData.feed_data?props.materialData.feed_data:0,props.materialData.dried_data?props.materialData.dried_data:0,props.materialData.scrap_data?props.materialData.scrap_data:0);
        setMaterialEfficiency(Math.round(matEfficiency)); 
      }else{
        setMaterialEfficiency(0)
      }
    },[props.materialData])
    return(
        <KpiCards>
            <div style={{ padding: 10 }}>
                <div className='flex items-center'>
                  {/* <ProdRateIcon stroke={curTheme === "dark"?"#FCFCFC":"#101010"} /> */}
                  <TypographyNDL color='secondary' variant="heading-01-xs" value={t("Material Efficiency")}/>
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
                          series= {[!isNaN(MatEfficiency) && isFinite(MatEfficiency) ?MatEfficiency:0]}
                        type="radialBar"
                    /> 
                  </Grid> 
                  <Grid item xs={12} lg={4} style={{paddingLeft: 20}}>
                    <div style={{paddingTop: 30,display:'grid',rowGap:'5px'}}>
                        <TypographyNDL color='secondary' variant="lable-01-xs" value={t("Sand Feed")}/>
                        <TypographyNDL variant="label-02-xl" mono >
                        {props.materialData && props.materialData.feed_data ? <span>{parseFloat(props.materialData.feed_data).toFixed(2)}<span className="text-[12px] text-Text-text-primary leading-[14px] font-normal"> Tons</span></span> : "--"}
                        </TypographyNDL>
                    </div>
                    <div style={{paddingTop: 30,display:'grid',rowGap:'5px'}}> 
                        <TypographyNDL color='secondary' variant="lable-01-xs" value={t("Sand Dried")}/>
                        <TypographyNDL variant="label-02-xl" mono>
                        {props.materialData && props.materialData.dried_data? <span>{parseFloat(props.materialData.dried_data).toFixed(2)}<span className="text-[12px] text-Text-text-primary leading-[14px] font-normal"> Tons</span></span> : "--"}
                        </TypographyNDL>
                    </div>
                    <div style={{paddingTop: 30,display:'grid',rowGap:'5px'}}> 
                        <TypographyNDL color='secondary' variant="lable-01-xs" value={t("Sand Scrap")}/>
                        <TypographyNDL variant="label-02-xl" mono>
                        {props.materialData && props.materialData.scrap_data? <span>{parseFloat(props.materialData.scrap_data).toFixed(2)}<span className="text-[12px] text-Text-text-primary leading-[14px] font-normal"> Tons</span></span> : "--"}
                        </TypographyNDL>
                    </div> 
                  </Grid>
                </Grid>
            </div>
        </KpiCards>
    )
}
export default DryerMaterialEfficiency;