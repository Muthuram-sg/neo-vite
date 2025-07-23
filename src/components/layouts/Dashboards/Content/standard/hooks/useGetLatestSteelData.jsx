import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetLatestSteelData = () => {
    const [LatestSteelDataLoading, setLoading] = useState(false);
    const [LatestSteelDataError, setError] = useState(null);
    const [LatestSteelDataData, setData] = useState(null);

    const getLatestSteelDataForAutoPopulate = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getLatestSteelDataForAutoPopulate, { entity_id: entity_id })

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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "CMS Dashboard", new Date())
            });

    };
    return { LatestSteelDataLoading, LatestSteelDataData, LatestSteelDataError, getLatestSteelDataForAutoPopulate };
};

export default useGetLatestSteelData;