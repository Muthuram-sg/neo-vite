import { useState } from "react";
import configParam from "config"; 

const useUpdateRTUData = () => {
    const [UpdateRTUDataLoading, setLoading] = useState(false);
    const [UpdateRTUDataData, setData] = useState(null);
    const [UpdateRTUDataError, setError] = useState(null);

    const UpdateRTUData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "UpdateRTUData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateRTUDataLoading, UpdateRTUDataData, UpdateRTUDataError, UpdateRTUData };
}


export default useUpdateRTUData;