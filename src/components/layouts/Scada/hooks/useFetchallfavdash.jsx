import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useFetchallfavdash = (lineId, userId) => {
    const [FetchallfavdashLoading, setLoading] = useState(false); 
    const [FetchallfavdashError, setError] = useState(null); 
    const [FetchallfavdashData, setData] = useState(null); 

    const getFetchallfavdash = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.Selectallfavdashboard,{line_id: lineId, user_id: userId})
        
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
    return {  FetchallfavdashLoading, FetchallfavdashError, FetchallfavdashData, getFetchallfavdash};
};

export default useFetchallfavdash;