import { useState } from "react";
import configParam from "config"; 

const useGetAlarmDownloadData = () => {
    const [alarmDataDownloadLoading, setLoading] = useState(false);
    const [alarmDataDownloadData, setData] = useState(null);
    const [alarmDataDownloadError, setError] = useState(null);

    const getAlarmDownloadData  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/alerts/getAlertDownloadData', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "getAlarmDownloadData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { alarmDataDownloadLoading, alarmDataDownloadData, alarmDataDownloadError, getAlarmDownloadData };
}


export default useGetAlarmDownloadData;