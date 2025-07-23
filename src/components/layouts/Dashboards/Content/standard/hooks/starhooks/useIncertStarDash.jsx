import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useInsertStarDashboard = () => {
    const [InsertStarDashboardLoading, setLoading] = useState(false); 
    const [InsertStarDashboardError, setError] = useState(null); 
    const [InsertStarDashboardData, setData] = useState(null); 

    const getInsertStarDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.insertDashboardStar,body)
        
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
    return {  InsertStarDashboardLoading, InsertStarDashboardData, InsertStarDashboardError, getInsertStarDashboard };
};

export default useInsertStarDashboard;