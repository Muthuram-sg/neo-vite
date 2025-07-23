import { useState } from "react";
import configParam from "config"; 

const useImageUpload = () => {
    const [ImageUploadLoading, setLoading] = useState(false);
    const [ImageUploadData, setData] = useState(null);
    const [ImageUploadError, setError] = useState(null);

    const getTaskImageUpload = async (jsonData) => {
        setLoading(true); 
        const url = '/tasks/ImageUpload';
        
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
                console.log("NEW MODEL", "ERR", e, "getAlarmDownloadData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
        
    }

    return { ImageUploadLoading, ImageUploadData, ImageUploadError, getTaskImageUpload };
}


export default useImageUpload;