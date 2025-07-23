import { useState } from "react";
import configParam from "config"; 

const useGetConnectivityOverviewData = () => {
    const [ConnectivityOverviewLoading, setLoading] = useState(false);
    const [ConnectivityOverviewData, setData] = useState(null);
    const [ConnectivityOverviewError, setError] = useState(null);

    const getConnectivityOverviewData  = async (body) => {
        setLoading(true);
         
        await configParam.RUN_REST_API('/alerts/getConnectivityAlerts', body, '', '', 'POST')
            .then((returnData) => {
                console.log("getConnectivityOverviewData - returnData", returnData)
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
                console.log("NEW MODEL", "ERR", e, "getConnectivityOverviewData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { ConnectivityOverviewLoading, ConnectivityOverviewData, ConnectivityOverviewError, getConnectivityOverviewData };
}


export default useGetConnectivityOverviewData;