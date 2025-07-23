import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetTaskDataWithEntity = () => {
    const [entityWiseTaskLoading, setLoading] = useState(false);
    const [entityWiseTaskData, setData] = useState(null);
    const [entityWiseTaskError, setError] = useState(null);

    const getTaskDataWithEntity = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getTaskDataWithEntity, {entity_id: entity_id})
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
    return { entityWiseTaskLoading, entityWiseTaskData, entityWiseTaskError, getTaskDataWithEntity };
};

export default useGetTaskDataWithEntity;