import { useState } from "react";
import configParam from "config"; 

const useUpdateAlarmAcknowledgement = () => {
    const [updateAlarmAcknowledgementLoading, setLoading] = useState(false);
    const [updateAlarmAcknowledgementData, setData] = useState(null);
    const [updateAlarmAcknowledgementError, setError] = useState(null);

    const getUpdateAlarmAcknowledgement  = async (body) => {
        setLoading(true);
        
            configParam.RUN_REST_API('/alerts/getUpdateAlarmAcknowledgement', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "getUpdateAlarmAcknowledgement - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { updateAlarmAcknowledgementLoading, updateAlarmAcknowledgementData, updateAlarmAcknowledgementError, getUpdateAlarmAcknowledgement };
}


export default useUpdateAlarmAcknowledgement;