import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAssetCountPlantWise = () => {
    const [assetCountPlantWiseLoading, setLoading] = useState(false);
    const [assetCountPlantWiseData, setData] = useState(null);
    const [assetCountPlantWiseError, setError] = useState(null);

    const getAssetCountPlantWise = async (line_id, type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssetCountPlantWise, {line_id: line_id, instrument_type:type})
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { assetCountPlantWiseLoading, assetCountPlantWiseData, assetCountPlantWiseError, getAssetCountPlantWise };
};

export default useGetAssetCountPlantWise;