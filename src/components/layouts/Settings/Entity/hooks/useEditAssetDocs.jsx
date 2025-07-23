import { useState } from "react";
import configParam from "config"; 

const useEditAssetDoc = () => {
    const [EditAssetDocsLoading, setLoading] = useState(false);
    const [EditAssetDocsData, setData] = useState(null);
    const [EditAssetDocsError, setError] = useState(null);

    const getEditAssetDocs = async (jsonData) => {
        setLoading(true); 
        const url = '/settings/editAssetImageUpload';
        await configParam.RUN_REST_API(url, jsonData,'','',"POST",true)
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
                console.log("NEW MODEL", "ERR", e, "getAlarmDownloEditata - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
        
    }

    return { EditAssetDocsLoading, EditAssetDocsData, EditAssetDocsError, getEditAssetDocs };
}


export default useEditAssetDoc;
