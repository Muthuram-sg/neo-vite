import { useState } from "react";
import configParam from "config"; 

const useDashboardUploads = () => {
    const [dashboardUploadsLoading, setLoading] = useState(false);
    const [dashboardUploadsData, setData] = useState(null);
    const [dashboardUploadsError, setError] = useState(null);

    const getaddDashboardUploadsDocs = async (jsonData) => {
        setLoading(true); 
        const url = '/dashboards/assetImageUpsert';
        
        await configParam.RUN_REST_API(url, jsonData,'','','POST',true)
            .then((returnData) => {
                if(returnData !== undefined){
                    // console.log(returnData)
                    setData({file: returnData.file, id: returnData.id });
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

    return { dashboardUploadsLoading, dashboardUploadsData, dashboardUploadsError, getaddDashboardUploadsDocs };
}


export default useDashboardUploads;