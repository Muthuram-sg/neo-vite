import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";


const useMultipleAssetOEEConfig  = () => {
    const [multipleAssetOEEConfigLoading, setLoading] = useState(false);
    const [multipleAssetOEEConfigData, setData] = useState(null);
    const [multipleAssetOEEConfigError, setError] = useState(null);

    const getMultipleAssetOEEConfig = async (downtimeAsset) => {

        setLoading(true);
        configParam.RUN_GQL_API(gqlQueries.getMultipleAssetOEEConfig, { asset_id: downtimeAsset })

        .then((oeeData) => {
            if (oeeData !== undefined && oeeData.neo_skeleton_prod_asset_oee_config && oeeData.neo_skeleton_prod_asset_oee_config.length > 0) {
                setData(oeeData.neo_skeleton_prod_asset_oee_config);
                setError(false)
                setLoading(false)
            }
             else{

                setData([]);
                setError(false)
                setLoading(false)
            }
        })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { multipleAssetOEEConfigLoading, multipleAssetOEEConfigData, multipleAssetOEEConfigError, getMultipleAssetOEEConfig };
}


export default useMultipleAssetOEEConfig;