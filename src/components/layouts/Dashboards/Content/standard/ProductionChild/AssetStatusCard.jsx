import React,{useEffect} from 'react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL"; 
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"; 
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Chart from "react-apexcharts";
import KpiCards from "components/Core/KPICards/KpiCardsNDL" 
import TypographyNDL from "components/Core/Typography/TypographyNDL";
  
let lastZoom1 = null; 
function AssetStatusCard(props) {
    const [curTheme] = useRecoilState(themeMode); 
    const { t } = useTranslation();  
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    useEffect(()=>{
        lastZoom1 = null; 
    },[props.start])
   
    let StatusData =[]
    if(props.assetStatusData.data && props.assetStatusData.data.length > 0){
        StatusData = props.assetStatusData.data.map(v=> 
            {return {...v,data : v.data.map(e=> {return {...e,y : e.y.map(x=> {return new Date(moment(x).subtract(moment(x).isDST() ? 1 : 0,'hour')).getTime()})}})}})
            
       
    }

    // console.log(props.assetStatusData,StatusData,"StatusData")
    
    return (
        <React.Fragment>
            {props.assetStatusData && props.assetStatusData.data && props.assetStatusData.data.length > 0 ?
                <KpiCards  >
                        <div className="flex items-center h-[40px]">
                        <TypographyNDL color='secondary' variant="heading-01-xs"  value= {t("AssetStatus")} />
                        {props.loading && <div style={{marginLeft: 10}}><CircularProgress disableShrink size={15} color="primary" /></div>}
                        </div>
                        {
                            <Chart
                                height={85}
                                width={'100%'}
                                options={{
                                    theme: {
                                        mode: curTheme
                                    },
                                    chart: {
                                        id: "asset_status_data",
                                        background: '0',
                                        type: 'rangeBar',
                                        sparkline: {
                                            enabled: false,
                                        },
                                        toolbar: {
                                            show: true
                                        },
                                        events: {
                                            zoomed: (_, value) => {
                                                lastZoom1 = [value.xaxis.min, value.xaxis.max];
                                            },
                                            beforeZoom: function(chartContext, opts) {
                                                
                                                return {
                                                  xaxis: {
                                                    min: opts.xaxis.min,
                                                    max: opts.xaxis.max
                                                  }
                                                } 
                                            },
                                            beforeResetZoom: function(chartContext, opts) {
                                                lastZoom1=null;
                                                return {
                                                  xaxis: {
                                                    min: new Date(props.start).getTime(),
                                                    max: new Date(props.end).getTime()
                                                  }
                                                } 
                                            } 
                                        }
                                    },
                                    grid: {
                                        padding: {
                                            right: 0,
                                            left: 0
                                        }
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: true,
                                            barHeight: '100%',
                                            rangeBarGroupRows: true
                                        }
                                    },
                                    colors: ['#30a46e', '#0074CB', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF'],
                                    fill: {
                                        type: ['solid', 'pattern', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid'],
                                        pattern: {
                                            style: 'slantedLines',
                                            width:4,
                                            height: 18,
                                            strokeWidth: 2,
                                            
                                        },
                                    },
                                    
                                    xaxis: {
                                        type: 'datetime',
                                        labels: {
                                            rotate: 0,
                                            datetimeUTC: false,
                                            format: "HH:mm",
                                            style: {
                                                colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                                            },
                                        },
                                        min: lastZoom1 ? lastZoom1[0] : new Date(props.start).getTime(),
                                        max: lastZoom1 ? lastZoom1[1] : new Date(props.end).getTime()
                                        
                                    },
                                    legend: {
                                        show: false
                                    },
                                    tooltip: {
                                        custom: function(options) {
                                            let array = props.downtimeReason.filter(x => moment(x.end_dt).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss") === moment(options.w.config.series[options.seriesIndex].data[options.dataPointIndex].y[1]).format("YYYY-MM-DDTHH:mm:ss"))
                                            if (props.downtimeReason && props.downtimeReason.length > 0) {
                                                if (array.length > 0) {
                                                    const tooltipContent = `
                                                        <div class="arrow_box" style="background-color: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                                                            <span style="font-weight: bold;">Reason: </span>
                                                            <span>${array[0].prod_reason.reason}</span>
                                                        </div>
                                                    `;
                                                    return tooltipContent;
                                                } else {
                                                    const tooltipContent = `
                                                        <div class="arrow_box" style="background-color: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                                                            <span style="font-weight: bold;">Reason: </span>
                                                            <span>-</span>
                                                        </div>
                                                    `;
                                                    return tooltipContent;
                                                }
                                        }
                                        else {
                                            const tooltipContent = `
                                                <div class="arrow_box" style="background-color: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                                                    <span style="font-weight: bold;">Reason: </span>
                                                    <span>-</span>
                                                </div>
                                            `;
                                            return tooltipContent;
                                        }
                                      }
                                    },
                                }}
                                series={StatusData}
                                type="rangeBar"
                            />
                        }
                  
                </KpiCards>
                :
                <KpiCards style={{ height: "100%"}}>
                    <div style={{ padding: 10, textAlign: "center" }}>
                        <TypographyNDL variant="paragraph-s" value={t("noAssetStat")} />
                    </div>
                </KpiCards>
            }
        </React.Fragment>
    )
}

export default AssetStatusCard;