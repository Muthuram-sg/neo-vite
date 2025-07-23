import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetSteelAssetProductCount = () => {
    const [SteelAssetLoading, setLoading] = useState(false);
    const [SteelAssetProductCount, setData] = useState(null);
    const [SteelAssetError, setError] = useState(null);

    const getSteelAssetProductCount = async (entity_id, product_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSteelAssetProductCount, { entity_id: entity_id, product_id: product_id })
            .then((returnData) => {
                if (returnData.neo_skeleton_steel_asset_config_aggregate) {
                    setData(returnData.neo_skeleton_steel_asset_config_aggregate.aggregate.count)
                    setError(true)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Get Steel Asset Count Setting", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { SteelAssetLoading, SteelAssetProductCount, SteelAssetError, getSteelAssetProductCount };
};

export default useGetSteelAssetProductCount;