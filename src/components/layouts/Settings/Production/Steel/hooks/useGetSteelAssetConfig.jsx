import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetSteelAssetConfig = () => {
    const [SteelAssetConfigLoading, setLoading] = useState(false);
    const [SteelAssetConfigData, setData] = useState(null);
    const [SteelAssetConfigError, setError] = useState(null);

    const getSteelAssetConfig = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSteelAssetConfig, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_steel_asset_config) {
                    setData(returnData.neo_skeleton_steel_asset_config)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Get Steel Asset Config Settings", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { SteelAssetConfigLoading, SteelAssetConfigData, SteelAssetConfigError, getSteelAssetConfig };
};

export default useGetSteelAssetConfig;