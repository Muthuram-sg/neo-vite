import { useState } from "react";
import configParam from "config"; 

const useAddAssetDoc = () => {
    const [AddAssetDocsLoading, setLoading] = useState(false);
    const [AddAssetDocsData, setData] = useState(null);
    const [AddAssetDocsError, setError] = useState(null);

    const getaddAssetDocs = async (jsonData) => {
        setLoading(true); 
        const url = configParam.API_URL + '/settings/assetImageUpload';
        let myHeaders = new Headers();
       
        myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
        await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: jsonData
        })
            .then(response => response.json()) 
       
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