import { useState } from "react";
import configParam from "config"; 

const useGetAlarmSummaryData = () => {
    const [AlertsSummaryLoading, setLoading] = useState(false);
    const [AlertsSummaryData, setData] = useState(null);
    const [AlertsSummaryError, setError] = useState(null);

    const getAlarmSummaryData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "getAlarmSummaryData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AlertsSummaryLoading, AlertsSummaryData, AlertsSummaryError, getAlarmSummaryData };
}


export default useGetAlarmSummaryData;