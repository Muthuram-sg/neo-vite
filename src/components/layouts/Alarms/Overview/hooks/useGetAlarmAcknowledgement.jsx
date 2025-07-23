import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAlarmAcknowledgement = () => {
    const [getAlarmAcknowledgementLoading, setLoading] = useState(false);
    const [getAlarmAcknowledgementData, setData] = useState(null);
    const [getAlarmAcknowledgementError, setError] = useState(null);

    const getAlarmAcknowledgement = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/alerts/getAllAlarmAck', body)
            .then((returnData) => { 
                if (returnData !== undefined && returnData.allack && returnData.allack.length > 0) { 
                    
                    setData(returnData.allack)
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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return { getAlarmAcknowledgementLoading, getAlarmAcknowledgementData, getAlarmAcknowledgementError, getAlarmAcknowledgement };
};

export default useGetAlarmAcknowledgement;