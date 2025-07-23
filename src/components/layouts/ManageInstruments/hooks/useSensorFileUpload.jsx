import { useState } from "react";
import configParam from "config"; 

const useSensorFileUpload = () => {
    const [fileUploadLoading, setLoading] = useState(false);//NOSONAR
    const [fileUploadData, setData] = useState(null);//NOSONAR
    const [fileUploadError, setError] = useState(null);//NOSONAR

    const getSensorFileUpload = async (jsonData) => {
        setLoading(true); 
        const data = {
            data:{
                extractData: jsonData,
            }
        };
        let url = "/tasks/sensorFileUpload";
        await configParam.RUN_REST_API(url, data,'','',"POST")
            .then((response) => {
                if (response !== undefined && (response.data || response.updated)) {
                    setData(response.data || response.updated);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(response)
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

    return { fileUploadLoading, fileUploadData, fileUploadError, getSensorFileUpload };
}


export default useSensorFileUpload;