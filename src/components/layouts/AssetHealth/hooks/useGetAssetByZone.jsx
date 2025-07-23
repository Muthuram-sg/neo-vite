import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAssetByZone = () => {
    const [assetByZoneLoading, setLoading] = useState(false);
    const [assetByZoneData, setData] = useState(null);
    const [assetByZoneError, setError] = useState(null);

    const getAssetsByzone = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssetsByzone, {entity_id: entity_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_node_zone_mapping) {
                    setData(returnData.neo_skeleton_node_zone_mapping)
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { assetByZoneLoading, assetByZoneData, assetByZoneError, getAssetsByzone };
};

export default useGetAssetByZone;