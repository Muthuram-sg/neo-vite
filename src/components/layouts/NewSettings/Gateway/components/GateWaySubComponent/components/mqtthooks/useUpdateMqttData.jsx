import { useState } from "react";
import configParam from "config"; 

const useUpdateMqttData = () => {
    const [UpdateMqttDataLoading, setLoading] = useState(false);
    const [UpdateMqttDataData, setData] = useState(null);
    const [UpdateMqttDataError, setError] = useState(null);

    const UpdateMqttData  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/UpdateDAQService', body, '', '', 'POST')
            .then((returnData) => {
                if(returnData !== undefined){
                    setData(returnData.data);
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
                console.log("NEW MODEL", "ERR", e, "UpdateMqttData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateMqttDataLoading, UpdateMqttDataData, UpdateMqttDataError, UpdateMqttData };
}


export default useUpdateMqttData;