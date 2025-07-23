import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateSteelAssetConfig = () => {
    const [updateSteelAssetConfigLoading, setLoading] = useState(false);
    const [updateSteelAssetConfigData, setData] = useState(null);
    const [updateSteelAssetConfigError, setError] = useState(null);

    const updateSteelAssetConfig = async (configData) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.updateSteelAssetConfig, { entity_id: configData.entity_id, product_id: configData.steel_product_id, line_id: configData.line_id, form_layout: configData.form_layout, user_id: configData.created_by, id: configData.id})
            .then((response) => {
                setData(response.update_neo_skeleton_steel_asset_config);
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

    return { updateSteelAssetConfigLoading, updateSteelAssetConfigData, updateSteelAssetConfigError, updateSteelAssetConfig };
}


export default useUpdateSteelAssetConfig;