import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useHierarchyReportSelect = () => {
    const [HierarchyReportSelectLoading, setLoading] = useState(false); 
    const [HierarchyReportSelectError, setError] = useState(null); 
    const [HierarchyReportSelectData, setData] = useState(null); 

    const getHierarchyReportSelect = async (hier_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getHierearchyReportSelect,{hier_id: hier_id})
        .then((returnData) => {
            //  console.log(returnData,"getHierarchy")
            if (returnData !== undefined && returnData.neo_skeleton_reports ) {
                setData(returnData.neo_skeleton_reports)
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
return {  HierarchyReportSelectLoading, HierarchyReportSelectError, HierarchyReportSelectData, getHierarchyReportSelect };
};
export default useHierarchyReportSelect;