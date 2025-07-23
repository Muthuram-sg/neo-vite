import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useSetCurrentDashboard = () => {
    const [CurrentDashboardLoading, setLoading] = useState(false); 
    const [CurrentDashboardError, setError] = useState(null); 
    const [CurrentDashboardData, setData] = useState(null); 

    const getCurrentDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.Updateusercurrdashboard,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.insert_neo_skeleton_user_default_dashboard_one) {  
                    setData(returnData.insert_neo_skeleton_user_default_dashboard_one)
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
    return {  CurrentDashboardLoading, CurrentDashboardData, CurrentDashboardError, getCurrentDashboard };
};

export default useSetCurrentDashboard;