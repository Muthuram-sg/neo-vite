import { useState } from "react";
import configParam from "config"; 

const useUpdateTCPStatus = () => {
    const [UpdateTCPStatusLoading, setLoading] = useState(false);
    const [UpdateTCPStatusData, setData] = useState(null);
    const [UpdateTCPStatusError, setError] = useState(null);

    const UpdateTCPStatus  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "UpdateTCPStatus - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateTCPStatusLoading, UpdateTCPStatusData, UpdateTCPStatusError, UpdateTCPStatus };
}


export default useUpdateTCPStatus;