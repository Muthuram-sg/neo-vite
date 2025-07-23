import { useState } from "react";
import configParam from "config"; 

const useGetConnectivityAlerts = () => {
    const [ConnectivityAlerstLoading, setLoading] = useState(false);
    const [ConnectivityAlerstData, setData] = useState(null);
    const [ConnectivityAlerstError, setError] = useState(null);

    const getConnectivityAlerts  = async (body) => {
        setLoading(true);
         
            await configParam.RUN_REST_API('/alerts/getDrilldownConnectivityAlertsByType', body, '', '', 'POST')
            .then((returnData) => {
                console.log("getConnectivityAlerts - returnData", returnData)
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
                console.log("NEW MODEL", "ERR", e, "getConnectivityAlerts - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { ConnectivityAlerstLoading, ConnectivityAlerstData, ConnectivityAlerstError, getConnectivityAlerts };
}


export default useGetConnectivityAlerts;