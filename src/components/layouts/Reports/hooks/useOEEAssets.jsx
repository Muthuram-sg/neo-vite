import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useOEEAssets = () => {
    const [OEEAssetsLoading, setLoading] = useState(false); 
    const [OEEAssetsError, setError] = useState(null); 
    const [OEEAssetsData, setData] = useState(null); 

    const getOEEAssets = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAssetOEEConfigs,{line_id: line_id })
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_prod_asset_oee_config) {
                    setData(returnData.neo_skeleton_prod_asset_oee_config)
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  OEEAssetsLoading, OEEAssetsData, OEEAssetsError, getOEEAssets };
};

export default useOEEAssets;