import { useState } from "react";
import configParam from "config"; 

const useDeleteDeviceRunning = () => {
    const [DeleteDeviceRunningLoading, setLoading] = useState(false);
    const [DeleteDeviceRunningData, setData] = useState(null);
    const [DeleteDeviceRunningError, setError] = useState(null);

    const DeleteDeviceRunning  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/DeleteDAQService', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "DeleteDeviceRunning - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteDeviceRunningLoading, DeleteDeviceRunningData, DeleteDeviceRunningError, DeleteDeviceRunning };
}


export default useDeleteDeviceRunning;