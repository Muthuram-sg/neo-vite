import { useState } from "react";
import configParam from "config"; 

const useAddAssetDoc = () => {
    const [AddAssetDocsLoading, setLoading] = useState(false);
    const [AddAssetDocsData, setData] = useState(null);
    const [AddAssetDocsError, setError] = useState(null);

    const getaddAssetDocs = async (jsonData) => {
        setLoading(true); 
        const url ='/settings/assetImageUpload';
        await configParam.RUN_REST_API(url, jsonData,'','',"POST",true)
            .then((returnData) => {
                if(returnData !== undefined){
                    setData(returnData.Data);
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

    return { AddAssetDocsLoading, AddAssetDocsData, AddAssetDocsError, getaddAssetDocs };
}


export default useAddAssetDoc;