import { useState } from "react";
import configParam from "config"; 

const usePaginationAlerts = () => {
    const [PaginationAlertsLoading, setLoading] = useState(false);
    const [PaginationAlertsData, setData] = useState(null);
    const [PaginationAlertsError, setError] = useState(null);

    const getPaginationAlerts  = async (body,Type ) => {
        setLoading(true);
        const url ='/alerts/getPaginationAlerts' 
            configParam.RUN_REST_API(url, body ,'','','POST')
            .then((returnData) => {
                if(returnData !== undefined){
                    // console.log({Data:returnData,type: Type},"data")
                    setData({Data:returnData,type: Type});
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

    return { PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsError, getPaginationAlerts };
}


export default usePaginationAlerts;