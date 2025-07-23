import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddPriority = () => {
    const [AddTaskPriorityLoading, setLoading] = useState(false); 
    const [AddTaskPriorityError, setError] = useState(null); 
    const [AddTaskPriorityData, setData] = useState(null); 

    const getAddTaskPriority = async (title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.addTaskPriority,{task_level: title})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData.insert_neo_skeleton_task_priority_one) { 
                    
                    setData([returnData.insert_neo_skeleton_task_priority_one])
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
    return {  AddTaskPriorityLoading, AddTaskPriorityData, AddTaskPriorityError, getAddTaskPriority };
};

export default useAddPriority;