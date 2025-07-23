import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';
import { useRecoilState } from "recoil";
// import { isSelectedIsProduct } from "recoilStore/atoms";
const usePartSignalStatus = () => {
  const [partLoading, setLoading] = useState(false);
  const [partData, setData] = useState(null);
  const [partError, setError] = useState(null);
  // const [isSelectedProduct] = useRecoilState(isSelectedIsProduct)

  const getPartsCompleted = async (schema, data, start_date, end_date,isRepeat,previousData,ExeData,prevCycle,isMultiAst,isReport,isDownTime,isLong) => {
    let start = '';
    let end = '';
    if(isRepeat){   
      start = moment(moment().subtract(20, 'seconds')).format('YYYY-MM-DDTHH:mm:ssZ')
      end = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    }else{
      start = start_date
      end = end_date;
    }  
    // console.log(data,"DatesArrDatesArr",ExeData,isLong)
    Promise.all(data.map(async (Oee) => {
      setLoading(true);
    
        let AssetArr = [Oee]
        let DatesArr = []  
        if(ExeData.length>0 && !isRepeat && !isMultiAst){ 
          let WOArr = []
          ExeData.forEach((d,i)=>{
            if(d.is_product_microstop){
            // if(isSelectedProduct && d.is_product_microstop){
              WOArr.push({...AssetArr[0],...d,wo_start: d.jobStart, wo_end: d.jobEnd, prod_order:d.orderid,cycleTime:d.cycleTime, mic_stop_duration: d.prod_mic_duration})
            } else {
              WOArr.push({...AssetArr[0],...d,wo_start: d.jobStart, wo_end: d.jobEnd, prod_order:d.orderid,cycleTime:d.cycleTime})
            }
          })
          DatesArr = WOArr
          DatesArr.sort((a, b) => new Date(b.wo_start) - new Date(a.wo_start));
        }else{
          DatesArr = AssetArr
        }
        return Promise.all(DatesArr.map(async (val) => {
          
          const body = {
            schema: schema,
            instrument_id: val.part_signal_instrument,
            metric_name: val.metric.name,
            start_date: val.wo_start ? val.wo_start : start,
            end_date: val.wo_end ? val.wo_end : end,
            binary: val.is_part_count_binary,
            downfall: val.is_part_count_downfall,
            execution: val.is_status_signal_available,
          }
          
          const url = "/dashboards/actualPartSignal";
          return configParam.RUN_REST_API(url, body)
            .then(async (response) => {   
              // console.log(response,"response")            
              let resData = response.data ? response.data : []
              var parts = isRepeat ? [...resData,...previousData] : resData; 
              parts = parts.filter(x=>x !== null)
              let temp = [
                {
                  name: 'ACTIVE',
                  data: []
                },
                {
                  name: 'IDLE',
                  data: []
                }
              ]
              let totalDTime = 0
              let checkStatus = 'IDLE' 
              let final_outages = [];
              let reasons = [];
              let dTime = 0 
              let houryDowntime = {}
              const tempFunc =(dataTemp)=>{
                let dataT = dataTemp.reverse()
                dataT.forEach((x, i) => {
                  let diffinsec = 0
                  
                  let Next =  moment(x.next).valueOf() //Daylight Checking
                  let Time = moment(x.time).valueOf()
                  let StartDT = start_date
                  let diff = moment.duration(moment(x.time).diff(moment(StartDT))).asSeconds() 
                  // console.log(diff,x,"difffff")  
                    if (i !== (dataT.length - 1)) {
                      checkStatus = 'ACTIVE'
                      if(i === 0 && diff > 0){
                        temp[0].data.push({
                          x: 'Range',
                          y: [moment(StartDT).valueOf(), Time]
                        })
                      }
                    
                        temp[0].data.push({
                          x: 'Range',
                          y: [Next, moment(dataT[i + 1].time).valueOf()]
                        })
                      
                      checkStatus = 'IDLE'
                      if(x.isPlanned){
                        temp[0].data.push({
                          x: 'Range',
                          y: [Time, Next]
                        })
                      }else{
                        temp[1].data.push({
                          x: 'Range',
                          y: [Time, Next]
                        })
                        diffinsec = parseInt(moment.duration(moment(Next).diff(moment(Time))).asMilliseconds());  
                      }
                      
                      
                    }
                    let LastNext = body.end_date
                    let LastDiff = parseInt(moment.duration(moment(LastNext).diff(moment(Next))).asSeconds());  
                    let LastPartDiff = 0 
                    if(parts.length){
                      LastPartDiff = parseInt(moment.duration(moment(LastNext).diff(moment(parts[0].time))).asSeconds());
                    }
                    
                    if (i === (dataT.length - 1) ) {
                      // console.log(LastDiff,"LastDiffLastDiff",val.mic_stop_duration,LastNext,parts[0].time,i)
                      if(LastDiff > 0 && (i !== 0)){
                        let AvtiveEnd = moment(parts[0].time).valueOf() 
                        // console.log(val)
                        if(LastDiff < val.mic_stop_duration){
                          AvtiveEnd = moment(body.end_date).valueOf()
                        }
                        temp[0].data.push({
                          x: 'Range',
                          y: [Next, AvtiveEnd ]
                        }) 
                        checkStatus = 'IDLE'
                        if(x.isPlanned){
                          temp[0].data.push({
                            x: 'Range',
                            y: [Time, Next]
                          })
                        }else{
                          temp[1].data.push({
                            x: 'Range',
                            y: [Time, Next]
                          })
                          diffinsec = parseInt(moment.duration(moment(Next).diff(moment(Time))).asMilliseconds()); 
                        }
                        
                        
                        if(LastPartDiff > val.mic_stop_duration){
                          if(x.isPlanned){
                            temp[0].data.push({
                              x: 'Range',
                              y: [moment(parts[0].time).valueOf(), moment(LastNext).valueOf()]
                            })
                          }else{
                            temp[1].data.push({
                              x: 'Range',
                              y: [moment(parts[0].time).valueOf(), moment(LastNext).valueOf()]
                            })
                            diffinsec = parseInt(moment.duration(moment(LastNext).diff(moment(parts[0].time).valueOf())).asMilliseconds());  
                          }
                          
                          
                        }
                        
                        
                      }else{
                        if(LastDiff > 0){
                          temp[0].data.push({
                            x: 'Range',
                            y: [Next, moment(body.end_date).valueOf()]
                          })
                        }
                        if(x.value === 'ACTIVE') {
                          temp[0].data.push({
                            x: 'Range',
                            y: [Time, Next]
                          })
                        } else {
                          if(x.isPlanned){
                            temp[0].data.push({
                              x: 'Range',
                              y: [Time, Next]
                            })
                          }else{
                            temp[1].data.push({
                              x: 'Range',
                              y: [Time, Next]
                            })
                          }
                      diffinsec = parseInt(moment.duration(moment(Next).diff(moment(Time))).asMilliseconds());  
                      totalDTime = totalDTime + (diffinsec / 1000) 
                      // console.log(totalDTime,"totalDTime")
                          
                        } 
                        
                        
                      }
                    
                      
                      
                    } 
                    
                    // if(!x.isPlanned){
                      // totalDTime = totalDTime + (diffinsec / 1000) 
                      
                    // }
                    
                })
              }
              // Part Count process
              if (response && !response.errorTitle && parts.length > 0) {
                let diff = [];
                // console.log(parts,"parts3")
                for (let i = 1; i < parts.length; i++) {
                  if(parts[i].cycleTime){
                    diff.push(Number(parts[i].cycleTime))
                  }else{
                  //  console.log(i,"parts[i]parts[i]",parts[i])

                    let actDiff = new Date(parts[i - 1].time) / 1000 - new Date(parts[i].time) / 1000
                    let object = parts[i-1];
                    if(parts[i].cycleTime ){
                      object.cycleTime = 0;
                    }
                    if(actDiff > 0  ){
                      diff.push(actDiff)
                      if(!val.is_status_signal_available){
                        object.cycleTime = actDiff.toFixed(0);
                        parts[i-1] = object
                      }
                    
                    }
                  }
                  
                }
                // console.log(parts,"parts3")
                
                const actCycletime = mode(diff),stdCycletime = mode(diff.slice(0, Math.min(20, diff.length)));
                diff.push(actCycletime)
                parts[parts.length-1].cycleTime = parseInt(actCycletime);
                let ExeCycle = ExeData.length > 0 ? val.cycleTime : stdCycletime
                let STDCycle = (isRepeat && ExeData.length > 0) ? Number(prevCycle) : ExeCycle

                parts = parts.map((p,i)=>{
                  if(p.cycleTime > val.mic_stop_duration && !val.is_status_signal_available){
                    
                      return {...p,cycleTime: STDCycle.toFixed(0),runningTime: p.cycleTime} 
                    
                  }else{
                    if(!p.cycleTime && i !== 0){
                      return {...p,cycleTime: STDCycle.toFixed(0)} 
                    }
                    return p
                    
                  }
                    
                }) 
              //  console.log(parts,"Parts1")
                let AssetStatus =[] 
                let DownData = parts.reverse()
                
                DownData.forEach((d,i)=>{
                  let exestDate = ExeData.length > 0 && isRepeat ? ExeData.filter(dt => !dt.ended_at)[0].jobStart : null
                  let checkDT = exestDate && isRepeat &&  moment(exestDate).isBefore(start_date) ? start_date : exestDate 
                  let ExeSTDT =  isRepeat ? checkDT : body.start_date
                  let repDT = isReport ? body.start_date : start_date
                  let DTStart = ExeData.length > 0 ? ExeSTDT : repDT
                  let stTime = (i === 0) ? DTStart : parts[i-1].time
                  let enTime = d.time
                  let timDiff = moment.duration(moment(enTime).diff(moment(stTime))).asSeconds()
                  if(timDiff > val.mic_stop_duration){ 
                    let isRunning = Number(d.cycleTime) > val.mic_stop_duration ? val.is_running_downtime : false
                    // console.log(d,"Running",val)
                    AssetStatus.push({
                        ...d,
                        time: moment(stTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                        next: moment(enTime).subtract(d.cycleTime,'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS'),
                        isRunning : isRunning,
                        isPlanned: false
                    })
                  }
                  if(DownData.length-1 === i){
                    let LastDiff = moment.duration(moment(body.end_date).diff(moment(enTime))).asSeconds()
                    if(LastDiff > val.mic_stop_duration){
                      AssetStatus.push({
                        ...d,
                        time: moment(enTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                        next: moment(body.end_date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                        isPlanned: false
                      })
                    }
                  }
                  
                })
                // console.log(DownData,"DownData",isRepeat,AssetStatus)
                if(!val.is_status_signal_available){
                  if(AssetStatus.length === 0){
                    AssetStatus.push({
                      "time": moment(body.start_date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                      "iid": val.instrument.id,
                      "key": val.metric.name,
                      "value": "ACTIVE",
                      "next": moment(body.end_date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                      "isPlanned": false
                    })
                  }
                  
                }
                let assetStatData = { raw: filterIntervals(AssetStatus.reverse()), data: temp, dTime: totalDTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime,isLong: isLong}
                
                // console.log(,"13th")
                const param = {
                  entity_id: val.entity_id ? val.entity_id  : '',
                  from: body.start_date,
                  to: body.end_date
                };
                var qualityDefects 
                await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param)
                  .then((reasonsData) => {
                    if (reasonsData && reasonsData.neo_skeleton_prod_quality_defects && reasonsData.neo_skeleton_prod_quality_defects.length > 0) {
                      let defects = reasonsData.neo_skeleton_prod_quality_defects;
                      let qualityLoss = 0
                      let reason = [];
                      defects.forEach(x => {
                        qualityLoss = qualityLoss + parseInt(x.quantity)
                        reason.push(x.prod_reason.reason);
                        const defected = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.marked_at).toISOString())
                        if (defected >= 0) {
                          parts[defected]['defect'] = true;
                          parts[defected]['reason'] = x.prod_reason.id;
                          parts[defected]['reason_name'] = x.prod_reason.reason;
                        }
                      })       
                      qualityDefects ={ data: defects, loss: qualityLoss, reasons: reason, entity_id: param.entity_id, start: param.from, end: param.to }
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                      
                    } else {
                      qualityDefects={ data: [], loss: 0, reasons: [], entity_id: '', start: param.from, end: param.to }
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                    }
                    if (reasonsData && reasonsData.neo_skeleton_prod_part_comments && reasonsData.neo_skeleton_prod_part_comments.length > 0) {
                      let comments = reasonsData.neo_skeleton_prod_part_comments;
                      comments.forEach(x => {
                        const commented = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.part_completed_time).toISOString())
                        if (commented >= 0) {
                          var savedcomments = ""
                          if (Object.keys(x.param_comments).length > 0) {
                            Object.entries(x.param_comments).forEach((entry) => savedcomments = savedcomments + entry.join(" : ") + "\n")

                          }
                          if (x.comments.replace(/\s/g, '').length > 0) savedcomments = savedcomments + "Generic : " + x.comments
                          parts[commented]['comment'] = savedcomments
                        }
                      })
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                    } else {
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                    }

                    /* Production dashboard - steel data */
                    if (reasonsData && reasonsData.neo_skeleton_steel_data && reasonsData.neo_skeleton_steel_data.length > 0) {
                      let steeldata = reasonsData.neo_skeleton_steel_data;
                      steeldata.forEach(x => {
                        const isSteelData = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.time).toISOString())
                        if (isSteelData >= 0) {
                          parts[isSteelData]['steeldata'] = x.value;
                        }
                      })
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                    } else {
                      parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                    }
                  })
                    let rejectedParts = parts && parts.length > 0 ? parts.filter(obj => obj.hasOwnProperty('defect')) : []

                    

                    // console.log({ data: parts, actCycleTime: actCycletime, cycleTime: stdCycletime, rejectedParts: rejectedParts},STDCycle,"partsparts",Oee) 
                    let partStatus = { data: parts, actCycleTime: actCycletime, cycleTime: STDCycle ? STDCycle.toFixed(0) : 0, rejectedParts: rejectedParts, prod_order: val.prod_order ? val.prod_order : null, total_time: diff.map(t=> t).reduce((a,b)=> a+b,0),assetStatData: assetStatData,qualityDefects: qualityDefects}
                    if(val.is_status_signal_available && !isDownTime){
                      let FormDate
                      let ToDate
                      if(ExeData.length>0){
                        FormDate = start_date
                        ToDate = end_date
                      }else{
                        FormDate = isRepeat ? start_date : body.start_date
                        ToDate = isRepeat ? end_date : body.end_date
                      }
                      assetStatData = await geAssetStatus(schema, isMultiAst ? [val] : data, FormDate, ToDate,actCycletime,ExeData,[partStatus],isRepeat,isLong)
                     // console.log(assetStatData,"assetDataExecution",ExeData,parts)
                      try{
                        parts = parts.map((p,i)=>{
                          // if(!body.binary && body.downfall){
                          //   return p
                          // }
                          // else if( p.cycleTime > val.mic_stop_duration && assetStatData && assetStatData.raw.length && (parts.length - 1 !== i)){
                          //   let exec = assetStatData.raw.find(d=> moment(new Date(d.next)).isBetween(moment(parts[i+1].time),moment(p.time)))
                          //   // console.log(moment(p.time).format('YYYY-MM-DDTHH:mm:ss.SSS'),p.cycleTime,"partsDataExe",exec,assetData.raw)
                          //   let stdDiff= exec ? moment.duration(moment(p.time).diff(moment(exec.next))).asSeconds() : STDCycle.toFixed(0)
                          //   // if(!body.binary && body.downfall){
                          //   //   exec = assetStatData.MSdata[0].filter(e=> moment(moment(new Date(e.time)).format('YYYY-MM-DDTHH:mm:ss.SSS')).isBetween(moment(parts[i+1].time), moment(p.time)) )
                          //   //   stdDiff= moment.duration(moment(p.time).diff(moment(exec[0].time))).asSeconds()
                          //   // }
                            
                          //   return {...p,cycleTime: Number(stdDiff).toFixed(0)}
                          //   // return {...p,cycleTime: stdCycletime.toFixed(0)}
                          // }else{ 
                            return p
                          // }
                            
                        })
              //  console.log(parts,"Parts2")

                        partStatus = { data: parts, actCycleTime: actCycletime, cycleTime: STDCycle ? STDCycle.toFixed(0) : 0, rejectedParts: rejectedParts, prod_order: val.prod_order ? val.prod_order : null, total_time: diff.map(t=> t).reduce((a,b)=> a+b,0),assetStatData: assetStatData,qualityDefects:qualityDefects}
                        // console.log(assetStatData,"assetDataExecution2")
                     
                      }catch (err) {
                          console.log("error in geAssetStatus Execution", err)
                      }
                      
                      
                    } else if(!isDownTime){
                      let outages = await getDownReson ({ asset_id: val.entity_id, from: start_date, to: end_date })
                       
                      let outagesLive = await getDownResonLive({ asset_id: val.entity_id, from: start_date })
                      
                      let mergeOutage = [...outagesLive,...outages]
                      let sort_outages = mergeOutage.sort((a, b) => new Date(a.start_dt) - new Date(b.start_dt));

                      let Outages = getOutages(AssetStatus,sort_outages) 
                      // console.log(Outages,"final_outages",AssetStatus)
                      let Final_result={final_result:[],dTime:0,houryDowntime:{},onlyplaneddt:0}
                      if (Outages.final_outages.length > 0) {
                        Final_result = getFinal_result(Outages.final_outages) 
                        tempFunc(Outages.final_outages)
                      }
                      // console.log(Final_result.dTime,"Final_result.dTime1")
                      assetStatData = { raw: filterIntervals(Final_result.final_result), data: temp, dTime: Final_result.dTime, totalDTime: totalDTime, reasons: Outages.reasons, status: checkStatus,hourlyDowntime: Final_result.houryDowntime,isLong: isLong,onlyplaneddt:Final_result.onlyplaneddt}
                      // console.log(assetStatData,"assetDataExecution3")
                     
                      partStatus = { data: parts, actCycleTime: actCycletime, cycleTime: STDCycle ? STDCycle.toFixed(0) : 0, rejectedParts: rejectedParts, prod_order: val.prod_order ? val.prod_order : null, total_time: diff.map(t=> t).reduce((a,b)=> a+b,0),assetStatData: assetStatData,qualityDefects: qualityDefects}
                      // console.log(assetStatData,"assetDataExecution4")
                  
                    }
                    if(isReport){
                      let dressing_count = { count: 0, data: [] };
                        if (val.dressing_signal && val.dressing_program) {
                            const Dressbody = {
                                schema: schema,
                                metric: val.metricByDressingSignal.name,
                                program: val.dressing_program,
                                from: body.start_date,
                                to: body.end_date,
                                instrument: val.part_signal_instrument
                            };
                            const Dressurl = "/iiot/getDressingCount";
                            dressing_count = await getDressing(Dressbody,Dressurl)
                        }
                      partStatus = { partsdata: partStatus, assetStatus: assetStatData, qualityDefects: qualityDefects, dressing_count: dressing_count, start: val.start, end: val.end, entity_id: val.entity_id, execid: val.execid,operatorid: val.operatorid }
                      // console.log(assetStatData,"assetDataExecution5")
                   
                    }
                   // console.log(isReport,partStatus,"responseresponseactualPartSignal",val,AssetStatus,temp,temp[1].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))),"Active",temp[0].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))))
                return partStatus
              } else { 
                let exestDate = ExeData.length > 0 && isRepeat ? ExeData.filter(dt => !dt.ended_at)[0].jobStart : start_date
                let checkDT = exestDate && isRepeat &&  moment(exestDate).isBefore(start_date) ? start_date : exestDate
                // console.log(exestDate,"exestDate",start_date)
                let FromDT = isRepeat ? checkDT : body.start_date
                let AssetStatus2 =[]
                let timDiff = moment.duration(moment(body.end_date).diff(moment(FromDT))).asSeconds()
                let assetStatData = null
                if(timDiff > val.mic_stop_duration){ 
                  if(val.is_status_signal_available ){
                    let partStatus = { data: [], actCycleTime: 0, cycleTime: 0, rejectedParts: [], prod_order: null, total_time: 0,assetStatData: assetStatData,qualityDefects: null}
                    assetStatData = await geAssetStatus(schema, isMultiAst ? [val] : data, start_date, end_date,0,ExeData,[partStatus],isRepeat,isLong)
                  }else{
                    
                    AssetStatus2.push({
                      "time": moment(FromDT).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                      "iid": val.instrument.id,
                      "key": val.metric.name,
                      "value": "IDLE",
                      "next": moment(body.end_date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                      "isPlanned": false
                    })
                    // console.log("final_outages",AssetStatus2)
                    
                    let outages = await getDownReson({ asset_id: val.entity_id, from: start_date, to: end_date })
                         
                    let outagesLive = await getDownResonLive({ asset_id: val.entity_id, from: start_date }) 
                    let mergeOutage = [...outagesLive,...outages]
                    let sort_outages = mergeOutage.sort((a, b) => new Date(a.start_dt) - new Date(b.start_dt));
  
                    let Outages = getOutages(AssetStatus2,sort_outages) 
                    // console.log(final_outages,"final_outages",Outages,sort_outages,AssetStatus2,val)
                    let Final_result={final_result:[],dTime:0,houryDowntime:{},onlyplaneddt:0}
                    if (Outages.final_outages.length > 0) {
                      Final_result = getFinal_result(Outages.final_outages) 
                      tempFunc(Outages.final_outages)
                    }
                    // console.log(Final_result.dTime,"Final_result.dTime2")

                    assetStatData = { raw: filterIntervals(Final_result.final_result), data: temp, dTime: Final_result.dTime, totalDTime: totalDTime, reasons: Outages.reasons, status: checkStatus,hourlyDowntime: Final_result.houryDowntime,isLong,isLong,onlyplaneddt:Final_result.onlyplaneddt}
                    // console.log(assetStatData,"assetDataExecution7")
                 
                  }
                  
                  // assetStatData = { raw: AssetStatus, data: temp, dTime: timDiff, totalDTime: timDiff, reasons: [], status: "Active",hourlyDowntime: {}}
                }

                let partStatus = { data: parts, actCycleTime: 0, cycleTime: 0, rejectedParts: [], prod_order: null, total_time: 0,assetStatData:assetStatData}
                // console.log(assetStatData,"assetDataExecution8")
               
                // console.log(partStatus,"partStatuspartStatus",timDiff)
                if(isReport){
                  partStatus = { partsdata: partStatus, assetStatus: [], qualityDefects: [], dressing_count: 0, start: val.start, end: val.end, entity_id: val.entity_id, execid: val.execid,operatorid: val.operatorid }
                }
                return partStatus
              } 
            })
            .catch((e) => {
              console.log(e,"errror")
              return e
            });
        }))
          .then( async(Finaldata) => {  
            if(ExeData.length > 0 && !isRepeat && !isReport){
              let actCycle = Finaldata.map(s=> s.total_time).reduce((a,b)=> a+b,0)
              let stdCycle = Finaldata.map(s=> (s.cycleTime * s.data.length) ).reduce((a,b)=> a+b,0)
              let statusArr = [
                {
                  name: 'ACTIVE',
                  data: []
                },
                {
                  name: 'IDLE',
                  data: []
                }
              ]
              let AssetArr = { raw: [], data: statusArr, dTime: 0, totalDTime: 0, reasons: [], status: '',hourlyDowntime: {},isLong:'' ,onlyplaneddt:0}
              let TotParts = []
              let rejParts = []
              Finaldata.forEach(s=> {
                let status_machine_1 = []
                let status_machine_2 = []
                if(s?.assetStatData?.data?.length > 0){
                  status_machine_1 = s.assetStatData.data?.[0].data
                  status_machine_2 = s.assetStatData.data?.[1].data
                }
                TotParts = [...TotParts,...s.data]
                rejParts = [...rejParts,...s.rejectedParts]
                AssetArr.raw = [...AssetArr.raw,...s.assetStatData.raw]
                AssetArr.reasons = [...AssetArr.reasons,...s.assetStatData.reasons]
                AssetArr.dTime = AssetArr.dTime + s.assetStatData.dTime
                AssetArr.totalDTime = AssetArr.totalDTime + s.assetStatData.totalDTime
                AssetArr.onlyplaneddt = AssetArr.onlyplaneddt + s.assetStatData.onlyplaneddt
                AssetArr.status = s.assetStatData.status 
                AssetArr.hourlyDowntime = {...AssetArr.hourlyDowntime,...s.assetStatData.hourlyDowntime}
                AssetArr.isLong = s.assetStatData.isLong 
                statusArr[0].data = [...statusArr[0].data, ...status_machine_1]
                statusArr[1].data = [...statusArr[1].data, ...status_machine_2]
              })
              
              
              if(Finaldata.length > 0){
                // console.log(AssetArr,"assetDataExecution8")

                let Finalarr = [{data: TotParts, actCycleTime: (actCycle/TotParts.length), cycleTime: (stdCycle/TotParts.length), rejectedParts: rejParts,total_time:actCycle,assetStatData: AssetArr}]
                // console.log("FinaldataFinaldata",Finalarr,actCycle,TotParts.length,stdCycle,Finaldata) 
                // setData(Finalarr);
                return Finalarr
              } else{
                return null 
              }   
            }else{
              if(Finaldata.length > 0){ 
                // setData(Finaldata);
                return Finaldata
              } else{
                return null 
              }       
            }
          
          })
          .catch((e) => {
            console.log("ERROR __", e)
            return null
          })
    }))
    .then( async(Finaldata) => {  
      // console.log(Finaldata,"FinaldataFinaldata") 
      // 
      setData(Finaldata);
      setError(false)
    
    })
    .catch((e) => {
      setData(e);
      setError(true)
    })  
    .finally(() => {
      setLoading(false)
    });
  };

  const getDownReson = async(val)=>{
    return await configParam.RUN_GQL_API(gqlQueries.getDowntimeWithReasons, val)
    .then((oeeData) => {
        if (oeeData !== undefined && oeeData.neo_skeleton_prod_outage) {
          return oeeData.neo_skeleton_prod_outage;
        }
        else {
          return [];
        }
    })
    .catch((e) => {
      return [];
    });
  }

  const getDressing = async(body,url)=>{
    // return []
    return await configParam.RUN_REST_API(url, body)
    .then((response) => {
        if (response && !response.errorTitle) {
            if (response.data && response.data.count) {
                return response.data;
            } else {
                return { count: 0, data: [] };
            }
        } else {
            return { count: 0, data: [] };
        }
    })
    .catch((e) => {
        console.log('production report', 'dressingcount', 'err', e)
        return { count: 0, data: [] };
    });
  }

  const getDownResonLive = async(val)=>{
    // return []
    return await configParam.RUN_GQL_API(gqlQueries.getLiveDowntimeWithReasons, val)
    .then((oeeData) => {
        if (oeeData !== undefined && oeeData.neo_skeleton_prod_outage) {
          return oeeData.neo_skeleton_prod_outage;
        }
        else {
          return [];
        }
    })
    .catch((e) => {
      return [];
    }); 
  }

  var isLongRange =false

  var geAssetStatus = async (schema, data, start_date, end_date,cycle_time,ExeData,partStatus,isRepeat,isLong) => { 
    isLongRange = ((new Date(end_date) - new Date(start_date)) / 60000) > 1440 ? true : false
    let DatesArr = [] 
    if(ExeData && ExeData.length>0){ 
      let WOArr = []
      ExeData.forEach((d,i)=>{ 
        let EndWO = d.ended_at ? d.jobEnd : end_date
        // WOArr.push({...data[0],wo_start: d.jobStart, wo_end: EndWO, prod_order:d.orderid})
        // alert("JETIX")
        if(d.is_product_microstop){
        // if(isSelectedProduct && d.is_product_microstop){
          WOArr.push({...data[0],wo_start: d.jobStart, wo_end: EndWO, prod_order:d.orderid, mic_stop_duration: d.prod_mic_duration})
        } else {
          WOArr.push({...data[0],wo_start: d.jobStart, wo_end: EndWO, prod_order:d.orderid})
        }
      })
      DatesArr = WOArr
      DatesArr.sort((a, b) => new Date(b.wo_start) - new Date(a.wo_start));
    }else{
      DatesArr = data
    } 

     
    // console.log(DatesArr,"DatesArrDatesArr",ExeData,start_date,"end_date",end_date)
    return Promise.all(DatesArr.map(async (val) => {
      const body = {
        schema: schema,
        instrument_id: val.machine_status_signal_instrument,
        metric_name: "execution",
        start_date: val.wo_start ? val.wo_start : start_date,
        end_date: val.wo_end ? val.wo_end : end_date,
        mic_stop: val.mic_stop_duration,
        active_signal: val.is_status_signal_available,
        downfall: val.is_part_count_downfall
      }
      const url = "/dashboards/machinestatussignal";
      
      return configParam.RUN_REST_API(url, body)
        .then(async (response) => {
          if(ExeData && ExeData.length>0){
            start_date = val.wo_start
            end_date = val.wo_end 
          } 
          let outages = await getDownReson({ asset_id: val.entity_id, from: start_date, to: end_date })
                         
          let outagesLive = await getDownResonLive({ asset_id: val.entity_id, from: start_date }) 
          let mergeOutage = [...outagesLive,...outages]
          let sort_outages = mergeOutage.sort((a, b) => new Date(a.start_dt) - new Date(b.start_dt));
          if (response && !response.errorTitle && response.data.length) {
            //  console.log(response,"responseresponseresponseProd",val.wo_start, val.wo_end)
            
            // // console.log(start_date,"start_date",end_date,idx) 
            // let outages = await getDownReson({ asset_id: val.entity_id, from: start_date, to: end_date })
                         
            // let outagesLive = await getDownResonLive({ asset_id: val.entity_id, from: start_date }) 
             
            
            
            return {data:response.data,sort_outages:sort_outages}
          } else {
            let AssetStatus=[]
            let exestDate = ExeData.length > 0 && isRepeat ? ExeData.filter(dt => !dt.ended_at)[0].jobStart : start_date
            let checkDT = exestDate && isRepeat &&  moment(exestDate).isBefore(start_date) ? start_date : exestDate
            // console.log(exestDate,"exestDate",start_date)
            let FromDT = isRepeat ? checkDT : body.start_date
            AssetStatus.push({
              "time": moment(FromDT).format('YYYY-MM-DDTHH:mm:ss.SSS'),
              "iid": val.machine_status_signal_instrument,
              "key": "execution",
              "value": (partStatus && partStatus[0].data.length > 0 ) ? "ACTIVE" : 'IDLE',
              "next": moment(end_date).format('YYYY-MM-DDTHH:mm:ss.SSS'),
              
            })
            return {data:AssetStatus,sort_outages:sort_outages}
            // return { raw: [], data: response, dTime: 0, totalDTime: 0,reasons: [],  status: 'IDLE',hourlyDowntime: {}}
          }
        })
        .catch((e) => {
          console.log('CatchBlock', e)
          return e;
        });
    }))
      .then(Finaldata => {
        // console.log(Finaldata,"Finaldata")
        let response = []
        let sort_outages = []
        let val = data[0] 
        Finaldata.forEach(s=> {
          response = [...response,...s.data] 
          sort_outages = [...sort_outages,...s.sort_outages]
        })
        response.sort((a, b) => new Date(a.time) - new Date(b.time));
        // console.log(response,"Finalresponse",sort_outages,)
        if (response.length>0) {
          let checkStatus = 'IDLE'
          let temp = [
            {
              name: 'ACTIVE',
              data: []
            },
            {
              name: 'IDLE',
              data: []
            }
          ]
          
          if(ExeData && ExeData.length>0){
            start_date = DatesArr[DatesArr.length -1].wo_start
            end_date = DatesArr[0].wo_end 
          }else{
            start_date = start_date
            end_date = end_date 
          }   
          // let final_outages = [];
          // let reasons = [];
          // let dTime = 0
          let totalDTime = 0 
          // let final_result = [];
          const tempFunc =(data)=>{
            let tempArr = filterIntervals(data)
            // console.log(tempArr,"TotalDowntimedata")
            tempArr.forEach((x, i) => {
              let diffinsec = 0
              
              let Next =  moment(x.next).valueOf() //Daylight Checking
              let Time = moment(x.time).valueOf()
              let diff = moment.duration(moment(x.time).diff(moment(start_date))).asSeconds()
              // console.log(x.next,x.time,start_date,"Activeeee",moment(x.next).format('YYYY-MM-DD HH:mm:ss'),moment(x.time).format('YYYY-MM-DD HH:mm:ss'),moment(x.next).valueOf(),i,diff,val.mic_stop_duration)
              if(i === 0 && (moment(x.time) > moment(start_date)) && (diff < val.mic_stop_duration)){
                // console.log(diff < val.mic_stop_duration,moment(x.time) > moment(start_date),val.mic_stop_duration,"val.mic_stop_duration",moment.duration(moment(x.time).diff(moment(start_date))).asSeconds())
                temp[0].data.push({
                  x: 'Range',
                  y: [moment(start_date).valueOf(), Time]
                })
              }else if(i === 0 && (moment(x.time) > moment(start_date)) && (diff > val.mic_stop_duration)){
                let Lastpart = partStatus ? partStatus[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(Time))) : []
                let Nxt = Lastpart.length > 0 ? moment(Lastpart[Lastpart.length-1].time).valueOf() : Time
                if(x.isPlanned){
                  temp[0].data.push({
                    x: 'Range',
                    y: [moment(start_date).valueOf(), Nxt]
                  })  
                }else{
                  temp[1].data.push({
                    x: 'Range',
                    y: [moment(start_date).valueOf(), Nxt]
                  })
                }
                
                temp[0].data.push({
                  x: 'Range',
                  y: [Nxt, Time]
                })
                // console.log(val.is_status_signal_available,"val.is_status_signal_available",x.value,Lastpart)
              }
              
              
                if (x.value === 'ACTIVE') {
                  checkStatus = 'ACTIVE'
                  temp[0].data.push({
                    x: 'Range',
                    y: [Time, Next]
                  })
                }
                else {
                  checkStatus = 'IDLE'
                  

                  // console.log(x.next,x.time,"x.nextx.nextelse",diffinsec)
                  if(x.isPlanned){
                    temp[0].data.push({
                      x: 'Range',
                      y: [Time, Next]
                    })
                  }else{
                    temp[1].data.push({
                      x: 'Range',
                      y: [Time, Next]
                    })
                  }
                  diffinsec = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asMilliseconds());
                  // console.log(diffinsec,"diffinsec1234")
                  totalDTime = totalDTime + (diffinsec / 1000)
                }
            })
          }
          
          
          // console.log(response,"responseresponse",start_date,end_date,DatesArr)
          if (response.length > 0) {
            response = response.map(m=> {
              let partsData = []
              if(partStatus && partStatus[0].data.length>0){
                partsData =partStatus[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(m.time),moment(m.next))) 
              }
              
                return {...m,next: moment(m.next).format('YYYY-MM-DDTHH:mm:ss.SSS'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss.SSS'),"isPlanned": false}
             
            })
             
                if(moment(response[0].time)>moment(start_date)){
                  let diff = moment.duration(moment(response[0].time).diff(moment(start_date))).asSeconds()
                  let next = response[0].next;
                  let time = response[0].time
                  if(diff > val.mic_stop_duration){
                    let Lastpart =partStatus ? partStatus[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(time))) : []
                    // console.log(diff,"sekirit",Lastpart)
                    next = Lastpart.length > 0 ? Lastpart[Lastpart.length - 1].time : response[0].time
                    let arr2 = []
                    if(Lastpart.length>0){
                      arr2.push({
                        iid: response[0].iid,
                        key: response[0].key,
                        time: next,
                        next: time,
                        value: "ACTIVE",
                        "isPlanned": false
                      })
                    }
                    const arr1 = [
                      {
                        iid: response[0].iid,
                        key: response[0].key,
                        time: start_date,
                        next: next,
                        value: "STOPPED",
                        "isPlanned": false
                      }
                    ]
                    response = [...arr1,...arr2,...response];
                  }
                  
                  // console.log('resu',response);
                } 
              // console.log(response,"response.dataresponse.data")
              
              // console.log(val.is_status_signal_available,sort_outages,'machinestatussignal',response);
              let Outages = getOutages(response,sort_outages) 
              
              let Final_result={final_result:[],dTime:0,houryDowntime:{},onlyplaneddt:0}
              if (Outages.final_outages.length > 0) {
                 Final_result = getFinal_result(Outages.final_outages) 
                //  console.log(Outages,"final_outages13th",Final_result.final_result)
                 tempFunc(Outages.final_outages) 
              }
              // console.log(Final_result.dTime,"Final_result.dTime3")

            // console.log("13th",temp[1].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))),"Active",temp[0].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))))
           return  { raw: filterIntervals(Final_result.final_result), data: temp, dTime: Final_result.dTime, totalDTime: totalDTime, reasons: Outages.reasons, status: checkStatus,hourlyDowntime: Final_result.houryDowntime,isLong:isLong,onlyplaneddt:Final_result.onlyplaneddt }
           } else {
            
            let arr1 =[]  
            if(partStatus && partStatus[0].data.length>0){
              
              
              let diff = moment.duration(moment(partStatus[0].data[partStatus[0].data.length - 1].time).diff(moment(start_date))).asSeconds()
              let lastdiff = moment.duration(moment(end_date).diff(moment(partStatus[0].data[0].time))).asSeconds()
              if(lastdiff > val.mic_stop_duration){ 
                let Lastarr = [
                  {
                    iid: partStatus[0].data[0].iid,
                    key: partStatus[0].data[0].key,
                    time: moment(partStatus[0].data[0].time).format('YYYY-MM-DDTHH:mm:ss'),
                    next: end_date,
                    value: partStatus[0].data[0].value ? 0 : 1 ,
                    "isPlanned": false
                  }
                ]
                arr1 = [...Lastarr,...arr1]
              }
              if(diff > val.mic_stop_duration ){ 
                let firstarr = [
                  {
                    iid: partStatus[0].data[0].iid,
                    key: partStatus[0].data[0].key,
                    time: start_date,
                    next: moment(partStatus[0].data[partStatus[0].data.length - 1].time).format('YYYY-MM-DDTHH:mm:ss'),
                    value: partStatus[0].data[0].value ? 0 : 1 ,
                    "isPlanned": false
                  }
                ]
                arr1 = [...firstarr,...arr1]
              } 
              // console.log(val.is_status_signal_available,sort_outages,'machinestatussignal',arr1);
              
              // console.log(arr1,outages,"outages",diff,val.mic_stop_duration,cycle_time,partStatus[0].data)
            }
            let Outages = getOutages(arr1,sort_outages)  
              // console.log(final_outages,"final_outages")
              let Final_result={final_result:[],dTime:0,houryDowntime:{},onlyplaneddt:0}
              if (Outages.final_outages.length > 0) {
                Final_result = getFinal_result(Outages.final_outages)  
                tempFunc(Outages.final_outages) 
              }
              // console.log(Final_result.dTime,"Final_result.dTime4")
            
            // console.log(temp[1].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))),"Active",temp[0].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))),"14th")
            // return { raw: final_result, data: (temp[0].data.length > 0 || temp[1].data.length > 0) ? temp : [], dTime: dTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime }
            // return { raw: [], data: response, dTime: 0, totalDTime: 0,reasons: [],  status: 'IDLE',hourlyDowntime: {}}
            return { raw: filterIntervals(Final_result.final_result), data: (temp[0].data.length > 0 || temp[1].data.length > 0) ? temp : [], dTime: Final_result.dTime, totalDTime: totalDTime, reasons: Outages.reasons, status: checkStatus,hourlyDowntime: Final_result.houryDowntime ,isLong,isLong,onlyplaneddt:Final_result.onlyplaneddt}
          }
        } else {
          return { raw: [], data: response, dTime: 0, totalDTime: 0,reasons: [],  status: 'IDLE',hourlyDowntime: {},isLong:isLong,onlyplaneddt:0}
        } 
      })
      .catch((e) => {
        console.log(e,"Error at AssetStatus")
        return  null
        
      })
  };

  var getFinal_result =(final_outages)=>{
    // console.log(final_outages,"final_outagesEntry")
    const filtered_outages = filterIntervals(final_outages);
    let final_result = [];
    let dTime = 0
    let houryDowntime = {}
    let dateTimeKey 
    let onlyplaneddt = 0
    const unique = filtered_outages.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v) === JSON.stringify(v2))) === i); //remove duplicate
      const result1 = unique.filter(x => Object.keys(x).length > 0) //remove empty object
      const result = result1.filter(y => y.time !== y.next) //remove if start and end is same
      
      result.sort((a, b) => new Date(b.time) - new Date(a.time));
      const sortedResult = result;
      final_result = sortedResult;
      // console.log(final_result,"final_outages",unique)
       // sorting based on time in descending
      final_result.forEach(x => {
        let diffinsec = 0
          if (x.value !== 'ACTIVE' && x.reason ) {
            // console.log('reason',x.reason, x.include_in_oee)
            diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
            if(!x.isPlanned){
              dTime = dTime + diffinsec
            }else{
              onlyplaneddt = onlyplaneddt + diffinsec
            }
           

            let starthour = moment(x.time).startOf('hour');
            let endhour = moment(x.next).startOf('hour');
            var hoursDiff2 = (endhour - starthour) / 3600000;
            // checking downtime lies between same hour
            let HHformat = isLongRange ? "00" : "HH"

            if (hoursDiff2 === 0) {   // it will work for same hour
              dateTimeKey = moment(x.time).format(`YYYY-MM-DDT${HHformat}:00`)

              if (houryDowntime.hasOwnProperty(dateTimeKey)) { // dd/mm/yyyy hh:mm  key is same add downtime 

                houryDowntime[dateTimeKey] += ((new Date(x.next) - new Date(x.time)) / 1000)
              } else {
                houryDowntime[dateTimeKey] = ((new Date(x.next) - new Date(x.time)) / 1000)

              }

            } else {
              // implemented for loop to check the downtime has inbetween hours
              for (let i = 0; i < hoursDiff2 + 1; i++) {
                const timestamp = Date.parse(x.time); // Parse the date string and get the timestamp
                const dateObject = new Date(timestamp); // Create a Date object from the timestamp
                const hours = dateObject.getHours(); // Get the hours from the Date object
                starthour = moment(x.time).format(`YYYY-MM-DD ${hours + i}:mm:ss`)
                endhour = moment(x.time).format(`YYYY-MM-DD ${hours + i + 1}:00`)

                let nextDate = moment(x.next).format(`YYYY-MM-DD HH:mm:ss`)

                let secDiff = 0;
                dateTimeKey = moment(x.time).format(`YYYY-MM-DDT${isLongRange ? HHformat : hours + i }:00`)


                if(moment(nextDate)<moment(endhour)){

                  let nextDate1 = moment(x.next).format(`YYYY-MM-DD HH:00:00`)
                  secDiff = (Date.parse(nextDate) -  Date.parse(nextDate1)) / 1000;
                  dateTimeKey = moment(x.next).format(`YYYY-MM-DDT${HHformat}:00`)


                }else{
                   secDiff = (moment(endhour).startOf('minute') - moment(starthour).startOf('minute')) / 1000;

                }
            
                if (houryDowntime.hasOwnProperty(dateTimeKey)) {
                  // If it does, add the diffinsec value to the existing value
                  houryDowntime[dateTimeKey] += secDiff;
                } else {
                  houryDowntime[dateTimeKey] = secDiff;
                }
              

              }


            }
          }
          if (x.value !== 'ACTIVE' && !x.reason) {
            diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
            dTime = dTime + diffinsec
          }
      })
      
      // console.log("dateTimeKeydTime", dTime, houryDowntime,final_result)
      // console.log( {final_result:final_result,dTime:dTime,houryDowntime:houryDowntime,onlyplaneddt:onlyplaneddt},"exit")
      return {final_result:final_result,dTime:dTime,houryDowntime:houryDowntime,onlyplaneddt:onlyplaneddt}
      
  }
  
  var getOutages =(data,sort_outages)=>{
    let final_outages = [];
    let reasons = [];
    try {
      // console.log(data,"sort_outages",sort_outages)
      data.forEach((tempval,i) => {
        let tempCount = 0
        if (sort_outages && sort_outages.length > 0) {
          sort_outages.forEach((x, index, arr) => {
            
            if ( moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && !x.end_dt ) {
              // console.log("1st",tempval.time,tempval.next,x.start_dt,x.end_dt)
              tempCount = tempCount + 1;
              let tempObj = {};
              tempObj.time = x.start_dt;
              tempObj.next = tempval.next;
              tempObj.reason = x.prod_reason.id;
              tempObj.reason_name = x.prod_reason.reason;
              tempObj.comments = x.comments;
              tempObj.outageid = x.id
              tempObj.reason_tags = x.reason_tags
              reasons.push(x.prod_reason.reason);
              tempObj.include_in_oee = x.prod_reason.include_in_oee
              tempObj.value = tempval.value;
              tempObj.iid = tempval.iid;
              tempObj.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              final_outages.push(tempObj);
            }
            // For no signal downtime reason
            if ( moment(tempval.time).isBetween(moment(x.start_dt), moment(x.end_dt)) && moment(tempval.next).isBetween(moment(x.start_dt), moment(x.end_dt)) ) {
          //  console.log("2nd",tempval.time,tempval.next,x.start_dt,x.end_dt)
              tempCount = tempCount + 1;
              let tempObj = {};
              tempObj.time = tempval.time;
              tempObj.next = tempval.next;
              tempObj.reason = x.prod_reason.id;
              tempObj.reason_name = x.prod_reason.reason;
              tempObj.comments = x.comments;
              tempObj.outageid = x.id
              tempObj.reason_tags = x.reason_tags
              reasons.push(x.prod_reason.reason);
              tempObj.include_in_oee = x.prod_reason.include_in_oee
              tempObj.value = tempval.value;
              tempObj.iid = tempval.iid;
              tempObj.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              final_outages.push(tempObj);
            }
            if (moment(x.start_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.time).format("YYYY-MM-DDTHH:mm:ss") && moment(x.end_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.next).format("YYYY-MM-DDTHH:mm:ss") ) {
            //  console.log("3rd",tempval.time,tempval.next,x.start_dt,x.end_dt)
              tempCount = tempCount + 1;
              let tempObj = {};
              tempObj.time = x.start_dt;
              tempObj.next = x.end_dt;
              tempObj.reason = x.prod_reason.id;
              tempObj.reason_name = x.prod_reason.reason;
              tempObj.comments = x.comments;
              tempObj.outageid = x.id
              tempObj.reason_tags = x.reason_tags
              reasons.push(x.prod_reason.reason);
              tempObj.include_in_oee = x.prod_reason.include_in_oee
              tempObj.value = tempval.value;
              tempObj.iid = tempval.iid;
              tempObj.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              final_outages.push(tempObj);
            }
            if (moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
              // console.log("4th",tempval.time,tempval.next,x.start_dt,x.end_dt)
              tempCount = tempCount + 1;
              let splitedobj1 = {};
              let splitedobj2 = {};
              let splitedobj3 = {};
              splitedobj2.time = x.start_dt;
              splitedobj2.next = x.end_dt;
              splitedobj2.reason = x.prod_reason.id
              splitedobj2.reason_name = x.prod_reason.reason;
              splitedobj2.comments = x.comments;
              splitedobj2.outageid = x.id
              splitedobj2.reason_tags = x.reason_tags
              reasons.push(x.prod_reason.reason);
              splitedobj2.include_in_oee = x.prod_reason.include_in_oee
              splitedobj2.value = tempval.value;
              splitedobj2.iid = tempval.iid;
              splitedobj2.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              if (arr[index - 1] && moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                splitedobj1.time = arr[index - 1].end_dt;
                splitedobj1.next = x.start_dt;
                splitedobj1.value = tempval.value;
                splitedobj1.iid = tempval.iid;
              } else {
                splitedobj1.time = tempval.time;
                splitedobj1.next = x.start_dt;
                splitedobj1.value = tempval.value;
                splitedobj1.iid = tempval.iid;
              }
              splitedobj1.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                splitedobj3.time = x.end_dt;
                splitedobj3.next = arr[index + 1].start_dt;
                splitedobj3.value = tempval.value;
                splitedobj3.iid = tempval.iid;
              } else {
                splitedobj3.time = x.end_dt;
                splitedobj3.next = tempval.next;
                splitedobj3.value = tempval.value;
                splitedobj3.iid = tempval.iid;
              }
              splitedobj3.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              final_outages.push(splitedobj1)
              final_outages.push(splitedobj2)
              final_outages.push(splitedobj3)
            }
            // console.log(new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString(),"ReasonCheck",x.start_dt,moment(tempval.time).format("YYYY-MM-DDTHH:mm:ssZ"),"x.end_dt",x.end_dt,i)
            if (new Date(x.start_dt).toISOString() === new Date(moment(tempval.time).format("YYYY-MM-DDTHH:mm:ssZ")).toISOString() && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
          //  console.log("5th",tempval.time,tempval.next,x.start_dt,x.end_dt)
              tempCount = tempCount + 1;
              let splitedobj1 = {};
              let splitedobj2 = {};
              splitedobj1.time = x.start_dt;
              splitedobj1.next = x.end_dt;
              splitedobj1.reason = x.prod_reason.id
              splitedobj1.reason_name = x.prod_reason.reason;
              splitedobj1.comments = x.comments;
              splitedobj1.outageid = x.id
              splitedobj1.reason_tags = x.reason_tags
              reasons.push(x.prod_reason.reason);
              splitedobj1.include_in_oee = x.prod_reason.include_in_oee
              splitedobj1.value = tempval.value;
              splitedobj1.iid = tempval.iid;
              splitedobj1.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                splitedobj2.time = x.end_dt;
                splitedobj2.next = arr[index + 1].end_dt;
              } else {
                splitedobj2.time = x.end_dt;
                splitedobj2.next = tempval.next;
              }
              splitedobj2.value = tempval.value;
              splitedobj2.iid = tempval.iid;
              splitedobj2.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              // console.log(splitedobj1,"splitedobj2",splitedobj2)
              final_outages.push(splitedobj1)
              final_outages.push(splitedobj2)
            }
            if (moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
            //  console.log("6th",tempval.time,tempval.next,x.start_dt,x.end_dt)
              tempCount = tempCount + 1;
              let splitedobj1 = {};
              let splitedobj2 = {};
              splitedobj2.time = x.start_dt;
              splitedobj2.next = x.end_dt;
              splitedobj2.reason = x.prod_reason ? x.prod_reason.id : "0"
              splitedobj2.reason_name = x.prod_reason ? x.prod_reason.reason : "";
              splitedobj2.comments = x.comments;
              splitedobj2.outageid = x.id
              splitedobj2.reason_tags = x.reason_tags
              reasons.push(x.prod_reason.reason);
              splitedobj2.include_in_oee = x.prod_reason.include_in_oee
              splitedobj2.value = tempval.value;
              splitedobj2.iid = tempval.iid;
              splitedobj2.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              if (arr[index - 1] && moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                splitedobj1.time = arr[index - 1].end_dt;
                splitedobj1.next = x.start_dt;
                splitedobj1.value = tempval.value;
                // console.log("if")
              } else {
                splitedobj1.time = tempval.time;
                splitedobj1.next = x.start_dt;
                splitedobj1.value = tempval.value;
              }
              splitedobj1.iid = tempval.iid;
              splitedobj1.isPlanned = x.prod_reason.prod_reason_type.reason_type === 'Planned Downtime' ? true : false;
              final_outages.push(splitedobj2)
              final_outages.push(splitedobj1)
            }
          })
        }
        if (tempCount === 0) {
          final_outages.push(tempval); 
        }
      })
      const unique = final_outages.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v) === JSON.stringify(v2))) === i); //remove duplicate
      const result1 = unique.filter(x => Object.keys(x).length > 0) //remove empty object
      const result = result1.filter(y => y.time !== y.next) //remove if start and end is same
      // result = result.filter
      // console.log({final_outages:filterIntervals(result),reasons:reasons},'ExitOutage')
      return {final_outages:result,reasons:reasons}
    } catch (err) {
     
      return {final_outages:[],reasons:[]};
    }
  }
  function filterIntervals(arr) {
    const map = new Map();
  
    arr.forEach(item => {
      const key = `${item.time}_${item.next}`;
      if (!map.has(key)) {
        map.set(key, item);
      } else {
        const existing = map.get(key);
        // Prefer the one with a reason
        if (!existing.reason && item.reason) {
          map.set(key, item);
        }
        // If both have or both don't have a reason, keep the first (already set)
      }
    });
  
    return Array.from(map.values());
  }
  var mode = a => {
    a = a.slice().sort((x, y) => x - y);

    var bestStreak = 1;
    var bestElem = a[0];
    var currentStreak = 1;
    var currentElem = a[0];

    for (let i = 1; i < a.length; i++) {
      if (parseInt(a[i - 1]) !== parseInt(a[i])) {
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
          bestElem = currentElem;
        }

        currentStreak = 0;
        currentElem = a[i];
      }

      currentStreak++;
    }
    
    return currentStreak > bestStreak ? currentElem : bestElem;
  };
  return { partLoading, partData, partError, getPartsCompleted };
};



export default usePartSignalStatus;