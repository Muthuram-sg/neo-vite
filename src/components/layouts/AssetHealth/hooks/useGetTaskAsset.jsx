import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetTaskAsset = () => {
    const [taskLoading, setLoading] = useState(false);
    const [taskData, setData] = useState(null);
    const [taskError, setError] = useState(null);

    const getTask = async (fromDate, toDate, line_id, insType) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getTaskDataAssetWise, {fromDate: fromDate, toDate: toDate, line_id: line_id, id: insType })
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
    return { taskLoading, taskData, taskError, getTask };
};

export default useGetTaskAsset;