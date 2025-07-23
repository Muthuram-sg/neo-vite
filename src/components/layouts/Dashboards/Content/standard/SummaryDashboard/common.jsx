import configParam from "config";
import gqlQueries from "components/layouts/Queries"
import moment from 'moment';
function cycleTime(asset,start_date,end_date,token,lineid){
    return configParam.RUN_GQL_API(gqlQueries.getExecCycleTime, { asset_id: asset, from: start_date, to: end_date },token,lineid)
        .then((oeeData) => {
          if (oeeData !== undefined && oeeData.neo_skeleton_prod_exec && oeeData.neo_skeleton_prod_exec.length > 0) {
            let cycleTimes = 3600 / parseInt(oeeData.neo_skeleton_prod_exec[0].prod_order.prod_product.unit) 
            return { jobStart: oeeData.neo_skeleton_prod_exec[0].start_dt, jobEnd: oeeData.neo_skeleton_prod_exec[0].end_dt, cycleTime: cycleTimes }
          } else {
            return { cycleTime: 0 }
          }
        })
        .catch((e) => {
          return e;
        });
}
async function getPartsCompleted(val,start, end,token,lineid){  
    const body = {
      schema: val.entity.line.schema,
      instrument_id: val.part_signal_instrument,
      metric_name: val.metric.name,
      start_date: start,
      end_date: end,
      binary: val.is_part_count_binary,
      downfall: val.is_part_count_downfall
    }
    const url = "/dashboards/actualPartSignal";
    return configParam.RUN_REST_API(url, body,token,lineid)
      .then(async (response) => {                   
        let parts = response.data; 
        // console.log("PARTS DATA",parts)
        if (response && !response.errorTitle && parts.length > 0) {
          let diff = [];
          for (let i = 1; i < parts.length; i++) {
            let actDiff = new Date(parts[i - 1].time) / 1000 - new Date(parts[i].time) / 1000
            if(actDiff > 0){diff.push(actDiff)}
            // console.log (diff, "PARTS COMPLETED")
          }
          const param = {
            entity_id: val.entity_id,
            from: start,
            to: end
          };
          await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param,token,lineid)
            .then((reasonsData) => {
              if (reasonsData && reasonsData.neo_skeleton_prod_quality_defects && reasonsData.neo_skeleton_prod_quality_defects.length > 0) {
                let defects = reasonsData.neo_skeleton_prod_quality_defects;
                defects.forEach(x => {
                  const defected = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.marked_at).toISOString())
                  if (defected >= 0) {
                    parts[defected]['defect'] = true;
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

            })
          // parts = [...parts]
          return { data: parts, actCycleTime: mode(diff), cycleTime: mode(diff.slice(0, Math.min(20, diff.length))) }
        } else {
          return { data: parts }
        }
      })
      .catch((e) => {
        return e
      });
}
const mode = a => {
  a = a.slice().sort((x, y) => x - y);

  let bestStreak = 1;
  let bestElem = a[0];
  let currentStreak = 1;
  let currentElem = a[0];

  for (let i = 1; i < a.length; i++) {
    if (a[i - 1] !== a[i]) {
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
const getPartsPerHour = async (val, start_date, end_date,token,lineid) => {
  let dressMetric 
  if(val.metricByDressingSignal === null ){
    dressMetric =''
  }else if(val.metricByDressingSignal.name === null){
    dressMetric =''
  }else{
    dressMetric = val.metricByDressingSignal.name
  }
  const body = {
    schema: val.entity.line.schema,
    instrument_id: val.part_signal_instrument,
    metric_name: val.metric.name,
    start_date: start_date,
    dress_metric: dressMetric,
    dress_prog:  val.dressing_program === null ? "" : val.dressing_program,
    end_date: end_date,
    binary: val.is_part_count_binary,
    downfall: val.is_part_count_downfall
  }
  const url = "/dashboards/actualPartSignalPerHour";
   await configParam.RUN_REST_API(url, body,token,lineid)
    .then((response) => {
      if (response && !response.errorTitle) {
        return response.data;
      } else {
        return [];
      }
    })
    .catch((e) => {
      return []
    });
};
function getAssetStatus(val,start_date,end_date,token,lineid){
  const body = {
    schema: val.entity.line.schema,
    instrument_id: val.machine_status_signal_instrument,
    metric_name: val.metricByMachineStatusSignal.name,
    start_date: start_date,
    end_date: end_date,
    mic_stop: val.mic_stop_duration,
    active_signal: val.is_status_signal_available,
    downfall: val.is_part_count_downfall
  }
  const url = "/dashboards/machinestatussignal";
  return configParam.RUN_REST_API(url, body,token,lineid)
    .then(async (response) => {
      if (response && !response.errorTitle) {
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
        if (response.data.length > 0) {
          let dTime = 0
          let totalDTime = 0
          let outages = await configParam.RUN_GQL_API(gqlQueries.getDowntimeWithReasons, { asset_id: val.entity_id, from: start_date, to: end_date },token,lineid)
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
          response.data.forEach((x, i) => {
            let diffinsec = 0
            
            if (!val.is_status_signal_available) {
              
              diffinsec = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asSeconds());
              totalDTime = totalDTime + diffinsec
              if (i !== (response.data.length - 1)) {
                temp[0].data.push({
                  x: 'Range',
                  y: [new Date(x.next).getTime(), new Date(response.data[i + 1].time).getTime()]
                })
              }
              temp[1].data.push({
                x: 'Range',
                y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
              })
            }
            else {
              if (x.value === 'ACTIVE') {
                temp[0].data.push({
                  x: 'Range',
                  y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                })
              }
              else {
               
                diffinsec = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asSeconds());
                // console.log(x.next,x.time,"x.nextx.nextelse",diffinsec)
                totalDTime = totalDTime + diffinsec
                temp[1].data.push({
                  x: 'Range',
                  y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                })
              }
            }
          })
          let sort_outages = outages.sort((a, b) => new Date(a.start_dt) - new Date(b.start_dt));
          let final_outages = [];
          let reasons = [];
          try {
            response.data.forEach((tempval) => {
              let tempCount = 0
              if(sort_outages && sort_outages.length>0){
                sort_outages.forEach((x, index, arr) => {
                  if (new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString() && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
                    tempCount = tempCount + 1;
                    let tempObj = {};
                    tempObj.time = x.start_dt;
                    tempObj.next = x.end_dt;
                    tempObj.reason = x.prod_reason.id;
                    tempObj.comments = x.comments;
                    tempObj.outageid =x.id
                    tempObj.reason_tags = x.reason_tags
                    reasons.push(x.prod_reason.reason);
                    tempObj.include_in_oee = x.prod_reason.include_in_oee
                    tempObj.value = tempval.value;
                    final_outages.push(tempObj);
                  }
                  if (moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                    tempCount = tempCount + 1;
                    let splitedobj1 = {};
                    let splitedobj2 = {};
                    let splitedobj3 = {};
                    splitedobj2.time = x.start_dt;
                    splitedobj2.next = x.end_dt;
                    splitedobj2.reason = x.prod_reason.id 
                    splitedobj2.comments = x.comments;
                    splitedobj2.outageid =x.id
                    splitedobj2.reason_tags = x.reason_tags
                    reasons.push(x.prod_reason.reason);
                    splitedobj2.include_in_oee = x.prod_reason.include_in_oee
                    splitedobj2.value = tempval.value;
                    if (arr[index - 1] && moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                      splitedobj1.time = arr[index - 1].end_dt;
                      splitedobj1.next = x.start_dt;
                      splitedobj1.value = tempval.value;
                    } else {
                      splitedobj1.time = tempval.time;
                      splitedobj1.next = x.start_dt;
                      splitedobj1.value = tempval.value;
                    }
                    if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                      splitedobj3.time = x.end_dt;
                      splitedobj3.next = arr[index + 1].start_dt;
                      splitedobj3.value = tempval.value;
                    } else {
                      splitedobj3.time = x.end_dt;
                      splitedobj3.next = tempval.next;
                      splitedobj3.value = tempval.value;
                    }
                    final_outages.push(splitedobj1)
                    final_outages.push(splitedobj2)
                    final_outages.push(splitedobj3)
                  }
                  if (new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString() && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                    tempCount = tempCount + 1;
                    let splitedobj1 = {};
                    let splitedobj2 = {};
                    splitedobj1.time = x.start_dt;
                    splitedobj1.next = x.end_dt;
                    splitedobj1.reason = x.prod_reason.id
                    splitedobj1.comments = x.comments;
                    splitedobj1.outageid =x.id
                    splitedobj1.reason_tags = x.reason_tags
                    reasons.push(x.prod_reason.reason);
                    splitedobj1.include_in_oee = x.prod_reason.include_in_oee
                    splitedobj1.value = tempval.value;
                    if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                      splitedobj2.time = x.end_dt;
                      splitedobj2.next = arr[index + 1].start_dt;
                    } else {
                      splitedobj2.time = x.end_dt;
                      splitedobj2.next = tempval.next;
                    }
                    splitedobj2.value = tempval.value;
                    final_outages.push(splitedobj1)
                    final_outages.push(splitedobj2)
                  }
                  if (moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
                    tempCount = tempCount + 1;
                    let splitedobj1 = {};
                    let splitedobj2 = {};
                    splitedobj2.time = x.start_dt;
                    splitedobj2.next = x.end_dt;
                    splitedobj2.reason = x.prod_reason?x.prod_reason.id:"0"
                    splitedobj2.comments = x.comments;
                    splitedobj2.outageid =x.id
                    splitedobj2.reason_tags = x.reason_tags
                    reasons.push(x.prod_reason.reason);
                    splitedobj2.include_in_oee = x.prod_reason.include_in_oee
                    splitedobj2.value = tempval.value;
                    if (arr[index - 1] && moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                      console.log('empty')
                    } else {
                      splitedobj1.time = tempval.time;
                      splitedobj1.next = x.start_dt;
                      splitedobj1.value = tempval.value;
                    }
                    final_outages.push(splitedobj2)
                    final_outages.push(splitedobj1)
                  }
                })
              }
              if (tempCount === 0) {
                final_outages.push(tempval);
              }
            })
          } catch (err) {
            final_outages = [];
          }
          let final_result = [];
          if (final_outages.length > 0) { 
            const unique = final_outages.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v) === JSON.stringify(v2))) === i); //remove duplicate
            const result1 = unique.filter(x => Object.keys(x).length > 0) //remove empty object
            const result = result1.filter(y => y.time !== y.next) //remove if start and end is same
            const sortedResult = [...result].sort((a, b) => new Date(b.time) - new Date(a.time));
            final_result = sortedResult; // sorting based on time in descending
            final_result.forEach(x=>{
              let diffinsec = 0
              if (!val.is_status_signal_available) {
                if(x.reason && x.include_in_oee){ 
                  diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                  dTime = dTime + diffinsec
                }
                if(!x.reason){ 
                  diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                  dTime = dTime + diffinsec
                }
              }else{
                if(x.value !== 'ACTIVE' && x.reason &&  x.include_in_oee){
                  console.log('reason',x.reason, x.include_in_oee)
                  diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                  dTime = dTime + diffinsec
                }
                if(x.value !== 'ACTIVE' && !x.reason){
                  diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                  dTime = dTime + diffinsec
                }
              }
            })
          }
          return { raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime,reasons:reasons }
        } else {
          return { raw: [], data: response.data, dTime: 0, totalDTime: 0 }
        }
      } else {
        return { raw: [], data: response, dTime: 0, totalDTime: 0 }
      }
    })
    .catch((e) => {
      return e;
    });
}
function getQualityDefects(val,start_date,end_date,token,lineid){
  return configParam.RUN_GQL_API(gqlQueries.getAssetQualityDefects, { asset_id: val.entity_id, from: start_date, to: end_date },token,lineid)
          .then((oeeData) => {
              if (oeeData !== undefined && oeeData.neo_skeleton_prod_quality_defects) {
                  let qualityLoss = 0
                  let reason = [];
                  oeeData.neo_skeleton_prod_quality_defects.forEach((value) => {
                      qualityLoss = qualityLoss + parseInt(value.quantity)
                      reason.push(value.prod_reason.reason);
                  })
                  return { data: oeeData.neo_skeleton_prod_quality_defects, loss: qualityLoss,reasons: reason }
              }
              else{
                return { data: [], loss: 0,reasons: [] }
              }
          })
          .catch((e) => {
              return e;
          });
}
const get_aggregated_oee_value = (oeeObject) => {
  let avail = 0
  let qual = 0
  let availLoss = 0
  let perf = 0
  let perf_num = 0
  let runTime = 0
  let downTime = 0
  let expParts = 0
  let targetedParts=0
  let perfLoss = 0
  let qualLoss = 0
  let actParts = 0
  let Planned_Downtime = 0
  let Total_Duration = 0
  let qualdefects = 0
  let Unplanned_Downtime = 0
  let Total_Parts = 0
  
  // eslint-disable-next-line array-callback-return
  oeeObject.total_duration.map((val, index) => {

    let exp_cycle_time = oeeObject.job_cycleTime[index] !== 0 ? oeeObject.job_cycleTime[index] : oeeObject.mode_cycleTime[index]
    let total_secs = val
    Total_Duration = Total_Duration + val
    let total_planned_dt = oeeObject.total_dt[index] - oeeObject.total_unplanned_dt[index]
    Planned_Downtime = Planned_Downtime + total_planned_dt
    Unplanned_Downtime = Unplanned_Downtime + oeeObject.total_unplanned_dt[index]
    downTime = downTime + oeeObject.total_dt[index]
    availLoss = availLoss + oeeObject.total_unplanned_dt[index]
    perf_num = perf_num + ((total_secs - Number(oeeObject.total_dt[index])) / exp_cycle_time)
    runTime = runTime + (total_secs - oeeObject.total_dt[index])
    
    expParts =  ((total_secs - total_planned_dt) / exp_cycle_time)
    targetedParts = targetedParts + ((total_secs - oeeObject.total_dt[index]) / exp_cycle_time)
    Total_Parts = Total_Parts + oeeObject.total_parts[index]
    perfLoss = perfLoss + (((expParts - oeeObject.total_parts[index]) * exp_cycle_time) - oeeObject.total_unplanned_dt[index])
    qualLoss = qualLoss + (oeeObject.quality_defects[index] * exp_cycle_time)
    actParts = actParts + oeeObject.total_parts[index]
    qualdefects = qualdefects + Number(oeeObject.quality_defects[index])
  })


  avail = 1 - (Unplanned_Downtime / (Total_Duration - Planned_Downtime))
  qual = 1 - (qualdefects / Total_Parts)
  perf = Total_Parts / perf_num
  avail = isNaN(avail) || !isFinite(avail) || !avail ? 0 : avail;
  perf = isNaN(perf) || !isFinite(perf) || !perf ? 0 : perf;
  qual = isNaN(qual) || !isFinite(qual) || !qual ? 0 : qual;

  return {availability: avail, performance: perf, quality: qual, oee: avail * perf * qual, availLoss: availLoss, perfLoss: perfLoss, qualLoss: qualLoss, qualdefects: qualdefects, expParts: targetedParts, actParts: actParts, actcycle: oeeObject.part_act_cycle_time, expSetup: 0, actSetup: 0, runTime: runTime, downTime: downTime }
  
}
const Common = {
    cycleTime: cycleTime,
    getPartsCompleted: getPartsCompleted,
    getPartsPerHour:getPartsPerHour,
    getAssetStatus: getAssetStatus,
    getQualityDefects: getQualityDefects,
    get_aggregated_oee_value: get_aggregated_oee_value
}
export default Common;