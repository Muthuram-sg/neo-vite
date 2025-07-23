import { useState } from "react";
import configParam from "config"; 

const useGetCNCReport = () => {
    const [GetCNCReportLoading, setLoading] = useState(false);
    const [GetCNCReportData, setData] = useState(null);
    const [GetCNCReportError, setError] = useState(null);

    const getGetCNCReport  = async (body ) => {
        setLoading(true);
        await configParam.RUN_REST_API("/iiot/getCNCReport", body) 
            .then((returnData) => {
                if(returnData !== undefined){
                    console.log("________________________+++")
                    console.log(returnData)
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

    return { GetCNCReportLoading, GetCNCReportData, GetCNCReportError, getGetCNCReport };
}


export default useGetCNCReport;