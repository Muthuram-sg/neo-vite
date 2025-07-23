import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteStarDashboard = () => {
    const [DeleteStarDashboardLoading, setLoading] = useState(false); 
    const [DeleteStarDashboardError, setError] = useState(null); 
    const [DeleteStarDashboardData, setData] = useState(null); 

    const getDeleteStarDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteDashboardStar,body)
        
            .then((returnData) => {
                if (returnData !== undefined) {
                    setData(returnData)
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
                console.log("NEW MODEL", "ERR", e, "Dashboards", new Date())
            });

    };
    return {  DeleteStarDashboardLoading, DeleteStarDashboardData, DeleteStarDashboardError, getDeleteStarDashboard };
};

export default useDeleteStarDashboard;