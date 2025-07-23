import { useState } from "react";
import configParam from "config"; 

const useCorrelationMatrix = () => {
    const [correlationLoading, setLoading] = useState(false);
    const [correlationData, setData] = useState(null);
    const [correlationError, setError] = useState(null);

    const getCorrelationMatrix = async (body) => {
        setLoading(true); 
        // console.clear()
        // console.log(typeof jsonData)
        const url = '/dashboards/getCorrelationMatrix';
        
        await configParam.RUN_REST_API(url, body,'','','POST')
            .then((returnData) => {
                if(returnData !== undefined){
                    setData(returnData.data);
                    setError(returnData.errorTitle ? true : false)
                    setLoading(false)
                }
                else{
                    setData(null)
                    setError(true)
                    setLoading(false)
                    }
                
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "getAlarmDownloadData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
        
    }

    return { correlationLoading, correlationData, correlationError, getCorrelationMatrix };
}


export default useCorrelationMatrix;