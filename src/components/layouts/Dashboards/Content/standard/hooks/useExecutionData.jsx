import { useState } from "react";
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries";
import moment from "moment";
const useExecutionData = () => {
  const [ExecutionLoading, setLoading] = useState(false);
  const [ExecutionData, setData] = useState(null);
  const [ExecutionError, setError] = useState(null);

  const getExecution = async (schema, instrument_id, metric_name, start_date, end_date,val) => {
    setLoading(true);
    const body = {
      schema: schema,
      iid: instrument_id,
      key: metric_name,
      from: start_date, 
      to: end_date
    } 
    const url = "/dashboards/getdryermachinestatus";
    await configParam.RUN_REST_API(url, body)
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
                let outages = await configParam.RUN_GQL_API(gqlQueries.getDowntimeWithReasons, { asset_id: val.entity_id, from: start_date, to: end_date })
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
                   
                    if (x.value === 'Active') {
                      temp[0].data.push({
                        x: 'Range',
                        y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                      })
                    }
                    else {
                     
                      diffinsec = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asSeconds());
                      totalDTime = totalDTime + diffinsec
                      temp[1].data.push({
                        x: 'Range',
                        y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                      })
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
                          return <></>
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
                 let sortArr = result.sort((a, b) => new Date(b.time) - new Date(a.time))
                  final_result = sortArr; // sorting based on time in descending
                  final_result.forEach(x=>{
                    let diffinsec = 0 
                  
                      if(x.value !== 'Active' && x.reason &&  x.include_in_oee){
                        diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                        dTime = dTime + diffinsec
                      }
                      if(x.value !== 'Active' && !x.reason){
                        diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                        dTime = dTime + diffinsec
                      } 
                  })
                }
                setData([{ raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime,reasons:reasons }])
              } else {
                setData([{ raw: [], data: response.data, dTime: 0, totalDTime: 0 }]);
              } 
              
            
        } else {
          setData(null);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
        setData(null);
      });
  }; 
  return { ExecutionLoading, ExecutionData, ExecutionError, getExecution };
};

export default useExecutionData;