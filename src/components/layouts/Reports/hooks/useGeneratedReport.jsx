import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGeneratedReport = () => {
    const [GeneratedReportLoading, setLoading] = useState(false); 
    const [GeneratedReportError, setError] = useState(null); 
    const [GeneratedReportData, setData] = useState(null); 

    const getGeneratedReport = async (lineID,UserID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getReportGenerated,{"line_id": lineID,"requested_by": UserID})
        
            .then((returnData) => {
                console.log(returnData,"getGeneratedReport")
                if (returnData !== undefined && returnData.neo_skeleton_report_generation) { 
                    setData(returnData.neo_skeleton_report_generation)
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
    return {  GeneratedReportLoading, GeneratedReportData, GeneratedReportError, getGeneratedReport };
};

export default useGeneratedReport;