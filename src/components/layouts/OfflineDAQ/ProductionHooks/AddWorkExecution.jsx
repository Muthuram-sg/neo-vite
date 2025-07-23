import { useState } from "react";
import configParam from "config"; 

const useAddWorkExcData = () => {
    const [AddWorkExcLoading, setLoading] = useState(false);
    const [AddWorkExcData, setData] = useState(null);
    const [AddWorkExcError, setError] = useState(null);

    const addWorkExcData  = async (body) => {
        setLoading(true)
        await configParam.RUN_REST_API('/production/setProductionInternal', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "getAlertsOverviewData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AddWorkExcLoading, AddWorkExcData, AddWorkExcError,addWorkExcData };
}


export default useAddWorkExcData;