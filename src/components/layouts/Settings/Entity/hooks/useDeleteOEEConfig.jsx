import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteOEEConfig = () => {
    const [DeleteOEEConfigLoading, setLoading] = useState(false); 
    const [DeleteOEEConfigError, setError] = useState(null); 
    const [DeleteOEEConfigData, setData] = useState(null); 

    const getDeleteOEEConfig = async (id) => {
        setLoading(true);
     
        await configParam.RUN_GQL_API(Mutations.DeleteOEEConfig,{ entity_id: id})
        
            .then((returnData) => {
               
                if (returnData.delete_neo_skeleton_prod_asset_oee_config && returnData.delete_neo_skeleton_prod_asset_oee_config.affected_rows) {
                    setData(returnData.delete_neo_skeleton_prod_asset_oee_config.affected_rows)
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
    return {  DeleteOEEConfigLoading, DeleteOEEConfigData, DeleteOEEConfigError, getDeleteOEEConfig };
};

export default useDeleteOEEConfig;