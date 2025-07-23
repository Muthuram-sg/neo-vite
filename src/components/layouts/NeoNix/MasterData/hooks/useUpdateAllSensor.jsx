import { useState } from "react";
import configParam from "config";


const useUpdateAllSensor = () => {
    const [EditAllSensorLoading, setLoading] = useState(false);//NOSONAR
    const [EditAllSensorData, setData] = useState(null);//NOSONAR
    const [EditAllSensorError, setError] = useState(null);//NOSONAR

    const getEditAllSensor = async ( jsonData ) => {
        setLoading(true); 
        const data = {
            data:{
                extractData: jsonData,
            }
        };
        let url = "/tasks/sensorBulkUpload";
        await configParam.RUN_REST_API(url, data,'','',"POST")
            .then((response) => {
                if (response !== undefined && (response.data)) {
                    setData(response.data);
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

    return { EditAllSensorLoading, EditAllSensorData, EditAllSensorError, getEditAllSensor };
}


export default useUpdateAllSensor;