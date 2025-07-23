import { useState } from "react";
import configParam from "config"; 

const useGetAlertsDowntimeData = () => {
    const [AlertsDowntimeLoading, setLoading] = useState(false);
    const [AlertsDowntimeData, setData] = useState(null);
    const [AlertsDowntimeError, setError] = useState(null);

    const getAlertsDowntimeData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "getAlertsOverviewData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AlertsDowntimeLoading, AlertsDowntimeData, AlertsDowntimeError, getAlertsDowntimeData };
}


export default useGetAlertsDowntimeData;