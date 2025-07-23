import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useEditDashboard = () => {
    const [EditDashboardLoading, setLoading] = useState(false); 
    const [EditDashboardError, setError] = useState(null); 
    const [EditDashboardData, setData] = useState(null); 

    const getEditDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.UpdateDashboardName,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_dashboard) {  
                    setData(returnData.update_neo_skeleton_dashboard)
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
    return {  EditDashboardLoading, EditDashboardData, EditDashboardError, getEditDashboard };
};

export default useEditDashboard;