import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTasks = () => {
    const [TasksLoading, setLoading] = useState(false);
    const [TasksData, setData] = useState(null);
    const [TasksError, setError] = useState(null);

    const getTasks  = async (body ) => {
        setLoading(true);

        configParam.RUN_GQL_API(Queries.GetTasks, body)
            .then((returnData) => {
                if(returnData !== undefined && returnData.neo_skeleton_tasks){
                    setData(returnData.neo_skeleton_tasks);
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
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { TasksLoading, TasksData, TasksError, getTasks };
}


export default useTasks;