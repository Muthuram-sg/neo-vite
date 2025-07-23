import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useDeleteDashboard = () => {
    const [DeleteDashboardLoading, setLoading] = useState(false); 
    const [DeleteDashboardError, setError] = useState(null); 
    const [DeleteDashboardData, setData] = useState(null); 

    const getDeleteDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.DeleteDashboard,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.delete_neo_skeleton_dashboard.affected_rows >= 1 ) {  
                    setData(returnData.delete_neo_skeleton_dashboard.affected_rows)
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
    return {  DeleteDashboardLoading, DeleteDashboardData, DeleteDashboardError, getDeleteDashboard };
};

export default useDeleteDashboard;