import { useState } from "react";
import configParam from "config"; 
import moment from 'moment';

const useMachinestatussignal = () => {
    const [MachinestatussignalLoading, setLoading] = useState(false);
    const [MachinestatussignalData, setData] = useState(null);
    const [MachinestatussignalError, setError] = useState(null);

    const getMachinestatussignal  = async (body,val, temp,btGroupValue,headPlant ) => {
        setLoading(true);
        await configParam.RUN_REST_API("/dashboards/machinestatussignal", body) 
            .then((returnData) => {
                if(returnData !== undefined){
                    if (returnData && returnData.data && returnData.data.length > 0) {
                                 
                        let temp1 = [...returnData.data]
                        let datearray = [];
                        let dtTimeDiff = 0;
                        let setuptime = 0;
                        let actual_setup_time = 0;
                        datearray.push(new Date(val.entity.prod_execs[0] ? val.entity.prod_execs[0].end_dt : ''));
                        datearray.push(new Date());
                        let splitedReason= []; 
                        let setup_time_count = 0;
                        // eslint-disable-next-line array-callback-return
                        temp1.forEach((tempval) => {
                            tempval.reason = 0
                            if(tempval.value !== 'ACTIVE'){
                                let diffinsec = ((new Date(tempval.next) - new Date(tempval.time)) / 1000) 
                                dtTimeDiff = dtTimeDiff + diffinsec
                            }                
                            // eslint-disable-next-line array-callback-return
                            val.entity.prod_outages.map(x => {   
                                    let startCheck = false;
                                    let endCheck = false;
                                    if(btGroupValue === 10){
                                        startCheck = moment(x.start_dt).isBetween(moment(val.entity.prod_execs[0] ? val.entity.prod_execs[0].start_dt : moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss')), moment(Math.min.apply(null, datearray)))
                                        endCheck = moment(x.end_dt).isBetween(moment(val.entity.prod_execs[0] ? val.entity.prod_execs[0].start_dt : moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss')), moment(Math.min.apply(null, datearray)))
                                    }else{
                                        startCheck = moment(x.start_dt).isBetween(configParam.DATE_ARR(btGroupValue,headPlant), moment())
                                        endCheck = moment(x.end_dt).isBetween(configParam.DATE_ARR(btGroupValue,headPlant), moment())
                                    }  
                                    if (startCheck && endCheck) {
                                        if(val.setup_time && val.setup_time> 0 && val.enable_setup_time && setup_time_count === 0){ 
                                            const setupTimeSec = val.setup_time*60;
                                            if(x.prod_reason.prod_reason_type.reason_type === 'Setup Time' && setuptime < setupTimeSec){      
                                                setuptime = setuptime + moment(x.end_dt).diff(moment(x.start_dt),'seconds');  
                                                actual_setup_time= actual_setup_time + moment(x.end_dt).diff(moment(x.start_dt),'seconds');                                                     
                                                if(setuptime > setupTimeSec){ 
                                                    const exceededTime = setuptime - setupTimeSec;
                                                    setuptime = setuptime - exceededTime;
                                                }                                                                                
                                            }                                                     
                                        }                                                
                                        if (new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString() && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()) {
                                            tempval.reason = x.prod_reason.id
                                        }
                                        if(moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))){
                                            let splitedobj1 = {...tempval};
                                            let splitedobj2 = {...tempval};
                                            tempval.reason = x.prod_reason.id
                                            tempval.time = x.start_dt;
                                            tempval.next = x.end_dt; 
                                            splitedobj1.next = x.start_dt;
                                            splitedReason.push(splitedobj1)
                                            splitedobj2.time = x.end_dt; 
                                            splitedReason.push(splitedobj2)
                                        }
                                        if(new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString() && moment(x.end_dt).isBetween(moment(tempval.time), moment(tempval.next))){                                                                                                         
                                            let splitedobj1 = {...tempval}
                                            tempval.reason = x.prod_reason.id
                                            tempval.next = x.end_dt;
                                            tempval.nexts = x.end_dt;
                                            splitedobj1.time = x.end_dt; 
                                            splitedReason.push(splitedobj1) 
                                        }
                                        if(moment(x.start_dt).isBetween(moment(tempval.time), moment(tempval.next)) && new Date(x.end_dt).toISOString() === new Date(tempval.next).toISOString()){                                                    
                                            let splitedobj1 = {...tempval}
                                            tempval.reason = x.prod_reason.id
                                            tempval.time = x.start_dt;
                                            splitedobj1.end = x.start_dt; 
                                            splitedReason.push(splitedobj1) 
                                        }
                                    } 
                            }) 
                            setup_time_count = setup_time_count +1;
                        })
                        
                        dtTimeDiff = dtTimeDiff-setuptime;
                        temp1 =[...temp1,...splitedReason];
                                                   
                        // eslint-disable-next-line array-callback-return
                        temp1.forEach((value, index) => {
                            let reason = value.value;
                            if(value.reason){
                                reason = val.dtReasonArray.filter(x => x.id === value.reason).length > 0 ? val.dtReasonArray.filter(x => x.id === value.reason)[0].name : ""
                            }
                            const stateIndex = temp.findIndex(object => {
                                return object.name === reason;
                            }); 
                            
                            if (stateIndex === -1) {
                                if (index !== temp1.length - 1) {
                                    temp.push({ name: reason, data: [{
                                        x: val.entity.name,
                                        y: [new Date(value.time).getTime(), new Date(value.next).getTime()],
                                        fillColor: '#CCE5FF'
                                    }] })
                                }
                                else {
                                    temp.push({ name: reason, data: [{
                                        x: val.entity.name,
                                        y: [new Date(value.time).getTime(), new Date(value.next).getTime()],
                                        fillColor: '#007BFF'
                                    }] })
                                }                                        
                            }
                            else {
                               
                                    temp[stateIndex].data.push({
                                        x: val.entity.name,
                                        y: [new Date(value.time).getTime(), new Date(value.next).getTime()],
                                        fillColor: (temp[stateIndex].name === 'ACTIVE') ? '#007BFF' : '#CCE5FF'
                                    })
                                }
                                
                            
                        })
                        // console.log("stateIndex temp", temp.flat())
                        setData(temp.flat());
                        setError(false)
                        setLoading(false)
                        
                    } else {
                        setData([]);
                        setError(false)
                        setLoading(false)
                    } 
                }
                else{
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
                
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { MachinestatussignalLoading, MachinestatussignalData, MachinestatussignalError, getMachinestatussignal };
}


export default useMachinestatussignal;