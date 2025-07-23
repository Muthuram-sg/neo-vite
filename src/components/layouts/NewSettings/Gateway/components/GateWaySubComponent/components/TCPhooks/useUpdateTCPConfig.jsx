import { useState } from "react";
import configParam from "config"; 

const useUpdateTCPData = () => {
    const [UpdateTCPDataLoading, setLoading] = useState(false);
    const [UpdateTCPDataData, setData] = useState(null);
    const [UpdateTCPDataError, setError] = useState(null);

    const UpdateTCPData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "UpdateTCPData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateTCPDataLoading, UpdateTCPDataData, UpdateTCPDataError, UpdateTCPData };
}


export default useUpdateTCPData;