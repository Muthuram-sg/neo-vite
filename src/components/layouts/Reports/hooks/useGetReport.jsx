import { useState } from "react";
import configParam from "config";  

const useGetReport = () => {
    const [GetReportLoading , setLoading] = useState(false);
    const [GetReportData, setData] = useState(null);
    const [GetReportError , setError] = useState(null);

    const getGetReport = async (report_id,from,to,lineID,timezone) => {
        setLoading(true);
        await configParam.RUN_REST_API("/iiot/getreport", { reportid:report_id, from: from, to: to,lineid: lineID,timezone: timezone }) 
          .then((resultData) => {
            if (resultData  && resultData.data) {
                setData(resultData)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {  GetReportLoading, GetReportData ,GetReportError, getGetReport };
};

export default useGetReport;