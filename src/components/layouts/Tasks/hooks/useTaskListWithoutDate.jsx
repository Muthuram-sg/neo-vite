import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTaskListFull = () => {
    const [TaskListLoading, setLoading] = useState(false); 
    const [TaskListError, setError] = useState(null); 
    const [TaskListDataFull, setData] = useState(null); 

    const getTaskListWithoutDate = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.taskListFull,{ line_id: lineID })
 
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_tasks) {  
                 console.log("returnData.neo_skeleton_tasks",returnData.neo_skeleton_tasks)
                    setData(returnData.neo_skeleton_tasks)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  TaskListLoading, TaskListDataFull, TaskListError, getTaskListWithoutDate };
};

export default useTaskListFull;