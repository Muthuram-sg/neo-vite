import { useState } from "react";
import configParam from "config"; 

const useRefreshInstrument = () => {
    const [RefreshInstrumentlLoading, setLoading] = useState(false);
    const [RefreshInstrumentlData, setData] = useState(null);
    const [RefreshInstrumentlError, setError] = useState(null);

    const getRefreshInstrument  = async (schema) => {
        setLoading(true);
        await configParam.RUN_REST_API("/offline/refreshDataSevice", {schema: schema}) 
            .then((returnData) => {
                if(returnData !== undefined){
                    setData({res :returnData});
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
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { RefreshInstrumentlLoading, RefreshInstrumentlData, RefreshInstrumentlError, getRefreshInstrument };
}


export default useRefreshInstrument;