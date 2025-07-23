import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useCheckdashboardFav = () => {
    const [CheckdashboardFavLoading, setLoading] = useState(false); 
    const [CheckdashboardFavError, setError] = useState(null); 
    const [CheckdashboardFavData, setData] = useState(null); 

    const getCheckdashboardFav = async (lineId,scadaId,userId) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.Checkdashboardstared,{line_id: lineId, scada_id: scadaId, user_id: userId})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                   
                    if(returnData.neo_skeleton_scada_dash_star_fav){
                        setData(returnData.neo_skeleton_scada_dash_star_fav)
                        setError(false)
                        setLoading(false)
                        
                    }
                    
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
    return {  CheckdashboardFavLoading, CheckdashboardFavError, CheckdashboardFavData, getCheckdashboardFav};
};

export default useCheckdashboardFav;