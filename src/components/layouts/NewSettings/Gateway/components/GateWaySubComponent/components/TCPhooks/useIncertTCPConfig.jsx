import { useState } from "react";
import configParam from "config"; 

const useIncertTCPData = () => {
    const [IncertTCPDataLoading, setLoading] = useState(false);
    const [IncertTCPDataData, setData] = useState(null);
    const [IncertTCPDataError, setError] = useState(null);

    const IncertTCPData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "IncertTCPData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { IncertTCPDataLoading, IncertTCPDataData, IncertTCPDataError, IncertTCPData };
}


export default useIncertTCPData;