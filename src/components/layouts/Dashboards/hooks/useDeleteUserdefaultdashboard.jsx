import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useDeleteUserdefaultdashboard = () => {
    const [DeleteUserdefaultdashboardLoading, setLoading] = useState(false); 
    const [DeleteUserdefaultdashboardError, setError] = useState(null); 
    const [DeleteUserdefaultdashboardData, setData] = useState(null); 

    const getDeleteUserdefaultdashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.DeleteUserdefaultdashboard,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.delete_neo_skeleton_user_default_dashboard ) {  
                //   console.log(returnData.delete_neo_skeleton_user_default_dashboard,"returnData.delete_neo_skeleton_user_default_dashboard")
                    setData(returnData.delete_neo_skeleton_user_default_dashboard)
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
    return {  DeleteUserdefaultdashboardLoading, DeleteUserdefaultdashboardData, DeleteUserdefaultdashboardError, getDeleteUserdefaultdashboard };
};

export default useDeleteUserdefaultdashboard;