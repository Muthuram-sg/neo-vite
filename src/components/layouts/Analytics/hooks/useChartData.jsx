import { useState } from "react";
import moment from 'moment';
import { useAuth } from "components/Context";
import { useTranslation } from 'react-i18next';
import configParam from "config";

const useChartData = () => {
    const [ChartDataLoading, setLoading] = useState(false);
    const [ChartData, setData] = useState(null);
    const [ChartDataError, setError] = useState(null);
    const { HF } = useAuth();
    const { t } = useTranslation();

    const getChartData = async (datas, headPlant, rowsPerPage, startDate, endDate,AnalyticConfigData,MetricArray) => {
        setLoading(true);
        let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
        let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
        let stdOffset = Math.min(janOffset, julOffset); //Then we can make a Moment object with the current time at that fixed offset
        let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight
        
        const offset =  (datas.page) * 5
        let pageLen =Number(5) * (Number(datas.page) + 1)
        
        let chartdata = datas.data.data
        if (datas.data.data.length > 5) {
            chartdata = datas.data.data.slice(offset, pageLen)
        }
        let Execdat = []
        if (datas.data.MSdata.length > 0) {

            // eslint-disable-next-line array-callback-return
            datas.data.data.slice(offset, pageLen).map((val1, i) => {
                if (datas.data.data.slice(offset, pageLen).length > 0) {
                    let start
                    let end
                    if (datas.page) {
                        start = moment(val1.time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour');
                        if (i === 0) {
                            end = moment(datas.data.data[offset - 1].time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        } else {
                            end = moment(datas.data.data.slice(offset, pageLen)[i - 1].time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        }

                    } else {
                        start = moment(val1.time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        if (i === 0) {
                            end = moment(endDate).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        } else {
                            end = moment(datas.data.data.slice(offset, pageLen)[i - 1].time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        }
                    }

                  
                    // eslint-disable-next-line array-callback-return
                    Execdat.push(datas.data.MSdata.filter(e => (moment(e.time).subtract(moment(e.time).isDST() ? 1 : 0, 'hour').isBetween(moment(start), moment(end)) || moment(e.time).subtract(moment(e.time).isDST() ? 1 : 0, 'hour').isSame(start) || moment(e.time).subtract(moment(e.time).isDST() ? 1 : 0, 'hour').isSame(end)) && (e.value !== "INTERRUPTED")))
                }
            })
        }
       

        Execdat.reverse()
        Promise.all(
                  // eslint-disable-next-line array-callback-return

            chartdata.map(async (val1, i) => {
                let datasig = []
                let ctload = []
                let superimp = []

              
                if (i >= 0) {
                   
                    let start
                    let end
                    if (datas.page) {
                        end = moment(val1.time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour');
                        if ((chartdata.length - 1) === i) {
                            end = moment(val1.time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                            if (pageLen >= datas.data.data.length) {
                                start = moment(startDate)
                            } else {
                                if (datas.data.data[pageLen]) {
                                    start = moment(datas.data.data[pageLen].time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                                }
                            }
                        } else {
                            start = moment(chartdata[i + 1].time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        }

                    } else {
                        if ((chartdata.length - 1) !== i) {
                            start = moment(chartdata[i + 1].time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        } 

                        if (i === 0) {
                            end = moment(endDate).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        } else {
                            end = moment(val1.time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                        }
                        if ((chartdata.length - 1) === i) {
                            if (chartdata.length === datas.data.data.length) {
                                end = moment(endDate).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                            } else {
                                end = moment(val1.time).subtract(moment(val1.time).isDST() ? 1 : 0, 'hour')
                            }

                            if (pageLen >= datas.data.data.length) {
                                start = moment(startDate)
                            } else {
                                start = moment(datas.data.data[pageLen].time)
                            }

                        }

                    }



                    const body2 = {
                        schema: headPlant.schema,
                        instrument_id: datas.val.toString(),
                        key: JSON.stringify(datas.key.map(e => { return { "value": e.title, "on_change": e.on_change } })),
                        start_date: start.format("YYYY-MM-DDTHH:mm:ss" + TZone),
                        end_date: end.format("YYYY-MM-DDTHH:mm:ss" + TZone),
                        on_change: datas.key.map(k => k.on_change)
                    }
                 
                   
                    await configParam.RUN_REST_API("/dashboards/actualCurrentLoad", body2)
                          // eslint-disable-next-line array-callback-return

                        .then(res => {
                            let comments = datas.data.comment.filter(x => x.part_completed_time === val1.time)
                            if (res.data.length > 0) {
                                
                                let EtimeExe;

                                        if (Execdat.length > 0 && Execdat[i + 1]) {
                                            let timeToSubtract;
                                            if (Execdat[i + 1][1]) {
                                                timeToSubtract = Execdat[i + 1][1].time;
                                            } else if (Execdat[i][1] && Execdat[i][1].time) {
                                                timeToSubtract = Execdat[i][1].time;
                                            } else {
                                                timeToSubtract = Execdat[i][0].time;
                                            }

                                            let subtractedTime = moment(timeToSubtract).subtract(moment(Execdat[i][0].time).isDST() ? 1 : 0, 'hour');
                                            EtimeExe = subtractedTime.format("YYYY-MM-DD " + HF.HMS);
                                        } else {
                                            EtimeExe = end.format("YYYY-MM-DDTHH:mm:ss");
                                        }

                               
                                
                                        let Exstart;

                                        if (Execdat.length > 0 && Execdat[i]) {
                                            let subtractedTime = moment(Execdat[i][0].time).subtract(moment(Execdat[i][0].time).isDST() ? 1 : 0, 'hour');
                                            Exstart = subtractedTime.format("YYYY-MM-DD " + HF.HMS);
                                        } else {
                                            Exstart = start.format("YYYY-MM-DD " + HF.HMS);
                                        }
                                        
                                let Exend = Execdat.length > 0 ? EtimeExe : end.format("YYYY-MM-DD " + HF.HMS)
                                const filteredConfig = AnalyticConfigData[0].config.Config.filter(obj => obj.stat === true);
                                const metricIds = filteredConfig.map(obj => obj.metric_id);
                                const filteredMetrics = AnalyticConfigData[0].config.Metrics.filter(obj => metricIds.includes(obj.id));
                                 
                                let avg = []
                                let avgTime = []
                                let peak = []
                                let pkTime = [] 
                                filteredMetrics.map(v => 
                                    {
                                        let dataArr = res.data.filter(e => e.key === v.key)
                                        let totct = dataArr.reduce((total, thing) => total + Number(thing.value), 0)
                                        
                              
                                if (dataArr.length > 0) {
                                    
                                    avg.push(totct / dataArr.length)
                                    
                                    let middleIndex = Math.round((dataArr.length / 2) - 1);
                                    if (middleIndex >= 0 && middleIndex < dataArr.length) {
                                        avgTime.push(dataArr[middleIndex].time);
                                    }
                                    let peak2 = dataArr.map(valt => valt.value);
                                    if (peak2.length > 0) {
                                        let maxPeak = Math.max(...peak2);
                                        peak.push(maxPeak);
                                        let peakTimeEntry = dataArr.find(x => parseFloat(x.value) === maxPeak);
                                        if (peakTimeEntry && peakTimeEntry.time) {
                                            pkTime.push(peakTimeEntry.time);
                                        }
                                    }
                                }
                                    })
                               
                              
                                if (Execdat.length === 0) {
                                    datasig.push({
                                        startTime: start.format("YYYY-MM-DD " + HF.HMS),
                                        endTime: end.format("YYYY-MM-DD " + HF.HMS),
                                        cycletime: moment.utc(end.diff(start)).format("ss"),
                                        Partnum: val1.key + Number(datas.page * (rowsPerPage - 1) + (i + 1)),
                                        average: avg.map((avg1) => avg1.toFixed(2)),
                                        curpeak: peak,
                                        prod_part_comment: comments.length > 0 ? comments[0].param_comments : t('noComments'),
                                        averageTime: avgTime,
                                        peakTime: pkTime,
                                        ct_load: res.data,
                                        metrics:MetricArray
                                    })
                                } else {
                                    if (Exstart) {
                                        if ((chartdata.length - 1) !== i) {
                                            datasig.push({
                                               
                                                startTime: Exstart,
                                                endTime: Exend,
                                                cycletime: moment.utc(moment(Exend).diff(moment(Exstart))).format("ss"),
                                                Partnum: (datas.IntrmType === 9) ? (val1.key + chartdata[i].value) : (val1.key + Number(datas.page * (rowsPerPage - 1) + (i + 1))),
                                               
                                                average:  avg.map((avg2) => avg2.toFixed(2)),
                                                curpeak: peak,
                                                prod_part_comment: comments.length > 0 ? comments[0].param_comments : t('noComments'),
                                                averageTime: avgTime,
                                                peakTime: pkTime,
                                                ct_load: res.data,
                                                metrics:MetricArray
                                            })
                                          
                                        } else {
                                            datasig.push({
                                               
                                                startTime: Exstart,
                                                endTime: Exend,
                                                cycletime: moment.utc(moment(Exend).diff(moment(Exstart))).format("ss"),
                                                Partnum: (datas.IntrmType === 9) ? (val1.key + (Number(chartdata[i].value))) : (val1.key + Number(datas.page * (rowsPerPage - 1) + (i + 1))),
                                               
                                                average:  avg.map((avg3) => avg3.toFixed(2)),
                                                curpeak: peak ,
                                                prod_part_comment: comments.length > 0 ? comments[0].param_comments : t('noComments'),
                                                averageTime: avgTime,
                                                peakTime: pkTime,
                                                ct_load: res.data,
                                                metrics:MetricArray
                                            })
                                          
                                        }
                                    }
                                }


                                // eslint-disable-next-line array-callback-return
                                res.data.map(val2 => {
                                    ctload.push({
                                       
                                        name: val2.key,
                                        x: val2.time,
                                        y: val2.value,
                                    })
                                })

                                let dataimp = []
                                // eslint-disable-next-line array-callback-return
                                res.data.map((val3, idx) => {
                                    dataimp.push({
                                        x: idx,
                                        y: val3.value
                                    })


                                })
                                superimp.push({
                                    name: val1.key + (i + 1),
                                    data: dataimp

                                })
                            } else {
                                datasig.push({
                                    startTime: start.format("YYYY-MM-DD " + HF.HMS),
                                    endTime: end.format("YYYY-MM-DD " + HF.HMS),
                                    cycletime: moment.utc(end.diff(start)).format("ss"),
                                    Partnum: val1.key + (i + 1),
                                    average: 0,
                                    curpeak: 0,
                                    prod_part_comment: comments.length > 0 ? comments[0].param_comments : t('noComments'),
                                    averageTime: "",
                                    peakTime: "",
                                    ct_load: [],
                                    metrics:MetricArray
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
                setData({ Data: Finaldata, Data2: datas.dataExe, key: datas.key, Rejected: datas.RejectedGraph })
                setLoading(false);
                setError(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { ChartDataLoading, ChartData, ChartDataError, getChartData };
};

export default useChartData;