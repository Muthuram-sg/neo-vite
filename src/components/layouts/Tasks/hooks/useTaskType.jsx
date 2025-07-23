import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useTaskType = () => {
    const [AddTaskTypeLoading, setLoading] = useState(false); 
    const [AddTaskTypeError, setError] = useState(null); 
    const [AddTaskTypeData, setData] = useState(null); 

    const getAddTaskType = async (title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.addTaskType,{task_type: title})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData.insert_neo_skeleton_task_types_one) { 
                    
                    setData([returnData.insert_neo_skeleton_task_types_one])
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
    return {  AddTaskTypeLoading, AddTaskTypeData, AddTaskTypeError, getAddTaskType };
};

export default useTaskType;