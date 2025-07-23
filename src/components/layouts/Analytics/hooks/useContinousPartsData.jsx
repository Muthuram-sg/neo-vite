import { useState } from "react";
import moment from 'moment';
import { useAuth } from "components/Context";
import { useTranslation } from 'react-i18next';
import configParam from "config";

const useContinousPartsData = () => {
    const [ContinousPartsDataLoading, setLoading] = useState(false);
    const [ContinousPartsData, setData] = useState(null);
    const [ContinousPartsDataError, setError] = useState(null);
    const { t } = useTranslation();
    const { HF } = useAuth();

    const getContinousPartsData = async (datas,IntrmType,RejTemp,headPlant,timeLimit,CycleTime,AnalyticConfigList) => {
      
        setLoading(true);
        let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
        let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
        let stdOffset = Math.min(janOffset, julOffset); //Then we can make a Moment object with the current time at that fixed offset
        const body = {
            schema: headPlant.schema,
            instrument_id: datas.val.toString(),
            metric_name: datas.metName,
            MSMetric: "execution",
            MSintru: datas.MSintru.toString(),
            start_date: datas.start,
            end_date: datas.end,
            asset_ids: datas.assets,
            pagesize: datas.rowsPerPage,
            pageindex: datas.page,
            binary: datas.binaryval,
            downfall: datas.downfallval
        }
        await configParam.RUN_REST_API("/dashboards/actualPartSignalSA", body)
            .then((res) => {
                let avgCycleTime = CycleTime
                if (res.data && res.data.length > 0) {
                     
                    let Execdat = [] 
                    let cyTime = CycleTime 
                    
                    if(res.MSdata.length > 0){
                        
                        // eslint-disable-next-line array-callback-return
                        res.data.map((val1,i)=>{
                                 
                                if ((res.data.length > 0)) {
                                    let startDate
                                    if (((res.data.length - 1) === i)) {
                                        startDate = moment(val1.time).subtract(cyTime,'seconds')
                                    } else{ 
                                            cyTime = moment.utc(moment(val1.time).diff(moment(res.data[i+1].time))).format("ss")
                                            startDate = moment(val1.time)  
                                    }
                                    let endDate
                                    if(i===0){
                                        if(res.data.length === 1){
                                            startDate = moment(datas.start) 
                                            cyTime = moment.utc(moment(val1.time).diff(moment(datas.end))).format("ss")    
                                        }else{
                                            cyTime = moment.utc(moment(val1.time).diff(moment(res.data[i+1].time))).format("ss")
                                        }
                                        endDate = moment(datas.end)
                                    }else{
                                        endDate = moment(res.data[i-1].time);
                                    }
                                    
                                    // eslint-disable-next-line array-callback-return
                                    let DataEx = res.MSdata.filter(e=> (moment(e.time).isBetween(moment(startDate), moment(endDate)) || moment(e.time).isSame(startDate) || moment(e.time).isSame(endDate)) && (e.value !== "INTERRUPTED") ).map(ev => {return {...ev,startDate: startDate.format("YYYY-MM-DDTHH:mm:ss"), endDate: endDate.format("YYYY-MM-DDTHH:mm:ss") }})
                                    if(DataEx.length > 2){
                                        Execdat.push(DataEx.slice(1,3))
                                    }else{
                                        Execdat.push(DataEx)
                                    }
                                    if((res.data.length-1) === i){
                                        startDate = moment(datas.start)
                                        endDate = moment(val1.time)
                                        DataEx = res.MSdata.filter(e=> (moment(e.time).isBetween(moment(startDate), moment(endDate)) || moment(e.time).isSame(startDate) || moment(e.time).isSame(endDate)) && (e.value !== "INTERRUPTED") ).map(ev => {return {...ev,startDate: startDate.format("YYYY-MM-DDTHH:mm:ss"), endDate: endDate.format("YYYY-MM-DDTHH:mm:ss") }})
                                        Execdat.push(DataEx)
                                    }
                                    
                                }
                        }) 
                    }  
                  
                    
                   
                        Promise.all(
                            res.data.map(async (val1, i) => {
                                let datasig = []
                                let ctload = []
                                let superimp = []
                                
                                if (res.data.length > 0 ) {
                                    let startDate
                                  
                                    if (res.data.length > 0 && (res.data.length - 1) === i) {
                                        startDate = moment(datas.start);
                                    } else if (i === 0) {
                                        startDate = moment(res.data[i + 1].time);
                                    } else {
                                        startDate = moment(res.data[i + 1].time);
                                    }
                                    
                                    let endDate 
                                    if(res.data.length === 1){
                                        endDate =moment(datas.end);
                                    }else{
                                        if(i === 0){
                                            endDate = moment(datas.end)
                                        }else{
                                            endDate =moment(val1.time);
                                        } 
                                    }
                                    
                                    
                                    const body2 = {
                                        schema: headPlant.schema,
                                        instrument_id: datas.val.toString(),
                                        key: JSON.stringify(datas.key.map(e=> {return {"value": e.title,"on_change":e.on_change}})),
                                        start_date: startDate.utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"),
                                        end_date: endDate.utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"), 
                                    }
                                    await configParam.RUN_REST_API("/dashboards/actualCurrentLoad", body2)
                                        .then(ctres => {
                                            let comments = res.comment.filter(x => x.part_completed_time === val1.time)
                                            let avgTime = []
                                                let peak = []
                                                let avg = []
                                                 let pkTime =[]   
                                            if (ctres.data.length > 0) {
                                                let StimeExe
                                                let EtimeExe 
                                                if(Execdat.length >0){
                                                    let IsDST = moment(Execdat[i][0].time).isDST() ? 1 : 0
                                                    if (((res.data.length - 1) === i)) {
                                                        StimeExe = (Execdat[i].length>0) && Execdat[i+1].length === 1 ? 'No signal' : moment(Execdat[i+1][1].time).subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS)
                                                        if(res.data.length === 1){
                                                            StimeExe = (Execdat[i].length>0) && Execdat[i].length === 1 ? 'No signal' : moment(Execdat[i][1].time).subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS)
                                                            if (Execdat[i].length > 0) {
                                                                let timeToSubtract;
                                                                
                                                                if (Execdat[i].length === 2) {
                                                                    timeToSubtract = Execdat[i][0].time;
                                                                } else if (Execdat[i][0].value === "STOPPED") {
                                                                    timeToSubtract = Execdat[i][0].time;
                                                                } else {
                                                                    timeToSubtract = endDate;
                                                                }
                                                            
                                                                let subtractedTime = moment(timeToSubtract).subtract(IsDST, 'hour');
                                                                EtimeExe = subtractedTime.format("YYYY-MM-DD " + HF.HMSS);
                                                            }
                                                           
                                                        }else{
                                                            EtimeExe = (Execdat[i].length>0) && moment(Execdat[i][1] ? Execdat[i][1].time : Execdat[i][0].time).subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS)
                                                        }
                                                       
                                                    }else{
                                                                                                                                                                             
                                                        if(Execdat[i].length>0){
                                                            StimeExe= moment(Execdat[i+1][0].time).subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS) 
                                                        }else{
                                                            StimeExe= moment(Execdat[i+1][0].time).subtract(moment(Execdat[i+1][0].time).isDST() ? 1 : 0,'hour').format("YYYY-MM-DD "+HF.HMSS) 
                                                        }
                                                         
                                                        if((res.data.length - 1) === i){
                                                            EtimeExe = endDate.format("YYYY-MM-DD "+HF.HMSS)
                                                        }else{
                                                            if((i > 0) && Execdat[i].length>0){
                                                                let timeToSubtract;
                                                                if (Execdat[i][1]) {
                                                                    timeToSubtract = Execdat[i][1].time ? Execdat[i][1].time : Execdat[i][0].time;
                                                                } else {
                                                                    timeToSubtract = Execdat[i][0].value === "ACTIVE" ? endDate : Execdat[i][0].time;
                                                                }
                                                                
                                                                let subtractedTime = moment(timeToSubtract).subtract(IsDST, 'hour');
                                                                EtimeExe = subtractedTime.format("YYYY-MM-DD " + HF.HMSS);
                                                            }else{
                                                                if(Execdat[i].length>0){
                                                                    if(Execdat[i].length === 1){
                                                                        EtimeExe = moment(Execdat[i][0].time).subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS)
                                                                    }else{
                                                                        EtimeExe = moment(Execdat[i][1].time).subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS)
                                                                    }
                                                                    
                                                                }else{
                                                                    EtimeExe = moment(datas.end).add(cyTime,'seconds').subtract(IsDST,'hour').format("YYYY-MM-DD "+HF.HMSS)
                                                                }
                                                                
                                                            }
                                                            
                                                        }
                                                        
                                                    }
                                                    
                                                }  
                                                let  Exstart = Execdat.length >0 ? StimeExe : startDate.format("YYYY-MM-DD "+HF.HMSS)
                                                let Exend = Execdat.length >0 ? EtimeExe : endDate.format("YYYY-MM-DD "+HF.HMSS)

                                                const filteredConfig = AnalyticConfigList[0].config.Config.filter(obj => obj.stat === true);
                                                const metricIds = filteredConfig.map(obj => obj.metric_id);
                                                const filteredMetrics = AnalyticConfigList[0].config.Metrics.filter(obj => metricIds.includes(obj.id));
                                                  
                                               
                                                   let filteredMetric=filteredMetrics.filter(obj => datas.key.some(metObj => metObj.title === obj.key))
                                                   
                                                    filteredMetric.length > 0 && filteredMetric.map(v=>{
                                                        let dataArr = ctres.data.filter(e => e.key === v.key)
                                                       
                                                        let totct = dataArr.reduce((total, thing) => total + Number(thing.value), 0)
                                                        
                                                     
                                                        
                                                        let peak1 = []
                                                       
                                                      
                                                        if(dataArr.length>0 && totct){
                                                          
                                                            avg.push(totct / dataArr.length )
                                                            // eslint-disable-next-line array-callback-return
                                                            dataArr.map(val2 => {
                                                                peak1.push(val2.value)
                                                            })
                                                            peak.push(Math.max(...peak1))
                                                           
                                                        }
                                                    
                                                       else{
                                                        avg.push("-")
                                                        peak.push("-")
                                                       }
    
                                                     })
                                                 
                                                 
                                                 
                                              
                                                     let partComt = comments.length > 0 && comments[0].comments ? comments[0].comments : t('noComments')
                                                    //  comments.length > 0 ? comments[0].param_comments : t('noComments')
                                                if(Execdat.length === 0){
                                                    let NumPart = res.data[i].value
                                                    datasig.push({
                                                        startTime: startDate.format("YYYY-MM-DD "+HF.HMSS),
                                                        endTime: endDate.format("YYYY-MM-DD "+HF.HMSS),
                                                        cycletime: moment.utc(endDate.diff(startDate)).format("mm:ss:SSS"),
                                                        Partnum: (IntrmType === 9) ? (val1.key + NumPart) : (val1.key + Number(datas.page * (datas.rowsPerPage - 1) + (i))),
                                                        average: avg.map((avg1) => Number(avg1)?avg1.toFixed(2):avg1),
                                                        curpeak: peak?peak:"-",
                                                        prod_part_comment: partComt,
                                                        averageTime: avgTime,
                                                        peakTime: pkTime,
                                                        ct_load: ctres.data,
                                                    })
                                                    
                                                }else{
                                                    
                                                  

                                                        let NumPart = res.data[i].value
                                                        datasig.push({
                                                            
                                                            startTime: Exstart,
                                                            endTime: Exend,
                                                            cycletime: Exstart === 'No signal' ? 'NA' : moment.utc(moment(Exend).diff(moment(Exstart))).format("mm:ss:SSS"),
                                                            Partnum: (IntrmType ===9) ? (val1.key + NumPart) : (val1.key + Number(datas.page * (datas.rowsPerPage - 1) + (i+1))),
                                                           
                                                            average: avg.map((avg1) => Number(avg1)?avg1.toFixed(2):avg1),
                                                            curpeak: peak?peak:"-",
                                                            prod_part_comment: partComt,
                                                            averageTime: avgTime,
                                                            peakTime: pkTime,
                                                            ct_load: ctres.data,
                                                        })
                                                        
                                                      
                                                      
                                                    
                                                } 
                                               
                                               
                                                
                                               
                                                // eslint-disable-next-line array-callback-return
                                                ctres.data.map(val3 => {
                                                    ctload.push({
                                                       
                                                        name: val3.key,
                                                        x: val3.time,
                                                        y: val3.value, 
                                                    })
                                                })

                                                let dataimp = []
                                                // eslint-disable-next-line array-callback-return
                                                ctres.data.map((val4, idx) => {
                                                    dataimp.push({
                                                        x: idx,
                                                        y: val4.value
                                                    })


                                                })
                                                superimp.push({
                                                    name: val1.key + (i + 1),
                                                    data: dataimp

                                                })
                                            } else {
                                                datasig.push({
                                                    startTime: startDate.format("YYYY-MM-DD "+HF.HMSS),
                                                    endTime: endDate.format("YYYY-MM-DD "+HF.HMSS),
                                                    cycletime: moment.utc(endDate.diff(startDate)).format("mm:ss:SSS"),
                                                    Partnum: val1.key + (i + 1),
                                                    average:[0],
                                                    curpeak:[0],
                                                    prod_part_comment: comments.length && comments[0].comments ? comments[0].comments : '',
                                                    averageTime: "",
                                                    peakTime: "",
                                                    ct_load: []
                                                })
                                            }
                                           
                                        })
                                        .catch(error => console.log('Performance Trends error', error));
                                }
                                return {
                                    table: datasig,
                                    Line: ctload,
                                    impose: superimp
                                }
                            })

                                               

                    )
                        .then((Finaldata) => {
                            setData({ data: Finaldata, RejTemp: RejTemp, temp: res, key: datas.key, IntrmType: IntrmType, cyTime: cyTime, value: datas.val })
                            setError(false)
                            setLoading(false)
                        })

                }
                else {
                    setData({ data: [], key: datas.key.map(e => e.title), cyTime: avgCycleTime })
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { ContinousPartsDataLoading, ContinousPartsData, ContinousPartsDataError, getContinousPartsData };
};

export default useContinousPartsData;