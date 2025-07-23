import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';

const useAssetStatus = () => {
  const [assetStatLoading, setLoading] = useState(false);
  const [assetStatData, setData] = useState(null);
  const [assetStatError, setError] = useState(null);
  const geAssetStatus = async (schema, data, start_date, end_date,cycle_time,ExeData,partData) => {
    setLoading(true);
    var janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    var julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    var stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    var isLongRange = ((new Date(end_date) - new Date(start_date)) / 60000) > 1440 ? true : false
    let DatesArr = [] 
    if(ExeData && ExeData.length>0){ 
      let WOArr = []
      ExeData.forEach((d,i)=>{ 
        WOArr.push({...data[0],wo_start: d.jobStart, wo_end: d.jobEnd, prod_order:d.orderid})
      })
      DatesArr = WOArr
      DatesArr.sort((a, b) => new Date(b.wo_start) - new Date(a.wo_start));
    }else{
      DatesArr = data
    } 
    // console.log(DatesArr,"DatesArrDatesArr",ExeData,start_date,"end_date",end_date)
    Promise.all(DatesArr.map(async (val) => {
      const body = {
        schema: schema,
        instrument_id: val.machine_status_signal_instrument,
        metric_name: val.metricByMachineStatusSignal.name,
        start_date: val.wo_start ? val.wo_start : start_date,
        end_date: val.wo_end ? val.wo_end : end_date,
        mic_stop: val.mic_stop_duration,
        active_signal: val.is_status_signal_available,
        downfall: val.is_part_count_downfall
      }
      const url = "/dashboards/machinestatussignal";
      
      return configParam.RUN_REST_API(url, body)
        .then(async (response) => {
          if (response && !response.errorTitle) {
            //  console.log(response,"responseresponseresponseProd",val.wo_start, val.wo_end)
            if(ExeData && ExeData.length>0){
              start_date = val.wo_start
              end_date = val.wo_end 
            } 
            // console.log(start_date,"start_date",end_date,idx) 
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
            let outagesLive = await configParam.RUN_GQL_API(gqlQueries.getLiveDowntimeWithReasons, { asset_id: val.entity_id, from: start_date })
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
            let mergeOutage = [...outagesLive,...outages]
            let sort_outages = mergeOutage.sort((a, b) => new Date(a.start_dt) - new Date(b.start_dt));
            
            return {data:response.data,sort_outages:sort_outages}
          } else {
            return {data:[],sort_outages:[]}
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
          let checkStatus = ''
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
          let houryDowntime = {}
          let dateTimeKey 
          if(ExeData && ExeData.length>0){
            start_date = DatesArr[DatesArr.length -1].wo_start
            end_date = DatesArr[0].wo_end 
          }else{
            start_date = start_date
            end_date = end_date 
          }   
          let final_outages = [];
          let reasons = [];
          let dTime = 0
          let totalDTime = 0 
          let final_result = [];
          const tempFunc =(data)=>{
            data.forEach((x, i) => {
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
                let Lastpart = partData ? partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(Time))) : []
                let Nxt = Lastpart.length > 0 ? moment(Lastpart[Lastpart.length-1].time).valueOf() : Time
                temp[1].data.push({
                  x: 'Range',
                  y: [moment(start_date).valueOf(), Nxt]
                })
                temp[0].data.push({
                  x: 'Range',
                  y: [Nxt, Time]
                })
                // console.log(val.is_status_signal_available,"val.is_status_signal_available",x.value,Lastpart)
              }
              
              // console.log(moment(x.time).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss"),moment(x.time).format("YYYY-MM-DDTHH:mm:ss"),"Downtimeeeeee")
              if (!val.is_status_signal_available) {
                
                
                
                if (i !== (data.length - 1)) {
                  checkStatus = 'ACTIVE'
                  if(ExeData && ExeData.length>0){
                    let partLen = ExeData.filter(e=> moment(data[i + 1].time).isBetween(moment(e.jobStart),moment(e.jobEnd)) && moment(new Date(x.next)).isBetween(moment(e.jobStart),moment(e.jobEnd)))
                    // console.log(partLen,"partLenpartLen",data[i + 1],x)
                    if(partLen.length>0){
                      temp[0].data.push({
                        x: 'Range',
                        y: [Next, moment(data[i + 1].time).utcOffset(stdOffset).valueOf()]
                      })  
                    }
                  }else{
                    temp[0].data.push({
                      x: 'Range',
                      y: [Next, moment(data[i + 1].time).utcOffset(stdOffset).valueOf()]
                    })
                  }
                  
                  checkStatus = 'IDLE'
                  temp[1].data.push({
                    x: 'Range',
                    y: [Time, Next]
                  })
                  diffinsec = parseInt(moment.duration(moment(Next).diff(moment(Time))).asMilliseconds());  
                }
                
                if (i === (data.length - 1)) {
                  
                  let Lastpart = partData ? partData[0].data.filter(e=> moment(moment(e.time).format('YYYY-MM-DDTHH:mm:ss.SSS')).isBetween(moment(Time),moment(end_date))) : [] 
                  // console.log(Lastpart,"LastpartLastpart")
                  let FirstNxt = Lastpart.length>0 ? Lastpart[Lastpart.length-1].time : Next
                  temp[0].data.push({
                    x: 'Range',
                    y: [FirstNxt, moment(end_date).valueOf()]
                  })
                //  }else{
                  checkStatus = 'IDLE'
                  temp[1].data.push({
                    x: 'Range',
                    y: [Time, FirstNxt]
                  })
                  diffinsec = parseInt(moment.duration(moment(FirstNxt).diff(moment(Time))).asMilliseconds());  
                  
                } 
                totalDTime = totalDTime + (diffinsec / 1000)

              }
              else {
                if (x.value === 'ACTIVE') {
                  checkStatus = 'ACTIVE'
                  temp[0].data.push({
                    x: 'Range',
                    y: [Time, Next]
                  })
                }
                else {
                  checkStatus = 'IDLE'
                  diffinsec = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asMilliseconds());

                  // console.log(x.next,x.time,"x.nextx.nextelse",diffinsec)
                  totalDTime = totalDTime + (diffinsec / 1000)
                 
                  temp[1].data.push({
                    x: 'Range',
                    y: [Time, Next]
                  })
                }
              }
            })
          }
          const getOutages =(data)=>{
            try {
              // console.log(data,"sort_outages",sort_outages)
              data.forEach((tempval,i) => {
                let tempCount = 0
                if (sort_outages && sort_outages.length > 0) {
                  sort_outages.forEach((x, index, arr) => {
                    if ( moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && !x.end_dt ) {
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
                      final_outages.push(tempObj);
                    }
                    if (moment(x.start_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.time).format("YYYY-MM-DDTHH:mm:ss") && moment(x.end_dt).format("YYYY-MM-DDTHH:mm:ss") === moment(tempval.next).format("YYYY-MM-DDTHH:mm:ss") ) {
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
                      splitedobj2.reason_name = x.prod_reason.reason;
                      splitedobj2.comments = x.comments;
                      splitedobj2.outageid = x.id
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
                    // console.log(new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString(),"ReasonCheck",x.start_dt,moment(tempval.time).format("YYYY-MM-DDTHH:mm:ssZ"),"x.end_dt",x.end_dt,i)
                    if (new Date(x.start_dt).toISOString() === new Date(moment(tempval.time).format("YYYY-MM-DDTHH:mm:ssZ")).toISOString() && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
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
                      if (arr[index + 1] && moment(arr[index + 1].start_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                        splitedobj2.time = x.end_dt;
                        splitedobj2.next = arr[index + 1].end_dt;
                      } else {
                        splitedobj2.time = x.end_dt;
                        splitedobj2.next = tempval.next;
                      }
                      splitedobj2.value = tempval.value;
                      // console.log(splitedobj1,"splitedobj2",splitedobj2)
                      final_outages.push(splitedobj1)
                      final_outages.push(splitedobj2)
                    }
                    if (moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
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
                      if (arr[index - 1] && moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
                        splitedobj1.time = arr[index - 1].end_dt;
                        splitedobj1.next = x.start_dt;
                        splitedobj1.value = tempval.value;
                        console.log("if")
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
          }
          const getFinal_result =()=>{
            const unique = final_outages.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v) === JSON.stringify(v2))) === i); //remove duplicate
              const result1 = unique.filter(x => Object.keys(x).length > 0) //remove empty object
              const result = result1.filter(y => y.time !== y.next) //remove if start and end is same
              
              result.sort((a, b) => new Date(b.time) - new Date(a.time));
              const sortedResult = result;
              final_result = sortedResult;
              // console.log(final_result,"final_outages",unique)
               // sorting based on time in descending
              final_result.forEach(x => {
                let diffinsec = 0


                if (!val.is_status_signal_available) {
                 
                  if (x.reason && x.include_in_oee) {
                    diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                    dTime = dTime + diffinsec
                    // console.log(diffinsec,"diffinsec1reason",x)
                    let starthour1 = moment(x.time).startOf('hour');
                    let endhour1 = moment(x.next).startOf('hour');
                    var hoursDiff1 = (endhour1 - starthour1) / 3600000;
                    // checking downtime lies between same hour
                    let HHformat = isLongRange ? "00" : "HH"

                    if (hoursDiff1 === 0) {   // it will work for same hour
                      dateTimeKey = moment(x.time).format(`YYYY-MM-DDT${HHformat}:00`)

                      if (houryDowntime.hasOwnProperty(dateTimeKey)) { // dd/mm/yyyy hh:mm  key is same add downtime 

                        houryDowntime[dateTimeKey] += ((new Date(x.next) - new Date(x.time)) / 1000)
                      } else {
                        houryDowntime[dateTimeKey] = ((new Date(x.next) - new Date(x.time)) / 1000)

                      }

                    } else {
                      // implemented for loop to check the downtime has inbetween hours
                      for (let i = 0; i < 1 + 1; i++) {
                        const timestamp = Date.parse(x.time); // Parse the date string and get the timestamp
                        const dateObject = new Date(timestamp); // Create a Date object from the timestamp
                        const hours = dateObject.getHours(); // Get the hours from the Date object
                        let starthour2 = moment(x.time).format(`YYYY-MM-DD ${hours + i}:mm:ss`)
                        let endhour2 = moment(x.time).format(`YYYY-MM-DD ${hours + i + 1}:00`)

                        let nextDate = moment(x.next).format(`YYYY-MM-DD HH:mm:ss`)

                        let secDiff = 0;
                        dateTimeKey = moment(x.time).format(`YYYY-MM-DDT${isLongRange ? HHformat : hours + i }:00`)


                        if(moment(nextDate)<moment(endhour2)){

                          let nextDate1 = moment(x.next).format(`YYYY-MM-DD HH:00:00`)
                          secDiff = (Date.parse(nextDate) -  Date.parse(nextDate1)) / 1000;
                          dateTimeKey = moment(x.next).format(`YYYY-MM-DDT${HHformat}:00`)


                        }else{
                           secDiff = (moment(endhour2).startOf('minute') - moment(starthour2).startOf('minute')) / 1000;

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
                  if (!x.reason) {
                    diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                    // console.log(diffinsec,"diffinsec2",x)
                    dTime = dTime + diffinsec
                  }
                } else {
                  if (x.value !== 'ACTIVE' && x.reason && x.include_in_oee) {
                    // console.log('reason',x.reason, x.include_in_oee)
                    diffinsec = ((new Date(x.next) - new Date(x.time)) / 1000)
                    dTime = dTime + diffinsec

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
                }
              })
              // console.log("dateTimeKey", dateTimeKey, houryDowntime)
          }
          // console.log(response,"responseresponse",start_date,end_date,DatesArr)
          if (response.length > 0) {
            response = response.map(m=> {
              let partsData = []
              if(partData && partData[0].data.length>0){
                partsData =partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(m.time),moment(m.next))) 
              }
              // console.log(partsData,"partsDatapartsData")
              if(partsData.length>0 && !val.is_status_signal_available){
                return {...m,next: moment(partsData[partsData.length-1].time).format('YYYY-MM-DDTHH:mm:ss.SSS'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss.SSS')}  
              }else{
                return {...m,next: moment(m.next).format('YYYY-MM-DDTHH:mm:ss.SSS'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss.SSS')}
              }
              
            })
              // console.log(response,"responseresponseCore",val.is_status_signal_available)
              if(!val.is_status_signal_available){ 
                if(moment(response[0].time)>moment(start_date)){ 
                  let diff = moment.duration(moment(response[0].time).diff(moment(start_date))).asSeconds()
                  let next = response[0].next;
                  let time = response[0].time
                  if(!val.is_part_count_downfall && response[0].value !== 0){ 
                    
                      next = cycle_time && cycle_time>0?moment(response[0].time).subtract(Math.ceil(cycle_time),'second').format('YYYY-MM-DDTHH:mm:ss.SSS'):response[0].next; 
                  }
                  if(val.is_part_count_downfall && response[0].value === 0){
                    next = cycle_time && cycle_time>0?moment(response[0].time).subtract(Math.ceil(cycle_time),'second').format('YYYY-MM-DDTHH:mm:ss.SSS'):response[0].next; 
                  } 
                  let arr1 =[]
                  // console.log(diff > val.mic_stop_duration,val.mic_stop_duration,diff,"val.mic_stop_duration")
                  if(diff > val.mic_stop_duration){ 
                    let Lastpart =[]
                    if(partData && partData[0].data.length>0){
                      Lastpart =partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(time))) 
                    }
                    // console.log(Lastpart,"Lastpart")
                    next =Lastpart.length > 0 ? moment(Lastpart[Lastpart.length-1].time).format('YYYY-MM-DDTHH:mm:ss.SSS') : time
                    time = start_date
                    arr1 = [
                      {
                        iid: response[0].iid,
                        key: response[0].key,
                        time: time,
                        next: next,
                        value: response[0].value 
                      }
                    ]
                    // console.log(arr1,"arr1arr1")
                    response = [...arr1,...response];
                  }
                }
                
                let Lastpart =partData ? partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(response[response.length-1].time),moment(end_date))) : []
                let Lastdiff = moment.duration(moment(end_date).diff(moment(Lastpart.length > 0 ? Lastpart[0].time : response[response.length-1].time))).asSeconds()
                // console.log(Lastdiff,"LastdiffLastdiff",response[response.length-1],Lastpart)
                if(Lastdiff > val.mic_stop_duration){ 
                  const arr2 = [
                    {
                      iid: response[response.length-1].iid,
                      key: response[response.length-1].key,
                      time: response[response.length-1].next,
                      next: end_date,
                      value: response[response.length-1].value 
                    }
                  ]
                  response = [...response,...arr2];
                } 
           
              }
              else{
                if(moment(response[0].time)>moment(start_date)){
                  let diff = moment.duration(moment(response[0].time).diff(moment(start_date))).asSeconds()
                  let next = response[0].next;
                  let time = response[0].time
                  if(diff > val.mic_stop_duration){
                    let Lastpart =partData ? partData[0].data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(time))) : []
                    // console.log(diff,"sekirit",Lastpart)
                    next = Lastpart.length > 0 ? Lastpart[Lastpart.length - 1].time : response[0].time
                    let arr2 = []
                    if(Lastpart.length>0){
                      arr2.push({
                        iid: response[0].iid,
                        key: response[0].key,
                        time: next,
                        next: time,
                        value: "ACTIVE"
                      })
                    }
                    const arr1 = [
                      {
                        iid: response[0].iid,
                        key: response[0].key,
                        time: start_date,
                        next: next,
                        value: "STOPPED"
                      }
                    ]
                    response = [...arr1,...arr2,...response];
                  }
                  
                  // console.log('resu',response);
                } 
              }
              // console.log(response,"response.dataresponse.data")
              tempFunc(response) 
              // console.log(val.is_status_signal_available,sort_outages,'machinestatussignal',response);
              getOutages(response) 
              // console.log(final_outages,"final_outages")
              if (final_outages.length > 0) {
                  getFinal_result() 
              }
            // console.log({ raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime },"13th",temp[1].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))),"Active",temp[0].data.map(d=> d.y.map(dt=> moment(dt).format('YYYY-MM-DDTHH:mm:ss'))))
            // return { raw: [], data: response, dTime: 0, totalDTime: 0,reasons: [],  status: 'IDLE',hourlyDowntime: {}}
            setData([{ raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime }])
           } else {
            
            let arr1 =[]  
            if(partData && partData[0].data.length>0){
              
              
              let diff = moment.duration(moment(partData[0].data[partData[0].data.length - 1].time).diff(moment(start_date))).asSeconds()
              let lastdiff = moment.duration(moment(end_date).diff(moment(partData[0].data[0].time))).asSeconds()
              if(lastdiff > val.mic_stop_duration){ 
                let Lastarr = [
                  {
                    iid: partData[0].data[0].iid,
                    key: partData[0].data[0].key,
                    time: moment(partData[0].data[0].time).format('YYYY-MM-DDTHH:mm:ss'),
                    next: end_date,
                    value: partData[0].data[0].value ? 0 : 1 
                  }
                ]
                arr1 = [...Lastarr,...arr1]
              }
              if(diff > val.mic_stop_duration ){ 
                let firstarr = [
                  {
                    iid: partData[0].data[0].iid,
                    key: partData[0].data[0].key,
                    time: start_date,
                    next: moment(partData[0].data[partData[0].data.length - 1].time).format('YYYY-MM-DDTHH:mm:ss'),
                    value: partData[0].data[0].value ? 0 : 1 
                  }
                ]
                arr1 = [...firstarr,...arr1]
              }
              tempFunc(arr1) 
              // console.log(val.is_status_signal_available,sort_outages,'machinestatussignal',arr1);
              getOutages(arr1)  
              // console.log(final_outages,"final_outages")
              if (final_outages.length > 0) {
                getFinal_result()  
              }
              // console.log(arr1,outages,"outages",diff,val.mic_stop_duration,cycle_time,partData[0].data)
            }
            
            // console.log({ raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime },"14th")
            // return { raw: final_result, data: (temp[0].data.length > 0 || temp[1].data.length > 0) ? temp : [], dTime: dTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime }
            // return { raw: [], data: response, dTime: 0, totalDTime: 0,reasons: [],  status: 'IDLE',hourlyDowntime: {}}
            setData([{ raw: final_result, data: (temp[0].data.length > 0 || temp[1].data.length > 0) ? temp : [], dTime: dTime, totalDTime: totalDTime, reasons: reasons, status: checkStatus,hourlyDowntime:houryDowntime }])
          }
        } else {
          setData([{ raw: [], data: response, dTime: 0, totalDTime: 0,reasons: [],  status: 'IDLE',hourlyDowntime: {}}])
        } 
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
  return { assetStatLoading, assetStatData, assetStatError, geAssetStatus };
};

export default useAssetStatus;