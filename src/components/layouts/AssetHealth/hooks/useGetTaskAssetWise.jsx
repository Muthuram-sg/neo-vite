import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetTaskAssetWise = () => {
    const [taskByAssetLoading, setLoading] = useState(false);
    const [taskByAssetData, setData] = useState(null);
    const [taskByAssetError, setError] = useState(null);

    const getTaskdetailsByEntity = async (entity_id, start, end) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getTaskdetailsByEntity, {entity_id: entity_id, start_date: start , end_date: end})
            .then((returnData) => {
                if (returnData.neo_skeleton_tasks) {
                    setData(returnData.neo_skeleton_tasks)
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
    return { taskByAssetLoading, taskByAssetData, taskByAssetError, getTaskdetailsByEntity };
};

export default useGetTaskAssetWise;