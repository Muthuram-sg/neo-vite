import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAssetOEE = () => {
    const [AssetOEEConfigsofEntityLoading, setLoading] = useState(false);
    const [AssetOEEConfigsofEntityData, setData] = useState(null);
    const [AssetOEEConfigsofEntityError, setError] = useState(null);

    const getAssetOEEConfigsofEntity = async (asset_id) => {
        setLoading(true);
        setData([])
        await configParam.RUN_GQL_API(gqlQueries.getAssetOEEConfigsofEntity, {asset_id:asset_id,from: "now()", to: "now()"})
            .then((productData) => {
                if (productData !== undefined && productData.neo_skeleton_prod_asset_oee_config) {
                    setData(productData.neo_skeleton_prod_asset_oee_config)
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
                console.log("NEW MODEL", e, "Asset OEE config in downtime report screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, getAssetOEEConfigsofEntity };
};

export default useAssetOEE;