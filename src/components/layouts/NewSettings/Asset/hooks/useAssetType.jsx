import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseAssetType = () => {
    const [AssetTypeLoading, setLoading] = useState(false);
    const [AssetTypeData, setData] = useState(null);
    const [AssetTypeError, setError] = useState(null);

    const getAssetType = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetAssetType)
            .then((returnData) => {
              
                if (returnData.neo_skeleton_asset_types) {
                    setData(returnData.neo_skeleton_asset_types)
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
                console.log("NEW MODEL", e, "Entity Setting - Asset Type", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType };
};

export default UseAssetType;