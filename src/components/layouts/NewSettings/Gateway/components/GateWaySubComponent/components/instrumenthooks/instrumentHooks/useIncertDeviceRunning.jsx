import { useState } from "react";
import configParam from "config"; 

const useIncertDeviceRunning = () => {
    const [IncertDeviceRunningLoading, setLoading] = useState(false);
    const [IncertDeviceRunningData, setData] = useState(null);
    const [IncertDeviceRunningError, setError] = useState(null);

    const IncertDeviceRunning  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "IncertDeviceRunning - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { IncertDeviceRunningLoading, IncertDeviceRunningData, IncertDeviceRunningError, IncertDeviceRunning };
}


export default useIncertDeviceRunning;