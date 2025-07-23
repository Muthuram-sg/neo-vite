import { useState } from "react";
import configParam from "config"; 

const useUpdateGateWayStatus = () => {
    const [UpdateGateWayStatusLoading, setLoading] = useState(false);
    const [UpdateGateWayStatusData, setData] = useState(null);
    const [UpdateGateWayStatusError, setError] = useState(null);

    const UpdateGateWayStatus  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/getDAQService', body)
            .then((returnData) => {
                if(returnData !== undefined && returnData.data){
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
                console.log("NEW MODEL", "ERR", e, "UpdateGateWayStatus - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateGateWayStatusLoading, UpdateGateWayStatusData, UpdateGateWayStatusError, UpdateGateWayStatus };
}


export default useUpdateGateWayStatus;