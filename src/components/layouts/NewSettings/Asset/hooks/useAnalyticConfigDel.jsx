import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAnalyticConfigDel = () => {
    const [AnalyticConfigDelLoading, setLoading] = useState(false); 
    const [AnalyticConfigDelError, setError] = useState(null); 
    const [AnalyticConfigDelData, setData] = useState(null); 

    const getAnalyticConfigDel = async (id) => {
        setLoading(true);
      
        await configParam.RUN_GQL_API(Mutations.DeleteAnalyticConfig,{ entity_id: id})
        
            .then((returnData) => {
             
                if (returnData.delete_neo_skeleton_prod_asset_analytics_config && returnData.delete_neo_skeleton_prod_asset_analytics_config.affected_rows) {
                    setData(returnData.delete_neo_skeleton_prod_asset_analytics_config.affected_rows)
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  AnalyticConfigDelLoading, AnalyticConfigDelData, AnalyticConfigDelError, getAnalyticConfigDel };
};

export default useAnalyticConfigDel;