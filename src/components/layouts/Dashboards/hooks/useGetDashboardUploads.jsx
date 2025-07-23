import { useState } from "react";
import configParam from "config"; 

const useDashboardFetch = () => {
    const [dashboardFetchLoading, setLoading] = useState(false);
    const [dashboardFetchData, setData] = useState();
    const [dashboardFetchError, setError] = useState(null);

    const getFetchDashboardUploadsDocs = async (id) => {
        setLoading(true); 
        const url = `/dashboards/viewUploadedFile`;
        await configParam.RUN_REST_API(url, { id: id},'','', 'GET',true)
            .then((returnData) => {
                if(returnData !== undefined){
                    // console.log(returnData)
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

    return { dashboardFetchLoading,
        dashboardFetchData,
        dashboardFetchError, getFetchDashboardUploadsDocs };
}


export default useDashboardFetch;