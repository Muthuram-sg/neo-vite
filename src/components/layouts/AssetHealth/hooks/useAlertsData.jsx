import { useState } from "react";
import configParam from "config"; 

const useGetAlertsData = () => {
    const [AlertsLoading, setLoading] = useState(false);
    const [AlertsData, setData] = useState(null);
    const [AlertsError, setError] = useState(null);

    const getAlertsData  = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/alerts/getAlertsByDateRange', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "getAlertsData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AlertsLoading, AlertsData, AlertsError, getAlertsData };
}


export default useGetAlertsData;