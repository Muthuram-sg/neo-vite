import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAssetOEEofLine = () => {
    const [AssetOEEConfigsofLineLoading, setLoading] = useState(false);
    const [AssetOEEConfigsofLineData, setData] = useState(null);
    const [AssetOEEConfigsofLineError, setError] = useState(null);

    const getAssetOEEConfigsofLine = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssetOEEConfigsofLine, {line_id:line_id})
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
                console.log("NEW MODEL", e, "Asset OEE config of Line in downtime report screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AssetOEEConfigsofLineLoading, AssetOEEConfigsofLineData, AssetOEEConfigsofLineError, getAssetOEEConfigsofLine };
};

export default useAssetOEEofLine;