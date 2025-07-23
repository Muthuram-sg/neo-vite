import { useState } from "react";
import configParam from "config"; 

const useGetAlertsTodayDowntimeData = () => {
    const [AlertsTodayDowntimeLoading, setLoading] = useState(false);
    const [AlertsTodayDowntimeData, setData] = useState(null);
    const [AlertsTodayDowntimeError, setError] = useState(null);

    const getAlertsTodayDowntimeData  = async (body) => {
       
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

    return { AlertsTodayDowntimeLoading, AlertsTodayDowntimeData, AlertsTodayDowntimeError, getAlertsTodayDowntimeData };
}


export default useGetAlertsTodayDowntimeData;