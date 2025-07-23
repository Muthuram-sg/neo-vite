import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAssetPlantWise = () => {
    const [assetPlantWiseLoading, setLoading] = useState(false);
    const [assetPlantWiseData, setData] = useState(null);
    const [assetPlantWiseError, setError] = useState(null);

    const getAssetPlantWise = async (line_id, type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetAssetPlantWise, {line_id: line_id, instrument_type: type})
            .then((returnData) => {
                if (returnData.neo_skeleton_entity) {
                    setData(returnData.neo_skeleton_entity)
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
    return { assetPlantWiseLoading, assetPlantWiseData, assetPlantWiseError, getAssetPlantWise };
};

export default useGetAssetPlantWise;