import { useState } from "react";
import configParam from "config"; 

const useActualPartSignal = () => {
    const [ActualPartSignalLoading, setLoading] = useState(false);
    const [ActualPartSignalData, setData] = useState(null);
    const [ActualPartSignalError, setError] = useState(null);

    const getActualPartSignal  = async (body,val ) => {
        setLoading(true);
        await configParam.RUN_REST_API("/dashboards/actualPartSignal", body) 
            .then((returnData) => {
                if(returnData !== undefined){
                    setData({res :returnData, value:val,body: body});
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

    return { ActualPartSignalLoading, ActualPartSignalData, ActualPartSignalError, getActualPartSignal };
}


export default useActualPartSignal;