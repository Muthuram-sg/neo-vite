import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetStarDashboard= () => {
    const [ StarDashboardLoading , setLoading] = useState(false);
    const [ StarDashboardData, setData] = useState(null);
    const [ StarDashboardError , setError] = useState(null);

    const getStarDashboard = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getStarDashboard,body) 
          .then((aggregate) => {
           console.log(aggregate,"aggregate",body)
            if ( aggregate !== undefined && aggregate.neo_skeleton_dashboard_star_fav) {
                setData(aggregate.neo_skeleton_dashboard_star_fav)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   StarDashboardLoading,  StarDashboardData , StarDashboardError,getStarDashboard };
};

export default  useGetStarDashboard;