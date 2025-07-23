import { useState } from "react";
import configParam from "config"; 
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx"; 

const useDataAlertsPlant = () => {
    const [DataAlertsPlantLoading, setLoading] = useState(false);
    const [DataAlertsPlantData, setData] = useState(null);
    const [DataAlertsPlantError, setError] = useState(null);

    const getDataAlertsPlant  = async (childLine,btGroupValue,userDefaultList,customdatesval ) => {
        
        // console.log(childLine,"getDataAlertsPlantgetDataAlertsPlant")
        Promise.all(
            childLine.map(async (val,i) =>{
                let AlertData=[]
                let childPlant = userDefaultList.map(x => x.line).filter(v=> v.id === val.line_id)[0]; 
                let range = common.Range(btGroupValue, childPlant, customdatesval)
                let body = {
                    schema: childPlant.schema,
                    currpage: 0,
                    perRow: 'OnlyCount',
                    searchBy: '', 
                    from:range[0],
                    to:range[1]
                  } 
                const url = '/alerts/getPaginationAlerts'
                await configParam.RUN_REST_API(url, body,val.token,val.line_id,'POST')
                .then((returnData) => {
                    setLoading(true);
                    if(returnData !== undefined){
                        AlertData.push({Data:returnData,childPlant:childPlant})
                    }
                    else{ 
                        AlertData.push({Data:[],childPlant:childPlant})
                    }
                    
                })
                return AlertData
            })
        )
        .then((data) => {
            setData(data)
            // console.log(data,"/alerts/getPaginationAlerts",btGroupValue)
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

    return { DataAlertsPlantLoading, DataAlertsPlantData, DataAlertsPlantError, getDataAlertsPlant };
}


export default useDataAlertsPlant;