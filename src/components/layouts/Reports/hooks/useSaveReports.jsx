import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useSaveReports = () => {
    const [SaveReportsLoading, setLoading] = useState(false); 
    const [SaveReportsError, setError] = useState(null); 
    const [SaveReportsData, setData] = useState(null); 

    const getSaveReports = async (line_id,type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetSavedReports,{line_id: line_id })
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_reports) {
                    setData({Data:returnData.neo_skeleton_reports,type:type})
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
    return {  SaveReportsLoading, SaveReportsData, SaveReportsError, getSaveReports };
};

export default useSaveReports;