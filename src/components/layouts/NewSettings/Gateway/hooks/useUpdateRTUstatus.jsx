import { useState } from "react";
import configParam from "config"; 

const useUpdateRTUStatus = () => {
    const [UpdateRTUStatusLoading, setLoading] = useState(false);
    const [UpdateRTUStatusData, setData] = useState(null);
    const [UpdateRTUStatusError, setError] = useState(null);

    const UpdateRTUStatus  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/getDAQService', body)
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
                console.log("NEW MODEL", "ERR", e, "UpdateRTUStatus - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateRTUStatusLoading, UpdateRTUStatusData, UpdateRTUStatusError, UpdateRTUStatus };
}


export default useUpdateRTUStatus;