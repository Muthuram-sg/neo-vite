import { useState } from "react";
import configParam from "config"; 

const useEnergyLineData = () => {
    const [EnergyLineDataLoading, setLoading] = useState(false);
    const [EnergyLineDataData, setData] = useState(null);
    const [EnergyLineDataError, setError] = useState(null);

    const getEnergyLineData  = async (body,val ) => {
        setLoading(true);
        await configParam.RUN_REST_API("/dashboards/energyLineData", body) 
            .then((returnData) => {
                if(returnData !== undefined){
                    setData(returnData);
                    setError(false)
                    setLoading(false)
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

    return { EnergyLineDataLoading, EnergyLineDataData, EnergyLineDataError, getEnergyLineData };
}


export default useEnergyLineData;