import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';

const useGetDownTime = () => {
  const [downTimeLoading, setLoading] = useState(false);
  const [downTimeData, setData] = useState(null);
  const [downTimeError, setError] = useState(null);
  const getDownTime = async (schema, data, dateRange, showMicroStop,pageindex,pagesize, energyInstrument,partData) => { 
    setLoading(true);
    Promise.all(data.map(async (val) => {
      let minmic = val.min_mic_stop_duration ? val.min_mic_stop_duration : 0
      let maxmic = val.mic_stop_duration ? val.mic_stop_duration : 0
      const body = {
        schema: schema,
        instrument_id: val.instrumentByMachineStatusSignalInstrument.id,
        metric_name: val.is_status_signal_available === true ? 'execution' : val.metricByMachineStatusSignal.name,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
        mic_stop: showMicroStop ? minmic : maxmic,
        active_signal: val.is_status_signal_available,
        downfall: val.is_part_count_downfall,
        pageindex : pageindex,
        pagesize: pagesize,
        energyInstrument: energyInstrument
      }
      let cycle_time = showMicroStop ? minmic : maxmic
      const url = "/dashboards/machinestatussignal";
      return configParam.RUN_REST_API(url, body)
        .then(async (response) => { 
          let start_date = body.start_date
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
            
            if (response.data.length === 0) { 
              
              response.data = [{
                "time": body.start_date,
                "iid": body.instrument_id,
                "key": body.metric_name,
                "value": "IDLE",
                "next": body.end_date
                }]
            }
              response.data = response.data.map(m=> {
                let partsData = []
                if(partData && partData[0].data.length>0){
                  partsData =partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(m.time),moment(m.next))) 
                }
                if(partsData.length>0 && !val.is_status_signal_available){
                  return {...m,next: moment(partsData[partsData.length-1].time).format('YYYY-MM-DDTHH:mm:ss'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss')}  
                }else{
                  return {...m,next: moment(m.next).format('YYYY-MM-DDTHH:mm:ss'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss')}
                }
                
              })
              // console.log(response.data,"response.data")
              let dTime = 0
              let totalDTime = 0
              let outages = await configParam.RUN_GQL_API(gqlQueries.getDowntimeWithReasons, { asset_id: val.entity_id, from: dateRange.startDate, to: dateRange.endDate })
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
                if(!val.is_status_signal_available){ 
                  if(moment(response.data[0].time)>moment(dateRange.startDate)){ 
                    let diff = moment.duration(moment(response.data[0].time).diff(moment(dateRange.startDate))).asSeconds()
                    let next = response.data[0].next;
                    let time = response.data[0].time
                    if(!val.is_part_count_downfall && response.data[0].value !== 0){ 
                      
                        next = cycle_time && cycle_time>0?moment(response.data[0].time).subtract(Math.ceil(cycle_time),'second').format('YYYY-MM-DDTHH:mm:ssZ'):response.data[0].next; 
                    }
                    if(val.is_part_count_downfall && response.data[0].value === 0){
                      next = cycle_time && cycle_time>0?moment(response.data[0].time).subtract(Math.ceil(cycle_time),'second').format('YYYY-MM-DDTHH:mm:ssZ'):response.data[0].next; 
                    } 
                    
                    if(diff > val.mic_stop_duration ){ 
                      let Lastpart =[]
                      if(partData && partData[0].data.length>0){
                        Lastpart =partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(dateRange.startDate),moment(next))) 
                      } 
                      next =Lastpart.length > 0 ? moment(Lastpart[Lastpart.length-1].time).format('YYYY-MM-DDTHH:mm:ss') : time
                      time = dateRange.startDate
                      
                      
                      const arr1 = [
                        {
                          iid: response.data[0].iid,
                          key: response.data[0].key,
                          time: time,
                          next: next,
                          value: response.data[0].value 
                        }
                      ]
                      response.data = [...arr1,...response.data];
                    }


                    
                  }
                  
                  let Lastpart =partData ? partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(response.data[response.data.length-1].time),moment(dateRange.endDate))) : []
                  let Lastdiff = moment.duration(moment(dateRange.endDate).diff(moment(Lastpart.length > 0 ? Lastpart[0].time : response.data[response.data.length-1].time))).asSeconds()
                  if(Lastdiff > val.mic_stop_duration){ 
                    const arr2 = [
                      {
                        iid: response.data[response.data.length-1].iid,
                        key: response.data[response.data.length-1].key,
                        time: response.data[response.data.length-1].next,
                        next: dateRange.endDate,
                        value: response.data[response.data.length-1].value 
                      }
                    ]
                    response.data = [...response.data,...arr2];
                  }
              
             
                }else{
                  if(moment(response.data[0].time)>moment(start_date)){
                    let diff = moment.duration(moment(response.data[0].time).diff(moment(start_date))).asSeconds()
                    let next = response.data[0].next;
                    let time = response.data[0].time
                    if(diff > val.mic_stop_duration){
                      let Lastpart =partData ? partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(time))) : []
                      next = Lastpart.length > 0 ? Lastpart[Lastpart.length - 1].time : response.data[0].time
                      let arr2 = []
                      if(Lastpart.length>0){
                        arr2.push({
                          iid: response.data[0].iid,
                          key: response.data[0].key,
                          time: next,
                          next: time,
                          value: "ACTIVE"
                        })
                      }
                      const arr1 = [
                        {
                          iid: response.data[0].iid,
                          key: response.data[0].key,
                          time: start_date,
                          next: next,
                          value: "STOPPED"
                        }
                      ]
                      response.data = [...arr1,...arr2,...response.data];
                    }
                    
                  } 
                }
              response.data.forEach((x, i) => {
                let diffinsec = 0
                if (!val.is_status_signal_available) {
                  diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                  totalDTime = totalDTime + diffinsec
                  if (i !== (response.data.length - 1)) {
                    temp[0].data.push({
                      x: 'Range',
                      y: [new Date(x.next).getTime(), new Date(response.data[i + 1].time).getTime()]
                    })
                    temp[1].data.push({
                      x: 'Range',
                      y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                    })
                  }
                  
                  if (i === (response.data.length - 1)) {
                    
                    let Lastpart = partData ? partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(x.time),moment(dateRange.endDate))) : []
                    let FirstNxt = Lastpart.length>0 ? Lastpart[Lastpart.length-1].time : x.next
                     temp[0].data.push({
                      x: 'Range',
                      y: [FirstNxt, moment(dateRange.endDate).valueOf()]
                    }) 
                    temp[1].data.push({
                      x: 'Range',
                      y: [new Date(x.time).getTime(), FirstNxt]
                    }) 
                    
                  } 
                }
                else {
                  if (x.value === 'ACTIVE') {
                    temp[0].data.push({
                      x: 'Range',
                      y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                    })
                  }
                  else {
                    diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
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
          
              try {
                response.data.forEach((tempval) => {
                  let tempCount = 0
                  sort_outages.forEach((x, index, arr) => {
                    if (moment(x.start_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.time).format("YYYY-MM-DDTHH:mm:ss") && moment(x.end_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.next).format("YYYY-MM-DDTHH:mm:ss") ) {
          
                      tempCount = tempCount + 1;
                      let tempObj = {};
                      tempObj.time = x.start_dt;
                      tempObj.next = x.end_dt;
                      tempObj.reason = x.prod_reason.id;
                      tempObj.include_in_oee = x.prod_reason.include_in_oee
                      tempObj.value = tempval.value;
                      tempObj.energy = tempval.energy;
                      tempObj.reason_name = x.prod_reason.reason;
                      tempObj.reason_type = x.prod_reason.prod_reason_type.id;
                      tempObj.reason_type_name = x.prod_reason.prod_reason_type.reason_type
                      tempObj.comments = x.comments;
                      tempObj.iid = tempval.iid;
                      tempObj.outage_id=x.id;
                      tempObj.reason_tags=x.reason_tags;
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
                      splitedobj2.include_in_oee = x.prod_reason.include_in_oee
                      splitedobj2.value = tempval.value;
                      splitedobj2.energy = tempval.energy;
                      splitedobj2.reason_name = x.prod_reason.reason;
                      splitedobj2.reason_type = x.prod_reason.prod_reason_type.id;
                      splitedobj2.reason_type_name = x.prod_reason.prod_reason_type.reason_type
                      splitedobj2.comments = x.comments;
                      splitedobj2.iid = tempval.iid;
                      splitedobj2.outage_id=x.id;
                      splitedobj2.reason_tags=x.reason_tags;
                      
                      if (arr[index - 1] && moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                        splitedobj1.time = arr[index - 1].end_dt;
                        splitedobj1.next = x.start_dt;
                        splitedobj1.value = tempval.value;
                        splitedobj1.energy = tempval.energy;
                        splitedobj1.reason_name = x.prod_reason.reason;
                        splitedobj1.reason_type = x.prod_reason.prod_reason_type.id;
                        splitedobj1.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                        splitedobj1.comments = x.comments;
                        splitedobj1.iid = tempval.iid;
                        splitedobj1.outage_id=x.id;
                        splitedobj1.reason_tags=x.reason_tags;
                       
                      } else {
                        splitedobj1.time = tempval.time;
                        splitedobj1.next = x.start_dt;
                        splitedobj1.value = tempval.value;
                        splitedobj1.energy = tempval.energy;
                        splitedobj1.reason_name = x.prod_reason.reason;
                        splitedobj1.reason_type = x.prod_reason.prod_reason_type.id;
                        splitedobj1.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                        splitedobj1.comments = x.comments;
                        splitedobj1.iid = tempval.iid;
                        splitedobj1.outage_id=x.id;
                        splitedobj1.reason_tags=x.reason_tags;
                       
                      }
                      if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                        splitedobj3.time = x.end_dt;
                        splitedobj3.next = arr[index + 1].start_dt;
                        splitedobj3.value = tempval.value;
                        splitedobj3.energy = tempval.energy;
                        splitedobj3.reason_name = x.prod_reason.reason;
                        splitedobj3.reason_type = x.prod_reason.prod_reason_type.id;
                        splitedobj3.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                        splitedobj3.comments = x.comments;
                        splitedobj3.iid = tempval.iid;
                        splitedobj3.outage_id=x.id;
                        splitedobj3.reason_tags=x.reason_tags;
                       
                      } else {
                        splitedobj3.time = x.end_dt;
                        splitedobj3.next = tempval.next;
                        splitedobj3.value = tempval.value;
                        splitedobj3.energy = tempval.energy;
                        splitedobj3.reason_name = x.prod_reason.reason;
                        splitedobj3.reason_type = x.prod_reason.prod_reason_type.id;
                        splitedobj3.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                        splitedobj3.comments = x.comments;
                        splitedobj3.iid = tempval.iid;
                        splitedobj3.outage_id=x.id;
                        splitedobj3.reason_tags=x.reason_tags;
                        
                      }
                      final_outages.push(splitedobj1)
                      final_outages.push(splitedobj2)
                      final_outages.push(splitedobj3)
                    }
                   
                    if (moment(x.start_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.time).format("YYYY-MM-DDTHH:mm:ss") && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                    
                      tempCount = tempCount + 1;
                      let splitedobj1 = {};
                      let splitedobj2 = {};
                      splitedobj1.time = x.start_dt;
                      splitedobj1.next = x.end_dt;
                      splitedobj1.reason = x.prod_reason.id
                      splitedobj1.include_in_oee = x.prod_reason.include_in_oee
                      splitedobj1.value = tempval.value;
                      splitedobj1.energy = tempval.energy;
                      splitedobj1.reason_name = x.prod_reason.reason;
                      splitedobj1.reason_type = x.prod_reason.prod_reason_type.id;
                      splitedobj1.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                      splitedobj1.comments = x.comments;
                      splitedobj1.iid = tempval.iid;
                      splitedobj1.outage_id=x.id;
                      splitedobj1.reason_tags=x.reason_tags;
                      
                      if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                        splitedobj2.time = x.end_dt;
                        splitedobj2.next = arr[index + 1].end_dt;
                        
                      } else {
                        splitedobj2.time = x.end_dt;
                        splitedobj2.next = tempval.next;
                       
                      }
                      splitedobj2.value = tempval.value;
                      splitedobj2.iid = tempval.iid;
                     
                      final_outages.push(splitedobj1)
                      final_outages.push(splitedobj2)
                    }
                    if (moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
                      tempCount = tempCount + 1;
                      let splitedobj1 = {};
                      let splitedobj2 = {};
                      splitedobj2.time = x.start_dt;
                      splitedobj2.next = x.end_dt;
                      splitedobj2.reason = x.prod_reason.id
                      splitedobj2.include_in_oee = x.prod_reason.include_in_oee
                      splitedobj2.value = tempval.value;
                      splitedobj2.energy = tempval.energy;
                      splitedobj2.reason_name = x.prod_reason.reason;
                      splitedobj2.reason_type = x.prod_reason.prod_reason_type.id;
                      splitedobj2.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                      splitedobj2.comments = x.comments;
                      splitedobj2.iid = tempval.iid;
                      splitedobj2.outage_id=x.id;
                      splitedobj2.reason_tags=x.reason_tags;
                     
                      if (!arr[index - 1] && !moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                        splitedobj1.time = tempval.time;
                        splitedobj1.next = x.start_dt;
                        splitedobj1.value = tempval.value;
                        splitedobj1.energy = tempval.energy;
                        splitedobj1.reason_name = x.prod_reason.reason;
                        splitedobj1.reason_type = x.prod_reason.prod_reason_type.id;
                        splitedobj1.reason_type_name = x.prod_reason.prod_reason_type.reason_type;
                        splitedobj1.comments = x.comments;
                        splitedobj1.iid = tempval.iid;
                        splitedobj1.outage_id=x.id;
                        splitedobj1.reason_tags=x.reason_tags;
                      } 
                      final_outages.push(splitedobj2)
                      final_outages.push(splitedobj1)
                    }
                  })
                
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
                result.sort((a, b) => new Date(b.time) - new Date(a.time))
                final_result = result; 
                
                // sorting based on time in descending
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
              // console.log("response.data",{ raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime ,Count: 0  })
              return { raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime ,Count: 0  }
            // } else {
            //   setLoading(false)
            //   return { raw: [], data: response.data, dTime: 0, totalDTime: 0, Count: 0 }
            // }
          } else {
            setLoading(false)
            return { raw: [], data: response, dTime: 0, totalDTime: 0 , Count: 0 }
          }
        })
        .catch((e) => {
          return e;
        });
    }))
      .then(Finaldata => { 
        setData(Finaldata);
        setError(false)
        setLoading(false)
      })
      .catch((e) => {
        setData(e);
        setError(true)
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      });
  };
  return { downTimeLoading, downTimeData, downTimeError, getDownTime };
};

export default useGetDownTime;