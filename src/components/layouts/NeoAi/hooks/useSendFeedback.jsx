import { useState } from "react";
import configParam from "config"; 

const useSendFeedback = () => {
    const [sendFeedBackLoading, setLoading] = useState(false);
    const [sendFeedBackData, setData] = useState(null);
    const [sendFeedBackError, setError] = useState(null);

    const getsendFeedBack  = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API("/neoai/sendFeedBack", body,"","","POST") 
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

    return { sendFeedBackLoading, sendFeedBackData, sendFeedBackError, getsendFeedBack };
}


export default useSendFeedback;