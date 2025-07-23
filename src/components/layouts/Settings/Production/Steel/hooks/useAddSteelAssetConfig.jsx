import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddSteelAssetConfig = () => {
    const [addSteelAssetConfigLoading, setLoading] = useState(false);
    const [addSteelAssetConfigData, setData] = useState(null);
    const [addSteelAssetConfigError, setError] = useState(null);

    const addSteelAssetConfig = async (configData) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addSteelAssetConfig, { entity_id: configData.entity_id, product_id: configData.product_id, line_id: configData.line_id, form_layout: configData.form_layout, user_id: configData.user_id})
            .then((response) => {
                setData(response.insert_neo_skeleton_steel_asset_config_one);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Add Steel asset config Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { addSteelAssetConfigLoading, addSteelAssetConfigData, addSteelAssetConfigError, addSteelAssetConfig };
}


export default useAddSteelAssetConfig;