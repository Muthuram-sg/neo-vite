import { useState } from "react";
import configParam from "config"; 

const useGetMostDisconnectedInstrument = () => {
    const [mostDisconnectedInstrumentLoading, setLoading] = useState(false);
    const [mostDisconnectedInstrumentData, setData] = useState(null);
    const [mostDisconnectedInstrumentError, setError] = useState(null);

    const getMostDisconnectedInstrument  = async (body) => {
        setLoading(true);
        
        await configParam.RUN_REST_API('/alerts/getMostDisconnectedInstrument', body, '', '', 'POST')
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
                console.log("NEW MODEL", "ERR", e, "getMostDisconnectedInstrument - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { mostDisconnectedInstrumentLoading, mostDisconnectedInstrumentData, mostDisconnectedInstrumentError, getMostDisconnectedInstrument };
}


export default useGetMostDisconnectedInstrument;