import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteStarReport = () => {
    const [DeleteStarReportLoading, setLoading] = useState(false); 
    const [DeleteStarReportError, setError] = useState(null); 
    const [DeleteStarReportData, setData] = useState(null); 

    const getDeleteStarReport = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteReportStar,body)
        
            .then((returnData) => {
                if (returnData !== undefined) {
                    setData(returnData)
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
    return {  DeleteStarReportLoading, DeleteStarReportData, DeleteStarReportError, getDeleteStarReport };
};

export default useDeleteStarReport;