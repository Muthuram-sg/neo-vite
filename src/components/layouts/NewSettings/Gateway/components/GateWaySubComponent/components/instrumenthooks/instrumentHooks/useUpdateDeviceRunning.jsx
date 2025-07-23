import { useState } from "react";
import configParam from "config"; 

const useUpdateDeviceRunning = () => {
    const [UpdateDeviceRunningLoading, setLoading] = useState(false);
    const [UpdateDeviceRunningData, setData] = useState(null);
    const [UpdateDeviceRunningError, setError] = useState(null);

    const UpdateDeviceRunning  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/UpdateDAQService', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "UpdateDeviceRunning - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateDeviceRunningLoading, UpdateDeviceRunningData, UpdateDeviceRunningError, UpdateDeviceRunning };
}


export default useUpdateDeviceRunning;