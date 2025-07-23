import { useState } from "react";
import configParam from "config";


const useDueDateSendEmail = () => {
    const [DueDateSendEmailLoading, setLoading] = useState(false); 
    const [DueDateSendEmailError, setError] = useState(null); 
    const [DueDateSendEmailData, setData] = useState(null); 

    const getDueDateSendEmail = async (data) => {
     
        setLoading(true);
        let url = "/mail/sentmail";
        configParam.RUN_REST_API(url, data,'','',"POST")
            .then((response) => {
             
                const result = response.data.reduce((acc, obj) => {
                    if (Array.isArray(obj.rejected) && obj.rejected.length === 0) {
                        acc.success++;
                    } else {
                        acc.failure++;
                    }
                    return acc;
                }, { success: 0, failure: 0 });
                
                setData(result)
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log(e,'failed to send message')
                setError(true)
                setLoading(false)
              });
    }
    return {  DueDateSendEmailLoading, DueDateSendEmailError, DueDateSendEmailData, getDueDateSendEmail };
};

export default useDueDateSendEmail;