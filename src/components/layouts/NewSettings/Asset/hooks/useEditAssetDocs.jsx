import { useState } from "react";
import configParam from "config"; 

const useEditAssetDoc = () => {
    const [EditAssetDocsLoading, setLoading] = useState(false);
    const [EditAssetDocsData, setData] = useState(null);
    const [EditAssetDocsError, setError] = useState(null);

    const getEditAssetDocs = async (jsonData) => {
        setLoading(true); 
        const url = configParam.API_URL + '/settings/editAssetImageUpload';
        let myHeaders = new Headers();
       
        myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
        await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: jsonData
        })
            .then(response => response.json()) 
        // await configParam.RUN_REST_API(url, { taskid: id},'','',"POST",'',true)
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
