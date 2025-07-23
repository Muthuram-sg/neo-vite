import { useState } from "react";
import configParam from "config"; 

const useUpdateConnectivityAlarmAcknowledgement = () => {
    const [updateConnectivityAlarmAcknowledgementLoading, setLoading] = useState(false);
    const [updateConnectivityAlarmAcknowledgementData, setData] = useState(null);
    const [updateConnectivityAlarmAcknowledgementError, setError] = useState(null);

    const getUpdateConnectivityAlarmAcknowledgement  = async (body) => {
        setLoading(true);
        
            configParam.RUN_REST_API('/alerts/getUpdateConnectivityAlarmAcknowledgement', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "getUpdateConnectivityAlarmAcknowledgement - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { updateConnectivityAlarmAcknowledgementLoading, updateConnectivityAlarmAcknowledgementData, updateConnectivityAlarmAcknowledgementError, getUpdateConnectivityAlarmAcknowledgement };
}


export default useUpdateConnectivityAlarmAcknowledgement;