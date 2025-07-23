import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddStatus = () => {
    const [AddTaskStatusLoading, setLoading] = useState(false); 
    const [AddTaskStatusError, setError] = useState(null); 
    const [AddTaskStatusData, setData] = useState(null); 

    const getAddTaskStatus = async (title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.addTaskStatus,{status: title})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData.insert_neo_skeleton_task_status_one) { 
                    
                    setData([returnData.insert_neo_skeleton_task_status_one])
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
    return {  AddTaskStatusLoading, AddTaskStatusData, AddTaskStatusError, getAddTaskStatus };
};

export default useAddStatus;