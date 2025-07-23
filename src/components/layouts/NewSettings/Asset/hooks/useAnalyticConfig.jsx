import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAnalyticConfig = () => {
    const [AnalyticConfigLoading, setLoading] = useState(false); 
    const [AnalyticConfigError, setError] = useState(null); 
    const [AnalyticConfigData, setData] = useState(null); 

    const getAnalyticConfig = async (id,config) => {
        setLoading(true);
       
        await configParam.RUN_GQL_API(Mutations.AddAnalyticConfig,{ entity_id: id, config: config})
        
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_prod_asset_analytics_config && returnData.insert_neo_skeleton_prod_asset_analytics_config.affected_rows) {
                    setData(returnData.insert_neo_skeleton_prod_asset_analytics_config.affected_rows)
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
    return {  AnalyticConfigLoading, AnalyticConfigData, AnalyticConfigError, getAnalyticConfig };
};

export default useAnalyticConfig;