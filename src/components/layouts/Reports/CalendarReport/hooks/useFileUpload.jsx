import { useState } from "react";
import configParam from "config"; 

const useFileUpload = () => {
    const [FileUploadLoading, setLoading] = useState(false);
    const [FileUploadData, setData] = useState(null);
    const [FileUploadError, setError] = useState(null);

    const getTaskFileUpload = async (jsonData) => {
        setLoading(true); 
        const url = '/iiot/ReportFileUpload';
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

    return { FileUploadLoading, FileUploadData, FileUploadError, getTaskFileUpload };
}


export default useFileUpload;