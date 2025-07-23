import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteReportGenHierarchy = () => {
    const [deleteReportGenHierarchyLoading, setLoading] = useState(false);
    const [deleteReportGenHierarchyData, setData] = useState(null);
    const [deleteReportGenHierarchyError, setError] = useState(null); 

    const deleteReportGenHierarchy = async (id) => { 
        setLoading(true);
       
        await configParam.RUN_GQL_API(Mutations.deleteReportGenHierarchy, { report_id: id })
            .then((response) => {
                // console.log(response,"response")
                if (response !== undefined && response.delete_neo_skeleton_report_generation) {
                    setData(response.delete_neo_skeleton_report_generation)
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
            });

    };
    return { deleteReportGenHierarchyLoading, deleteReportGenHierarchyData, deleteReportGenHierarchyError, deleteReportGenHierarchy };
};

export default useDeleteReportGenHierarchy;