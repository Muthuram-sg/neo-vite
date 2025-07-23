import { useState } from "react";
import moment from 'moment';
import { useAuth } from "components/Context";
import { useTranslation } from 'react-i18next';
import configParam from "config"; 


const useSuperpartData = () => {
    const [SuperpartDataLoading, setLoading] = useState(false);
    const [SuperpartData, setData] = useState(null);
    const [SuperpartDataError, setError] = useState(null);
    const { HF } = useAuth();
    const { t } = useTranslation();

    const getSuperpartData = async (datas,TableData,count,RejectData,ImposeTable,dataSuper,AnlyConf) => {
       
        setLoading(true);
        const body = {
            schema: datas.headPlant.schema,
            instrument_id: datas.val.toString(),
            metric_name: datas.MetricName,
            MSMetric: "execution",
            MSintru: datas.confMSintru,
            start_date: datas.start,
            end_date: datas.end,
            asset_ids: datas.assetArray,
            binary: datas.Binary,
            downfall: datas.downFall,
            pagesize: datas.part === 'part_count1' ? 2:1,
            pageindex: datas.page,

        }
        let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
        let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
        let stdOffset = Math.min(janOffset, julOffset); //Then we can make a Moment object with the current time at that fixed offset
        await configParam.RUN_REST_API("/dashboards/actualPartSignalSA", body)
            .then(async actualPartSignalSAres => {
                    if (actualPartSignalSAres.data.length > 0) {
                        let val1 = actualPartSignalSAres.data; 
                        let ExeSuperDT=TableData.filter(e=> e?.["Partnum"] === datas.part)
                        let newmetrics = datas.metrics.map(m => m.title + " - " + ExeSuperDT[0]?.["Partnum"])
                        let end1 = ''
                        let start1 = '' 
                        if (count === datas.page + 1) {
                            start1 = moment(val1[0].time).utcOffset(stdOffset)
                            end1 = moment(val1[0].time).utcOffset(stdOffset).add(10, "second");
                        } else {
                            start1 = moment(val1[1].time).utcOffset(stdOffset)
                            end1 = datas.part === 'part_count1' ? moment(val1[2].time).utcOffset(stdOffset) : moment(val1[0].time).utcOffset(stdOffset)
                        }  
                      
                        const body2 = {
                            schema: datas.headPlant.schema,
                            instrument_id: datas.val.toString(),
                            key: JSON.stringify(datas.metrics.map(e=> {return {"value": e.title,"on_change":e.on_change}})),
                            start_date: ExeSuperDT.length>0 ? moment(ExeSuperDT[0].startTime).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ") : start1.utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"),
                            end_date: ExeSuperDT.length>0 ? moment(ExeSuperDT[0].endTime).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ") : end1.utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"),
                        }
                        console.log(body2,"BODY2")
                        let datasig = []
                        await configParam.RUN_REST_API("/dashboards/actualCurrentLoad", body2)
                              // eslint-disable-next-line array-callback-return

                            .then(res => {
                                let comments = actualPartSignalSAres.comment.filter(x=> x.part_completed_time === ((datas.part === 'part_count1') ? val1[1].time :val1[0].time))
                                let dataimp = []
                                if (res && res.data && res.data.length > 0) {
                                    
                                    let totct = res.data.reduce((total, thing) => total + Number(thing.value), 0)
                                    let avg = totct / res.data.length
                                    let avgTime = res.data[Math.round(res.data.length / 2)].time
                                    let peak = []
                                    // eslint-disable-next-line array-callback-return
                                    res.data.map(values => {
                                        peak.push(values.value)
                                    })
                                    let pkTime = res.data.filter(x=>parseFloat(x.value) === Math.max(...peak))[0].time
                                    let temparr=res.data.map((v,i)=> {return {...v,index:i}})
                                  
                                        let DTstart=ExeSuperDT.length>0 ? moment(ExeSuperDT[0].startTime).utcOffset(stdOffset).format("YYYY-MM-DD "+HF.HMSS) : start1.format("YYYY-MM-DD "+HF.HMSS)
                                        let DTend=ExeSuperDT.length>0 ? moment(ExeSuperDT[0].endTime).utcOffset(stdOffset).format("YYYY-MM-DD "+HF.HMSS) : end1.format("YYYY-MM-DD "+HF.HMSS)
                                        datasig.push({ 
                                            PartID: ExeSuperDT.length>0 ? ExeSuperDT[0]["Partnum"] : val1[0].key + (datas.page + 1),
                                            startTime: ExeSuperDT.length>0 ? moment(ExeSuperDT[0].startTime).utcOffset(stdOffset).format("YYYY-MM-DD "+HF.HMSS) : start1.format("YYYY-MM-DD "+HF.HMSS),
                                            endTime: ExeSuperDT.length>0 ? moment(ExeSuperDT[0].endTime).utcOffset(stdOffset).format("YYYY-MM-DD "+HF.HMSS) : end1.format("YYYY-MM-DD "+HF.HMSS),
                                            Partnum: (ExeSuperDT.length>0) ? (datas.metrics.map(e=> e.title).toString() + " - " + ExeSuperDT[0]["Partnum"]) : (datas.metrics.map(e=> e.title).toString() + " - " + val1[0].key + (datas.page + 1)),
                                            cycletime: moment.utc(moment(DTend).diff(moment(DTstart))).format("mm:ss:SSS"),
                                            average: (ExeSuperDT.length>0 ? ExeSuperDT[0]["average"] : avg.toFixed(2)),
                                            averageTime: avgTime,
                                            curpeak: (ExeSuperDT.length>0 ? ExeSuperDT[0]["curpeak"] : Math.max(...peak)),
                                            peakTime: pkTime,
                                            prod_part_comment: comments.length > 0 ? comments[0].param_comments : t('noComments'),
                                            ct_load: temparr,
                                            metrics: datas.metrics.map(e=> e.title),
                                            increment: 0
                                        })
                                    // })                    
                                    // eslint-disable-next-line array-callback-return
                                    res.data.map((values, idx) => {
                                        dataimp.push({
                                            Sno: idx+values.value,
                                            name: ExeSuperDT.length>0 ? (values.key + " - " + ExeSuperDT[0]["Partnum"]) : (values.key + " - " + val1[0].key + (datas.page + 1)),
                                            data: [{
                                                x: idx,
                                                y: values.value
                                            }]
                                        })


                                    })
                                    
                                   
                                } else {
                                    datasig.push({
                                        PartID: null,
                                        startTime: start1.format("YYYY-MM-DD "+HF.HMS),
                                        endTime: end1.format("YYYY-MM-DD "+HF.HMS),
                                        Partnum: val1[0].key + (datas.page + 1),
                                        cycletime: moment.utc(end1.diff(start1)).format("mm:ss:SSS"),
                                        average: 0,
                                        averageTime: "",
                                        curpeak: 0,
                                        peakTime: "",
                                        prod_part_comment: comments.length > 0 ? comments[0].param_comments : t('noComments'),
                                        ct_load: [],
                                        metrics: [],
                                        increment: 0
                                    })
                                } 
                                let TabArr=datasig.map((value,i)=>{
                                    let Reject = RejectData.filter(e=> (moment(moment(e.marked_at).utcOffset(stdOffset).format("YYYY-MM-DD "+HF.HMSS)).isBetween(moment(value.startTime).utcOffset(stdOffset), moment(value.endTime).utcOffset(stdOffset)) || moment(moment(e.marked_at).utcOffset(stdOffset).format("YYYY-MM-DD "+HF.HMSS)).isSame(value.endTime)) )
                                    return {...value,"SNo":i+1
                                                ,"Part Quality": (Reject.length>0) ? "Rejected ,"+Reject[0].prod_reason.reason : "Accepted"
                                }
                                })
                                let updateData = [...ImposeTable, ...TabArr] 
                                
                                
                                let tempdata = [...dataSuper.Data]
                                tempdata = [...tempdata, ...dataimp]
                                let tempkeys = [...dataSuper.key]
                                tempkeys = [...tempkeys, ...newmetrics]
                                let uniqMet = [...new Set(res.data.map(item => item.key))];
                                let strokearr= []
                                // eslint-disable-next-line array-callback-return
                                uniqMet.forEach(value=>{ 
                                    // eslint-disable-next-line array-callback-return
                                    tempkeys.forEach(val2=>{
                                        let mettype =[]
                                        if(val2.includes(value)){
                                    
                                            if(AnlyConf.length> 0){
                                                mettype =AnlyConf[0].config.Metrics.filter(e=> e.key === value) 
                                            }
                                            if(mettype.length>0){ 
                                                
                                                let chart = AnlyConf[0].config.Config.filter(e=>e.metric_id === mettype[0].id)
                                                if(chart && chart[0] && chart[0].chartType === 1){
                                                    strokearr.push({id: val2,value: 'smooth'})
                                                }else{
                                                    strokearr.push({id: val2,value:'stepline'})
                                                }
                                            }else{
                                                strokearr.push({id: val2,value:'smooth'})
                                            }

                                        }
                                    })
                                    
                                })
                                setData({ Data: tempdata, key: tempkeys,stroke:strokearr, ImposeData: updateData});
                                setLoading(false);
                                setError(false);
                                

                            })
                            .catch(error => console.log('Performance Trends error', error));

                    } else {
                        setData({ Data: []});
                        setLoading(false);
                        setError(false); 
                    }
 
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { SuperpartDataLoading, SuperpartData, SuperpartDataError, getSuperpartData };
};

export default useSuperpartData;