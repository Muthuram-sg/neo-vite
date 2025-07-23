import React, { useState, useEffect,forwardRef,useImperativeHandle } from 'react';
import useQualitydata from "components/layouts/Reports/QualityReport/hooks/useQualitydata";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import { useRecoilState } from "recoil";
import {  stdDowntimeAsset, stdReportAsset, customdates,reportProgress } from "recoilStore/atoms";
import moment from 'moment'; 
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Grid from 'components/Core/GridNDL'
import Button from 'components/Core/ButtonNDL'; 
import ParetoChart from 'components/Charts_new/QualityReportPareto';
import Chart from 'components/Charts_new/Chart'
import { useTranslation } from 'react-i18next'; 
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";


const ChartData = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const [, setProgress] = useRecoilState(reportProgress); 
    const [downtimeAsset] = useRecoilState(stdDowntimeAsset);
    const [selectedAsset] = useRecoilState(stdReportAsset); 
    const [customdatesval,] = useRecoilState(customdates); 
    const {  outQualityData,  getdowntimedata } = useQualitydata();   
    const [trendsLoading, setTrendsLoading] = useState(false);
    const [paretoY, setParetoY] = useState([]);
    const [paretoX, setParetoX] = useState([]);
    const [isPareto, setIsPareto] = useState(true);
    const [trendsYData, setTrendsYData] = useState([]);
    const [contentSwitchIndex, setContentSwitchIndex] = useState(0);
    const [formatDt,setformatDt] = useState('MMM dd');

     
    useEffect(() => {
        getDefectsList('general')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAsset,customdatesval])

    useImperativeHandle(ref, () =>
    (
      {
        refreshData: (e,type) => {
            getDefectsList('general');
        }
      }
    )
    )
    const getDefectsList = (type) => {
       
        let selectedDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
        let to = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
        console.log(moment(to).diff(moment(selectedDate),'days'),"moment(to).diff(moment(selectedDate),'days')")
        if(moment(to).diff(moment(selectedDate),'days') > 1){
            setformatDt('dd MMM,HH:mm:ss')
        }else{
            setformatDt('dd,HH:mm:ss')
        }
        getdowntimedata(downtimeAsset, selectedDate, to) 
    }
    useEffect(() => {
        if (outQualityData) {         
            setProgress(false); 
            setTrendsLoading(false); 
            convertToDashboardFormat(outQualityData);
            convertToPareto(outQualityData)       
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outQualityData])
    const convertToDashboardFormat = (val) => {
        let trendsx = [];
        // eslint-disable-next-line array-callback-return
        val.map(x => {
            const reason = x && x.prod_reason ? x.prod_reason.reason : "";
            const count = x.quantity;
            const index = trendsx.findIndex(y => y.name === reason);
            let obj = {}
            if (index >= 0) {
                let data = [...trendsx[index].data];
                let timeObj = {
                    x: new Date(x.created_ts).getTime(),
                    y: Number(count)
                };
                data.push(timeObj);
                trendsx[index]['data'] = data;
            } else {
                let data = [];
                let timeObj = {
                    x: new Date(x.created_ts).getTime(),
                    y: Number(count)
                };
                data.push(timeObj);
                obj['name'] = reason;
                obj['data'] = data;
                trendsx.push(obj)
            }
        })
        setTrendsYData(trendsx);      
      
    }
    const convertToPareto = (data) => {
        let overviewx = [];
        let timeY = [];
        // eslint-disable-next-line array-callback-return
        data.map(x => {
            const quantity = Number(x.quantity);
            const reason = x.prod_reason ? x.prod_reason.reason : "";
            const index = overviewx.findIndex(y => y === reason);
            if (index >= 0) {
                let exist = timeY[index];
                let totalVal = exist + quantity;
                timeY[index] = totalVal;
            } else {
                overviewx.push(reason);
                timeY.push(quantity);
            }
        })
        const totalquantity = timeY.reduce((a, b) => a + b, 0)
        const quantityPercent = timeY.map(x => parseFloat((x / totalquantity) * 100).toFixed(2));
        const lineObj = { type: 'line', data: quantityPercent, color: '#66B0FF' };
        const columnObj = { type: 'column', data: timeY, color: '#66B0FF' };
        const overviewY = [lineObj, columnObj]; 
        setParetoX(overviewx);
        setParetoY(overviewY);
    }
    const trendsRefresh = () => {
        setTrendsLoading(true)        
        getDefectsList('trends');
    } 

    const buttonList = [
        {id:"Chart", value:"Trends", disabled:false},
        {id:"Pareto", value:"Pareto", disabled:false},
      ]
    
    const contentSwitcherClick = (e) =>{
        setContentSwitchIndex(e)

          if (e === 0) {
            setIsPareto(true)
          }
          else if (e === 1) {
            setIsPareto(false)
          }

        console.log(e)
    }

    // console.log(trendsYData,"trendsYData")
    return (
        <div>
                        <KpiCards style={{  minHeight: '353px'}}>
                            <div >
                                <Grid container >
                                    <Grid item xs={7} sm={7} style={{ alignItems: 'center',display: 'flex' }}>
                                        <ParagraphText  value={t(" Daily Defects Trends")}  variant="heading-01-xs" color='secondary' />
                                    </Grid>
                                    <Grid item xs={4} sm={4} style={{ alignItems: 'center',display: 'flex',justifyContent:'end' }}>
                              <div style={{ display: "flex", marginLeft: "auto" }}>
                                <ContentSwitcherNDL listArray={buttonList} contentSwitcherClick={contentSwitcherClick} switchIndex={contentSwitchIndex} ></ContentSwitcherNDL>
                            </div>
                                    </Grid>
                                    <Grid item xs={1} sm={1} style={{ alignItems: 'center',display: 'flex',justifyContent:'end' }}>
                                        {trendsLoading ? <CircularProgress style={{ float: 'right' }} disableShrink size={15} color="primary" /> : (
                                            <Button type="ghost" style={{ float: 'right' }} icon={RefreshLight} size="small" onClick={() => trendsRefresh()}>
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sm={12} style={{ textAlign: 'center' }}>
                                        {trendsYData.length > 0 && (
                                            <div style={!isPareto ? { display: "none" } : { display: "block" }}>
                                                <Chart
                                                    height={250}
                                                    id={"trendChart"}
                                                    type={"bar"}
                                                    data={trendsYData}
                                                    xaxistype={"datetime"}
                                                    xaxisval={trendsYData}
                                                    categories={trendsYData}
                                                    format={formatDt}
                                                    xTooltip={'MMM ddd'}
                                                    default
                                                    annotationdisable={true}
                                                />
                                                
                                                </div>
                                        ) }
                                        {trendsYData.length <= 0 &&
                                          <React.Fragment>
                                          <br></br>
                                          <br></br>
                                          <br></br>
                                          <br></br>
                                        <ParagraphText variant="paragraph-s" value={t("No Data")}/>
                                        </React.Fragment>
                                        }
                                        {paretoY.length > 0 &&
                                            <div style={ { display: isPareto ? "none" : "block"}}>
                                                <ParetoChart paretoX={paretoX} paretoY={paretoY} />
                                            </div>
                                        }    
                                        {paretoY.length === 0 &&
                                        <React.Fragment>
                                            <br></br>
                                            <br></br>
                                            <br></br>
                                            <br></br>
                                            <ParagraphText variant="paragraph-s" value={t("No Data")}/>
                                        </React.Fragment>
                                        }
                                    </Grid>
                                </Grid>
                            </div>
                        </KpiCards>
                     </div>

    )
})
export default ChartData;