import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetTaskWiseAssetstatus = () => {
    const [taskWiseAssetstatusLoading, setLoading] = useState(false);
    const [taskWiseAssetstatusData, setData] = useState(null);
    const [taskWiseAssetstatusError, setError] = useState(null);

    const getTaskWiseAssetStatusCount = async (entity_id, insType) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getTaskWiseAssetStatus, {entity_id: entity_id, id: insType})
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
    return { taskWiseAssetstatusLoading, taskWiseAssetstatusData, taskWiseAssetstatusError, getTaskWiseAssetStatusCount };
};

export default useGetTaskWiseAssetstatus;