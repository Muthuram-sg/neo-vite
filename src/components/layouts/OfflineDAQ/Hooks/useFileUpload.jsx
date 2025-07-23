import { useState } from "react";
import configParam from "config"; 

const useFileUpload = () => {
    const [fileUploadLoading, setLoading] = useState(false);
    const [fileUploadData, setData] = useState(null);
    const [fileUploadError, setError] = useState(null);

    const getfileUpload = async (schema,jsonData) => {
        setLoading(true); 
        const data = {
            data:{
                extractData: jsonData,
                schema: schema
            }
        };
        var url = "/offline/fileUpload";
        configParam.RUN_REST_API(url, data ,'','','POST')
            .then((response) => {
                if (response !== undefined && response.data) {
                    setData(response.data);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { fileUploadLoading, fileUploadData, fileUploadError, getfileUpload };
}


export default useFileUpload;