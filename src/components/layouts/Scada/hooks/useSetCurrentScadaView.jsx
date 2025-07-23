import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useSetCurrentScadaView = () => {
    const [CurrentScadaViewLoading, setLoading] = useState(false); 
    const [CurrentScadaViewError, setError] = useState(null); 
    const [CurrentScadaViewData, setData] = useState(null); 

    const getCurrentScadaView = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.Updateusercurrscada,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.insert_neo_skeleton_user_default_scada_dashboard_one) {  
                    setData(returnData.insert_neo_skeleton_user_default_scada_dashboard_one)
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
                console.log("NEW MODEL", "ERR", e, "Scada", new Date())
            });

    };
    return {  CurrentScadaViewLoading, CurrentScadaViewData, CurrentScadaViewError, getCurrentScadaView };
};

export default useSetCurrentScadaView;