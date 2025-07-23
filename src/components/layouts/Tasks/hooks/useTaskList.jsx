import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTaskList = () => {
    const [TaskListLoading, setLoading] = useState(false); 
    const [TaskListError, setError] = useState(null); 
    const [TaskListData, setData] = useState(null); 

    const getTaskList = async (lineID, startDate, endDate) => {
        console.log(lineID, startDate, endDate,"lineID, startDate, endDate")
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.taskList,{ line_id: lineID, from: startDate, to: endDate })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_tasks) { 
                    console.log(returnData.neo_skeleton_tasks,"hook data")
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
    return {  TaskListLoading, TaskListData, TaskListError, getTaskList };
};

export default useTaskList;