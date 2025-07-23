import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useCurrentScadadetails = () => {
    const [CurrentscadaUserLoading, setLoading] = useState(false); 
    const [CurrentscadaUserError, setError] = useState(null); 
    const [CurrentscadaUserData, setData] = useState(null); 

    const getCurrentScadadetails = async (scadaID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.ScadaselectedValue,{"scada_id": scadaID})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                   // console.log("API Response:", returnData);
                    if(returnData.neo_skeleton_scada_dashboard){
                        setData(returnData.neo_skeleton_scada_dashboard)
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
    return {  CurrentscadaUserLoading, CurrentscadaUserError, CurrentscadaUserData, getCurrentScadadetails};
};

export default useCurrentScadadetails;