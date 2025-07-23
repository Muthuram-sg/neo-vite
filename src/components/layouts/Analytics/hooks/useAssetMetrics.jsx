import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAssetMetrics = () => {
    const [AssetMetricsLoading, setLoading] = useState(false);
    const [AssetMetricsData, setData] = useState(null);
    const [AssetMetricsError, setError] = useState(null);

    const getAssetMetrics = async (assetArr) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssetMetrics, { asset_id: assetArr })
            .then((res) => {
                if (res !== undefined && res.neo_skeleton_prod_asset_oee_config) {
                    setData(res.neo_skeleton_prod_asset_oee_config)
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
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AssetMetricsLoading, AssetMetricsData, AssetMetricsError, getAssetMetrics };
};

export default useAssetMetrics;