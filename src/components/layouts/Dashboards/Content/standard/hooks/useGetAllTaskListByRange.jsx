import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAllTaskListByRange = () => {
    const [TaskListByRangeLoading, setLoading] = useState(false); 
    const [TaskListByRangeError, setError] = useState(null); 
    const [TaskListByRangeData, setData] = useState(null); 

    const getAllTaskListByRange = async (lineID, startDate, endDate) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAllTaskListByRange,{ line_id: lineID, from: startDate, to: endDate})
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_tasks && returnData.neo_skeleton_tasks.length > 0) { 
                    
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
                console.log("NEW MODEL", "ERR", e, "CMS Dashboard", new Date())
            });

    };
    return {  TaskListByRangeLoading, TaskListByRangeData, TaskListByRangeError, getAllTaskListByRange };
};

export default useGetAllTaskListByRange;