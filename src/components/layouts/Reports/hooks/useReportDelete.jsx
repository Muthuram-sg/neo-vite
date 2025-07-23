import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useReportDelete = () => {
    const [ReportDeleteLoading, setLoading] = useState(false); 
    const [ReportDeleteError, setError] = useState(null); 
    const [ReportDeleteData, setData] = useState(null); 

    const getReportDelete = async (ID,type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.deleteReportGeneration,{id: ID})
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.update_neo_skeleton_report_generation) {
                    setData({Data : returnData.update_neo_skeleton_report_generation, type : type})
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
    return {  ReportDeleteLoading, ReportDeleteData, ReportDeleteError, getReportDelete };
};

export default useReportDelete;