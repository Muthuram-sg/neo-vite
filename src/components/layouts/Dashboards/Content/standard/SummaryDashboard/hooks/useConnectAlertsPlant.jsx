import { useState } from "react";
import configParam from "config";  

const useConnectAlertsPlant = () => {
    const [ConnectAlertsPlantLoading, setLoading] = useState(false);
    const [ConnectAlertsPlantData, setData] = useState(null);
    const [ConnectAlertsPlantError, setError] = useState(null);

    const getConnectAlertsPlant  = async (childLine,userDefaultList,InstrumentMet ) => {
        setLoading(true);
        Promise.all(
            childLine.map(async (val,i) =>{
                let AlertData=[]
                let childPlant = userDefaultList.map(x => x.line).filter(v=> v.id === val.line_id)[0];  
                let body = {
                     schema: childPlant.schema,
                     lineId :childPlant.id  
                  }
                await configParam.RUN_REST_API("/iiot/getLineConnectivity", body,val.token,val.line_id) 
                .then((returnData) => {
                    if(returnData !== undefined){
                        let MeterData = returnData.data.meter_data ? returnData.data.meter_data : []
                        let MeterStatus = returnData.data.meterTime ? returnData.data.meterTime : []

                        let onLineData  = 0;
                        let offlineLineData = 0 ; 
                        // eslint-disable-next-line array-callback-return
                        if(MeterData.length >0){
                            MeterData.map((valt, index) => {
                                let obj1 = {...valt};
                                let freq = InstrumentMet.filter(x=> x.instruments_id === valt.id).map(x => x.frequency)
                                if(MeterStatus && MeterStatus[valt['id']]){
                                    let min = freq.length > 0 ? (configParam.MODE(freq) * 3) : 0
                                    let LA = new Date(MeterStatus[valt['id']])
                                    let CT = new Date()
                                    let diff = CT - LA
                                    let Status = diff < (Math.max(min, 3600) * 1000)
                                    if(!Status){
                                        obj1['status'] = "Offline";
                                        offlineLineData +=1; 
                                    }else{
                                        obj1['status'] = "Online";
                                        onLineData +=1; 
                                    }
                                } 
                            });
                        } 
                        AlertData.push({Online:onLineData,Offline: offlineLineData,Total: (onLineData+offlineLineData),childPlant:childPlant})
                    }
                    else{ 
                        AlertData.push({Online:0,Offline: 0,Total:0,childPlant:childPlant})
                    }
                    
                })
                return AlertData
            })
        )
        .then((data) => {
            setData(data)
            setError(false)
            setLoading(false)
        })
        .catch((e) => {
            console.log("NEW MODEL", "ERR", e, "Data Alerts Summary Dashboard", new Date())
            setLoading(false);
            setError(e);
            setData(null);
        })
    }

    return { ConnectAlertsPlantLoading, ConnectAlertsPlantData, ConnectAlertsPlantError, getConnectAlertsPlant };
}


export default useConnectAlertsPlant;