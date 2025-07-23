import { useState } from "react";
import configParam from "config"; 

const useIncertRTUData = () => {
    const [IncertRTUDataLoading, setLoading] = useState(false);
    const [IncertRTUDataData, setData] = useState(null);
    const [IncertRTUDataError, setError] = useState(null);

    const IncertRTUData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "IncertRTUData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { IncertRTUDataLoading, IncertRTUDataData, IncertRTUDataError, IncertRTUData };
}


export default useIncertRTUData;