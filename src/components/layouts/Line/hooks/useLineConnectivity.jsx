import { useState } from "react";
import configParam from "config"; 

const useLineConnectivity = () => {
    const [LineConnectivityLoading, setLoading] = useState(false);
    const [LineConnectivityData, setData] = useState(null);
    const [LineConnectivityError, setError] = useState(null);

    const getLineConnectivity  = async (body ) => {
        setLoading(true);
        await configParam.RUN_REST_API("/iiot/getLineConnectivity", body) 
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
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { LineConnectivityLoading, LineConnectivityData, LineConnectivityError, getLineConnectivity };
}


export default useLineConnectivity;