import { useState } from "react";
import configParam from "config"; 

const useGetAiResponse = () => {
    const [AiResponseLoading, setLoading] = useState(false);
    const [AiResponseData, setData] = useState(null);
    const [AiResponseError, setError] = useState(null);

    const getAiResponse  = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API("/neoai/askMeAnything", body,"","","POST","","",'stream') 
            .then((returnData) => {
                if(returnData !== undefined){
                    // console.log(returnData,"returnData")
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

    return { AiResponseLoading, AiResponseData, AiResponseError, getAiResponse };
}


export default useGetAiResponse;