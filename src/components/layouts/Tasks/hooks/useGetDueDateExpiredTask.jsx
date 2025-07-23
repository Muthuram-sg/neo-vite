import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetDueDateExpiredTask = () => {
    const [TaskDueDateExpiredLoading, setLoading] = useState(false); 
    const [TaskDueDateExpiredError, setError] = useState(null); 
    const [TaskDueDateExpiredData, setData] = useState(null); 

    const groupByTaskTypeAndCount = (tasks) => {
        const taskTypeCounts = tasks.reduce((acc, task) => {
            const taskTypeId = task.taskType.id;
            if (!acc[taskTypeId]) {
                acc[taskTypeId] = 0;
            }
            acc[taskTypeId]++;
            return acc;
        }, {});
        return taskTypeCounts;
    };

    const getDueDateExpiredTask = async (lineID, due_Date) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getDueDateExpiredTaskGT60, { line_id: lineID, due_date: due_Date })
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_tasks) { 
                    const taskTypeCounts = groupByTaskTypeAndCount(returnData.neo_skeleton_tasks);
                    setData(taskTypeCounts);
                    setError(false);
                    setLoading(false);
                } else {
                    setData(null);
                    setError(true);
                    setLoading(false);
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Task", new Date());
            });
    };

    return { TaskDueDateExpiredLoading, TaskDueDateExpiredData, TaskDueDateExpiredError, getDueDateExpiredTask };
};

export default useGetDueDateExpiredTask;
