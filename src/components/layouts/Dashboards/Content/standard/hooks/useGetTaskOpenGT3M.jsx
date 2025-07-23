import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetTaskOpenGT3M = () => {
    const [TaskOpenGT3MLoading, setLoading] = useState(false);
    const [TaskOpenGT3MError, setError] = useState(null);
    const [TaskOpenGT3MData, setData] = useState(null);

    const getTaskOpenGT3M = async (lineID, date) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getTaskOpenGT3M, { line_id: lineID, date: date })

            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_tasks && returnData.neo_skeleton_tasks.length > 0) {

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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "CMS Dashboard", new Date())
            });

    };
    return { TaskOpenGT3MLoading, TaskOpenGT3MData, TaskOpenGT3MError, getTaskOpenGT3M };
};

export default useGetTaskOpenGT3M;