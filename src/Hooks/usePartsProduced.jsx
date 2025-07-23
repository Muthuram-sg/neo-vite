import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';
const usePartsProduced = () => {
  const [partLoading, setLoading] = useState(false);
  const [partData, setData] = useState(null);
  const [partError, setError] = useState(null);

  const getPartsCompleted = async (schema, data, start_date, end_date,isRepeat,previousData,ExeData,prevCycle) => {
    // console.log("DatesArrDatesArr",ExeData)
    let start = '';
    let end = '';
    if(isRepeat){   
      start = moment(moment().subtract(20, 'seconds')).format('YYYY-MM-DDTHH:mm:ssZ')
      end = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    }else{
      start = start_date
      end = end_date;
    }
    
    let DatesArr = [] 

     
    if(ExeData.length>0 && !isRepeat){ 
      let WOArr = []
      ExeData.forEach((d,i)=>{
        WOArr.push({...data[0],wo_start: d.jobStart, wo_end: d.jobEnd, prod_order:d.orderid,cycleTime:d.cycleTime})
      })
      DatesArr = WOArr
      DatesArr.sort((a, b) => new Date(b.wo_start) - new Date(a.wo_start));
    }else{
      DatesArr = data
    }
    
    // console.log(DatesArr,"DatesArrDatesArr")
    Promise.all(DatesArr.map(async (val) => {
      setLoading(true);
      const body = {
        schema: schema,
        instrument_id: val.part_signal_instrument,
        metric_name: val.metric.name,
        start_date: val.wo_start ? val.wo_start : start,
        end_date: val.wo_end ? val.wo_end : end,
        binary: val.is_part_count_binary,
        downfall: val.is_part_count_downfall
      }
      // console.log(body,WODiff,selectDiff,"bodybody",data)
      
      const url = "/dashboards/actualPartSignal";
      return configParam.RUN_REST_API(url, body)
        .then(async (response) => {                 
          let resData = response.data ? response.data : []
          let parts = isRepeat? [...previousData,...resData]: resData; 
          if (response && !response.errorTitle && parts.length > 0) {
            let diff = [];
            for (let i = 1; i < parts.length; i++) {
              let actDiff = new Date(parts[i - 1].time) / 1000 - new Date(parts[i].time) / 1000
              let object = parts[i-1];
              object.cycleTime = 0;
              if(actDiff > 0){
                diff.push(actDiff)
                object.cycleTime = actDiff.toFixed(0);
                
                parts[i-1] = object
              }
            }
            
            const actCycletime = mode(diff),stdCycletime = mode(diff.slice(0, Math.min(20, diff.length)));
            diff.push(actCycletime)
            parts[parts.length-1].cycleTime = parseInt(actCycletime);
            const param = {
              entity_id: val.entity_id ? val.entity_id  : '',
              from: start_date,
              to: end_date
            };
            await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param)
              .then((reasonsData) => {
                if (reasonsData && reasonsData.neo_skeleton_prod_quality_defects && reasonsData.neo_skeleton_prod_quality_defects.length > 0) {
                  let defects = reasonsData.neo_skeleton_prod_quality_defects;
                  defects.forEach(x => {
                    const defected = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.marked_at).toISOString())
                    if (defected >= 0) {
                      parts[defected]['defect'] = true;
                      parts[defected]['reason'] = x.prod_reason.id;
                      parts[defected]['reason_name'] = x.prod_reason.reason;
                    }
                  })
                  parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                  
                } else {
                  parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                }
                if (reasonsData && reasonsData.neo_skeleton_prod_part_comments && reasonsData.neo_skeleton_prod_part_comments.length > 0) {
                  let comments = reasonsData.neo_skeleton_prod_part_comments;
                  comments.forEach(x => {
                    const commented = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.part_completed_time).toISOString())
                    if (commented >= 0) {
                    let savedcomments = ""
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
                // console.log({ data: parts, actCycleTime: actCycletime, cycleTime: stdCycletime, rejectedParts: rejectedParts},"partsparts") 
                let ExeCycle = ExeData.length > 0 ? val.cycleTime : stdCycletime
                let STDCycle = (isRepeat && ExeData.length > 0) ? prevCycle : ExeCycle
            return { data: parts, actCycleTime: actCycletime, cycleTime: STDCycle, rejectedParts: rejectedParts, prod_order: val.prod_order ? val.prod_order : null, total_time: diff.map(t=> t).reduce((a,b)=> a+b,0)}  
          } else {
            return { data: parts, actCycleTime: 0, cycleTime: 0, rejectedParts: [], prod_order: null, total_time: 0}
          } 
        })
        .catch((e) => {
          return e
        });
    }))
      .then(Finaldata => { 
        // console.log(Finaldata,"FinaldataFinaldata",ExeData,isRepeat)
        if(ExeData.length > 0 && !isRepeat){
          let actCycle = Finaldata.map(s=> s.total_time).reduce((a,b)=> a+b,0)
          let stdCycle = Finaldata.map(s=> (s.cycleTime * s.data.length) ).reduce((a,b)=> a+b,0)
          let TotParts = []
          let rejParts = []
          Finaldata.forEach(s=> {
            TotParts = [...TotParts,...s.data]
            rejParts = [...rejParts,...s.rejectedParts]
          })
          
          
          if(Finaldata.length > 0){
            let Finalarr = [{data: TotParts, actCycleTime: (actCycle/TotParts.length), cycleTime: (stdCycle/TotParts.length), rejectedParts: rejParts,total_time:actCycle}]
            // console.log("FinaldataFinaldata",Finalarr,actCycle,TotParts.length,stdCycle,Finaldata) 
            setData(Finalarr);
          } else{
            setData(null)
          }          
          setError(false)
        }else{
          if(Finaldata.length > 0){
            setData(Finaldata);
          } else{
            setData(null)
          }          
          setError(false)
        }
       
      })
      .catch((e) => {
        setData(e);
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      });
  };
  let mode = a => {
    a = a.slice().sort((x, y) => x - y);

    let bestStreak = 1;
    let bestElem = a[0];
    let currentStreak = 1;
    let currentElem = a[0];

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



export default usePartsProduced;