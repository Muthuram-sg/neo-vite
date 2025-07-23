import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useStandardReportList = () => {
    const [StandardReportListLoading, setLoading] = useState(false); 
    const [StandardReportListError, setError] = useState(null); 
    const [StandardReportListData, setData] = useState(null); 

    const GetStandardReportList = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetStandardReportList)
        
            .then((returnData) => {
               console.log(returnData,'returnData')
                if (returnData !== undefined && returnData.neo_skeleton_reports && returnData.neo_skeleton_reports.length > 0) {
                    setData(returnData.neo_skeleton_reports)
                  
                    setError(false)
                    setLoading(false)
                }
                else{
                setData([])
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData([]);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            });

    };
    return {  StandardReportListLoading, StandardReportListData, StandardReportListError, GetStandardReportList };
};

export default useStandardReportList;