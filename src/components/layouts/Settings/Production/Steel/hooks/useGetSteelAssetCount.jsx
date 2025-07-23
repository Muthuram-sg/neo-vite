import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetSteelAssetCount = () => {
    const [SteelAssetLoading, setLoading] = useState(false);
    const [SteelAssetData, setData] = useState(null);
    const [SteelAssetError, setError] = useState(null);

    const getSteelAsset = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetSteelAssetCount, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_entity_aggregate) {
                    setData(returnData.neo_skeleton_entity_aggregate.aggregate.count)
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
                console.log("NEW MODEL", e, "Get Steel Asset Count Setting", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { SteelAssetLoading, SteelAssetData, SteelAssetError, getSteelAsset };
};

export default useGetSteelAssetCount;