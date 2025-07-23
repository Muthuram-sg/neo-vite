import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetOverallTask = () => {
    const [taskDataLoading, setLoading] = useState(false);
    const [taskDataData, setData] = useState(null);
    const [taskDataError, setError] = useState(null);

    const getOverallTaskData = async (ins_type,line_id, start, end) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getOverallTaskData, {instrument_type: ins_type, line_id: line_id, start_date: start , end_date: end})
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
    return { taskDataLoading, taskDataData, taskDataError, getOverallTaskData };
};

export default useGetOverallTask;