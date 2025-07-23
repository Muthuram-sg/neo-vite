import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAssetSteelData = () => {
    const [SteelAssetDataLoading, setLoading] = useState(false);
    const [SteelAssetData, setData] = useState(null);
    const [SteelAssetDataError, setError] = useState(null);

    const getSteelAssetData = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSteelAssetData, {entity_id:entity_id})
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_steel_data && returnData.neo_skeleton_steel_data.length > 0) {
                   
                    setData(returnData.neo_skeleton_steel_data)
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
                console.log("NEW MODEL", e, "Get Steel Asset Data", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { SteelAssetDataLoading, SteelAssetData, SteelAssetDataError, getSteelAssetData };
};

export default useGetAssetSteelData;