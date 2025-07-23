import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddDashboard = () => {
    const [CreateDashboardLoading, setLoading] = useState(false); 
    const [CreateDashboardError, setError] = useState(null); 
    const [CreateDashboardData, setData] = useState(null); 

    const getCreateDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.Addnewdashboard,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.insert_neo_skeleton_dashboard) {  
                    setData(returnData.insert_neo_skeleton_dashboard)
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
    return {  CreateDashboardLoading, CreateDashboardData, CreateDashboardError, getCreateDashboard };
};

export default useAddDashboard;