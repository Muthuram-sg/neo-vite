import { useState } from "react";
import configParam from "config"; 

const useIncertMqttData = () => {
    const [IncertMqttDataLoading, setLoading] = useState(false);
    const [IncertMqttDataData, setData] = useState(null);
    const [IncertMqttDataError, setError] = useState(null);

    const IncertMqttData  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/IncertDAQService', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "IncertMqttData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { IncertMqttDataLoading, IncertMqttDataData, IncertMqttDataError, IncertMqttData };
}


export default useIncertMqttData;