import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteSteelAssetConfig = () => {
    const [DeleteSteelAssetConfigLoading, setLoading] = useState(false);
    const [DeleteSteelAssetConfigError, setError] = useState(null);
    const [DeleteSteelAssetConfigData, setData] = useState(null);

    const getDeleteSteelAssetConfig = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteSteelAssetConfig, { id: id })

            .then((returnData) => {
                if (returnData.delete_neo_skeleton_steel_asset_config) {
                    setData(returnData.delete_neo_skeleton_steel_asset_config)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Steel Data Setting", new Date())
            });

    };
    return { DeleteSteelAssetConfigLoading, DeleteSteelAssetConfigData, DeleteSteelAssetConfigError, getDeleteSteelAssetConfig };
};

export default useDeleteSteelAssetConfig;