import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';
const useProductionworkorderdetails = () => {
    const [productionworkorderdetailsLoading, setLoading] = useState(false);
    const [productionworkorderdetailsData, setData] = useState(null);
    const [productionworkorderdetailsError, setError] = useState(null);

    const getproductionworkorderdetails = async (schema, data, dates, isRepeat, previousData) => {        
              // eslint-disable-next-line array-callback-return

        Promise.all(data.map(async (val) => {
            if(val.entity.dryer_config &&val.entity.dryer_config.is_enable){
                const dryerObj = val.entity.dryer_config;
                const feed_iid =dryerObj.total_sand_fed_instrument;
                const feed_key = dryerObj.MetricBySandFeed?dryerObj.MetricBySandFeed.name:"";
                const dried_iid = dryerObj.total_sand_dried_instrument;
                const dried_key = dryerObj.MetricBySandDried?dryerObj.MetricBySandDried.name:"";
                const scrap_iid = dryerObj.total_scrap_instrument;
                const scrap_key = dryerObj.MetricBySandScrap?dryerObj.MetricBySandScrap.name:"";
                const gas_iid = dryerObj.gas_energy_consumption_instrument;
                const gas_key = dryerObj.MetricByGasEnergy?dryerObj.MetricByGasEnergy.name:"";
                const elect_iid = dryerObj.electrical_energy_consumption_instrument;
                const elect_key = dryerObj.MetricByElectricalEnergy?dryerObj.MetricByElectricalEnergy.name:"";
                const moistin_iid = dryerObj.moisture_input_instrument;
                const moistin_key = dryerObj.MetricByMoistureIn?dryerObj.MetricByMoistureIn.name:"";
                const moistout_iid = dryerObj.moisture_output_instrument;
                const moistout_key = dryerObj.MetricByMoistureOut?dryerObj.MetricByMoistureOut.name:"";
                const execution_iid = dryerObj.total_startup_time_instrument;
                const execution_key = dryerObj.MetricByExecution?dryerObj.MetricByExecution.name:"";
                return Promise.all(dates.map(async (d) => {
                    setLoading(true);

                    const APIfetch =async (api_url, api_body)=>{
                        return configParam.RUN_REST_API(api_url, api_body)
                        .then((response) => {
                            if (response && !response.errorTitle) { 
                                return response.data; 
                            } else {
                                return null;
                            }
                        })
                        .catch((e) => {
                            return null;
                        });
                    }
                    /*------ fetching material data-------*/
                    const mat_body = {
                        schema: schema,
                        feed_iid: feed_iid,
                        feed_key: feed_key,
                        dried_iid: dried_iid,
                        dried_key: dried_key,
                        scrap_iid: scrap_iid,
                        scrap_key: scrap_key,
                        from: d.start, 
                        to: d.end
                    }
                    const mat_url = "/dashboards/getdryermaterialdata";
                    const material = await APIfetch(mat_url, mat_body) 
                    /*------ fetching material data-------*/
                    /*------ fetching gas data-------*/
                    let engy_body = {
                        schema: schema,
                        iid: gas_iid,
                        key: gas_key,
                        from: d.start, 
                        to: d.end
                    } 
                    const engy_url =  "/dashboards/getdryerenergydata";
                    const gas = await APIfetch(engy_url, engy_body)  
                    /*------ fetching gas data-------*/
                    /*------ fetching energy data-------*/
                    engy_body = {
                        schema: schema,
                        iid: elect_iid,
                        key: elect_key,
                        from: d.start, 
                        to: d.end
                    } 
                    const elect = await APIfetch(engy_url, engy_body) 
                    /*------ fetching energy data-------*/
                    /*------ fetching moistin data-------*/
                    engy_body = {
                        schema: schema,
                        iid: moistin_iid,
                        key: moistin_key,
                        from: d.start, 
                        to: d.end
                    }
                    const moistin_url = "/dashboards/getdryermoisturedata";
                    const moistin = await APIfetch(moistin_url, engy_body) 
                    /*------ fetching moistin data-------*/
                    /*------ fetching moistout data-------*/
                    engy_body = {
                        schema: schema,
                        iid: moistout_iid,
                        key: moistout_key,
                        from: d.start, 
                        to: d.end
                    }
                    const moistout = await APIfetch(moistin_url, engy_body) 
                    /*------ fetching moistout data-------*/
                    /*------ fetching execution data-------*/
                    const execution_body = {
                    schema: schema,
                    iid: execution_iid,
                    key: execution_key,
                    entity_id: val.entity_id,
                    from: d.start, 
                    to: d.end
                    }
                    const execution_url = "/dashboards/getdryerdowntime";
                    const execution = await APIfetch(execution_url, execution_body)
                    /*------ fetching moistout data-------*/
                    return {gas: gas?gas:0,elect: elect?elect:0,moistin: moistin?moistin:0,moistout: moistout?moistout:0,unplannedDT: execution && execution.dTime?execution.dTime:0,totalDowntime: execution && execution.totalDTime?execution.totalDTime:0,feed: material && material.feed_data?material.feed_data:0,dried: material && material.dried_data?material.dried_data:0,scrap: material && material.scrap_data?material.scrap_data:0,start: d.start, end: d.end, entity_id: val.entity_id, execid: d.execid}
                }))
            }else{
                return Promise.all(dates.map(async (d) => {
                    setLoading(true);
                    const body = {
                        schema: schema,
                        instrument_id: val.part_signal_instrument,
                        metric_name: val.metric.name,
                        start_date: d.start,
                        end_date: d.end,
                        binary: val.is_part_count_binary,
                        downfall: val.is_part_count_downfall
                    }
                    let url = "/dashboards/actualPartSignal";
                    let partData = await configParam.RUN_REST_API(url, body)
                        .then(async (response) => {
    
                            let parts = isRepeat ? [...previousData, ...response.data] : response.data;
                            if (response && !response.errorTitle && parts.length > 0) {
                                let diff = [];
                                parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                                for (let i = 1; i < parts.length; i++) {
                                    let actDiff = new Date(parts[i - 1].time).getTime()/1000  - new Date(parts[i].time).getTime()/1000//new Date(parts[i - 1].time) / 1000 - new Date(parts[i].time) / 1000
                                    let object = parts[i-1];
                                    object.cycleTime = 0;
                                    if(actDiff > 0){
                                        diff.push(actDiff)
                                        object.cycleTime = actDiff.toFixed(0);
                                        
                                        parts[i-1] = object
                                    }
                                }
                                const actCycletime = mode(diff),stdCycletime = mode(diff.slice(0, Math.min(20, diff.length)));
                                const param = {
                                    entity_id: val.entity_id,
                                    from: d.start,
                                    to: d.end
                                };
                                await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param)
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
     
    
                                return { data: parts, actCycleTime: actCycletime, cycleTime: d.execid ? d.cycleTime : stdCycletime }
                            } else {
                                return { data: parts }
                            }
                        })
                        .catch((e) => {
                            return e
                        });
                    const body1 = {
                        schema: schema,
                        instrument_id: val.machine_status_signal_instrument,
                        metric_name: val.metricByMachineStatusSignal.name,
                        start_date: d.start,
                        end_date: d.end,
                        mic_stop: val.mic_stop_duration,
                        active_signal: val.is_status_signal_available,
                        downfall: val.is_part_count_downfall
                    }
                    url = "/dashboards/machinestatussignal";
                    let assetStatus = await configParam.RUN_REST_API(url, body1)
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
                                    response.data= response.data.map(m=> { 
                                            let partsData = []
                                            if(partData && partData.data.length>0){
                                                partsData =partData.data.filter(e=> moment(new Date(e.time)).isBetween(moment(m.time),moment(m.next))) 
                                            }
                                            if(partsData.length>0 && !val.is_status_signal_available){
                                                return {...m,next: moment(partsData[partsData.length-1].time).format('YYYY-MM-DDTHH:mm:ss'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss')}  
                                            }else{
                                                return {...m,next: moment(m.next).format('YYYY-MM-DDTHH:mm:ss'),time: moment(m.time).format('YYYY-MM-DDTHH:mm:ss')}  
                                            }
                                      })
                                    let dTime = 0
                                    let totalDTime = 0
                                    let start_date = d.start
                                    let end_date = d.end
                                    let cycle_time = partData.data.length>0 ? partData.cycleTime:0
                                    if(!val.is_status_signal_available){ 
                                        if(moment(response.data[0].time)>moment(start_date)){ 
                                          let diff = moment.duration(moment(response.data[0].time).diff(moment(start_date))).asSeconds()
                                          let next = response.data[0].next;
                                          let time = response.data[0].time
                                          if(!val.is_part_count_downfall && response.data[0].value !== 0){ 
                                            
                                              next = cycle_time && cycle_time>0?moment(response.data[0].time).subtract(Math.ceil(cycle_time),'second').format('YYYY-MM-DDTHH:mm:ssZ'):response.data[0].next; 
                                          }
                                          if(val.is_part_count_downfall && response.data[0].value === 0){
                                            next = cycle_time && cycle_time>0?moment(response.data[0].time).subtract(Math.ceil(cycle_time),'second').format('YYYY-MM-DDTHH:mm:ssZ'):response.data[0].next; 
                                          } 
                                          let arr1 =[]
                                          if(diff > val.mic_stop_duration){ 
                                            let Lastpart =[]
                                            if(partData && partData.data.length>0){
                                              Lastpart =partData.data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(time))) 
                                            }
                                            next =Lastpart.length > 0 ? moment(Lastpart[Lastpart.length-1].time).format('YYYY-MM-DDTHH:mm:ss') : time
                                            time = start_date
                                            arr1 = [
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
                                        
                                            let Lastpart =partData ? partData.data.filter(e=> moment(new Date(e.time)).isBetween(moment(response.data[response.data.length-1].time),moment(d.end))) : []
                                            let Lastdiff = moment.duration(moment(d.end).diff(moment(Lastpart.length > 0 ? Lastpart[0].time : response.data[response.data.length-1].time))).asSeconds()
                                            if(Lastdiff > val.mic_stop_duration){ 
                                            const arr2 = [
                                                {
                                                iid: response.data[response.data.length-1].iid,
                                                key: response.data[response.data.length-1].key,
                                                time: response.data[response.data.length-1].next,
                                                next: d.end,
                                                value: response.data[response.data.length-1].value 
                                                }
                                            ]
                                            response.data = [...response.data,...arr2];
                                            } 
                                   
                                    }
                                    else{
                                        if(moment(response.data[0].time)>moment(start_date)){
                                          let diff = moment.duration(moment(response.data[0].time).diff(moment(start_date))).asSeconds()
                                          let next = response.data[0].next;
                                          let time = response.data[0].time
                                          if(diff > val.mic_stop_duration){
                                            let Lastpart =partData ? partData.data.filter(e=> moment(new Date(e.time)).isBetween(moment(start_date),moment(time))) : []
                                            next = Lastpart.length > 0 ? moment(Lastpart[Lastpart.length - 1].time).format('YYYY-MM-DDTHH:mm:ss') : response.data[0].time
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
                                                value: response.data[0].value
                                              }
                                            ]
                                            response.data = [...arr1,...arr2,...response.data];
                                          }
                                          
                                          
                                        } 
                                    }
                                      
                                    let outages = await configParam.RUN_GQL_API(gqlQueries.getDowntimeWithReasons, { asset_id: val.entity_id, from: d.start, to: d.end })
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
                                        let Next =  moment(x.next).valueOf() //Daylight Checking
                                        let Time = moment(x.time).valueOf()
                                        let diff = moment.duration(moment(x.time).diff(moment(start_date))).asSeconds()
                                        if(i === 0 && (moment(x.time) > moment(start_date)) && (diff < val.mic_stop_duration)){
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
                                        }
    
                                        if (!val.is_status_signal_available) {
                                            if (i !== (response.data.length - 1)) { 
                                                
                                                temp[0].data.push({
                                                x: 'Range',
                                                y: [Next, moment(response.data[i + 1].time).valueOf()]
                                                })  
                                                temp[1].data.push({
                                                  x: 'Range',
                                                  y: [Time, Next]
                                                })
                                                diffinsec = parseInt(moment.duration(moment(Next).diff(moment(Time))).asMilliseconds());  
                                            }

                                            if (i === (response.data.length - 1)) {
                  
                                                let Lastpart = partData ? partData.data.filter(e=> moment(new Date(e.time)).isBetween(moment(Time),moment(end_date))) : [] 
                                                let FirstNxt = Lastpart.length>0 ? Lastpart[Lastpart.length-1].time : Next
                                                temp[0].data.push({
                                                  x: 'Range',
                                                  y: [FirstNxt, moment(end_date).valueOf()]
                                                }) 
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
                                                temp[0].data.push({
                                                    x: 'Range',
                                                    y: [new Date(x.time).getTime(), new Date(x.next).getTime()]
                                                })
                                            }
                                            else {
    
                                                diffinsec =  (new Date(x.next).getTime() - new Date(x.time).getTime())/1000 
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
                                            if (sort_outages && sort_outages.length > 0) {
                                                sort_outages.forEach((x, index, arr) => {
                                                    if (new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString() && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
                                                        tempCount = tempCount + 1;
                                                        let tempObj = {};
                                                        tempObj.time = x.start_dt;
                                                        tempObj.next = x.end_dt;
                                                        tempObj.reason = x.prod_reason.id;
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
                                                        splitedobj2.reason = x.prod_reason ? x.prod_reason.id : "0"
                                                        reasons.push(x.prod_reason.reason);
                                                        splitedobj2.include_in_oee = x.prod_reason.include_in_oee
                                                        splitedobj2.value = tempval.value;
                                                        if (!arr[index - 1] && !moment(arr[index - 1].end_dt).isBetween(moment(tempval.time), moment(tempval.next))) {
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
                                        result.sort((a, b) => new Date(b.time) - new Date(a.time));// sorting based on time in descending
                                        final_result = result 
                                        console.log(final_result,"final_result")
                                        final_result.forEach(x => {
                                            let diffinsec = 0
                                            if (!val.is_status_signal_available) {
                                                if (x.reason && x.include_in_oee) {
                                                    diffinsec = ((new Date(x.next) - new Date(x.time))/1000)
                                                    dTime = dTime + diffinsec
                                                }
                                                if (!x.reason) {
                                                    diffinsec = ((new Date(x.next) - new Date(x.time))/1000)
                                                    dTime = dTime + diffinsec
                                                }
                                            } else {
                                                if (x.value !== 'ACTIVE' && x.reason && x.include_in_oee) {
    
                                                    diffinsec = ((new Date(x.next) - new Date(x.time))/1000)
                                                    dTime = dTime + diffinsec
                                                }
                                                if (x.value !== 'ACTIVE' && !x.reason) {
                                                    diffinsec = ((new Date(x.next) - new Date(x.time))/1000)
                                                    dTime = dTime + diffinsec
                                                }
                                            }
                                        })
                                    }
                                    console.log(final_result,"final_result",dTime,totalDTime)
                                    return { raw: final_result, data: temp, dTime: dTime, totalDTime: totalDTime, reasons: reasons }
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
    
                    let qualityDefects = await configParam.RUN_GQL_API(gqlQueries.getQualityReports, { entity_id: val.entity_id, from: d.start, to: d.end })
                        .then((oeeData) => {
                            if (oeeData !== undefined && oeeData.neo_skeleton_prod_quality_defects) {
                                let qualityLoss = 0
                                let reason = [];
                                oeeData.neo_skeleton_prod_quality_defects.forEach((value) => {
                                    qualityLoss = qualityLoss + parseInt(value.quantity)
                                    reason.push(value.prod_reason.reason);
                                })
                                return { data: oeeData.neo_skeleton_prod_quality_defects, loss: qualityLoss, reasons: reason, entity_id: val.entity_id, start: d.start, end: d.end }
                            }
                            else {
                                return { data: [], loss: 0, reasons: [], entity_id: '', start: d.start, end: d.end }
                            }
                        })
                        .catch((e) => {
                            return e;
                        });
    
                    let dressing_count = { count: 0, data: [] };
                    if (val.dressing_signal && val.dressing_program) {
                        const Dressbody = {
                            schema: schema,
                            metric: val.metricByDressingSignal.name,
                            program: val.dressing_program,
                            from: d.start,
                            to: d.end,
                            instrument: val.part_signal_instrument
                        };
                        const Dressurl = "/iiot/getDressingCount";
                        dressing_count = await configParam
                            .RUN_REST_API(Dressurl, Dressbody)
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
                    return { partsdata: partData, assetStatus: assetStatus, qualityDefects: qualityDefects, dressing_count: dressing_count, start: d.start, end: d.end, entity_id: val.entity_id, execid: d.execid,operatorid: d.operatorid }
                }))
                
            }
            
        }
        ))
        .then(Finaldata => {
            if (Finaldata.length > 0) {
                setData(Finaldata);
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
    return { productionworkorderdetailsLoading, productionworkorderdetailsData, productionworkorderdetailsError, getproductionworkorderdetails };
};



export default useProductionworkorderdetails;