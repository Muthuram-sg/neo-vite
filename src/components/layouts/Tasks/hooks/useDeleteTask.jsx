import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useDeleteTask = () => {
    const [DeleteTaskLoading, setLoading] = useState(false); 
    const [DeleteTaskError, setError] = useState(null); 
    const [DeleteTaskData, setData] = useState(null); 

    const getDeleteTask = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.deleteTask,{taskid: id})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData.delete_neo_skeleton_tasks) { 
                    
                    setData([returnData.delete_neo_skeleton_tasks])
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
    return {  DeleteTaskLoading, DeleteTaskData, DeleteTaskError, getDeleteTask };
};

export default useDeleteTask;