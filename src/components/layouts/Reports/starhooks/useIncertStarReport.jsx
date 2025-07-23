import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useInsertStarReport = () => {
    const [InsertStarReportLoading, setLoading] = useState(false); 
    const [InsertStarReportError, setError] = useState(null); 
    const [InsertStarReportData, setData] = useState(null); 

    const getInsertStarReport = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.insertReportStar,body)
        
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
    return {  InsertStarReportLoading, InsertStarReportData, InsertStarReportError, getInsertStarReport };
};

export default useInsertStarReport;