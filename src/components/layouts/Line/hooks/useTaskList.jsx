import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTaskList = () => {
    const [TaskListLoading, setLoading] = useState(false);
    const [TaskListData, setData] = useState(null);
    const [TaskListError, setError] = useState(null);

    const getTaskList  = async (id ) => {
        setLoading(true);
        console.log("id",id)
        configParam.RUN_GQL_API(Queries.getTaskList,{"id": id })
            .then((returnData) => {
                if(returnData !== undefined && returnData.neo_skeleton_tasks){
                    console.log("returnData.neo_skeleton_tasks", returnData.neo_skeleton_tasks)
                    setData(returnData.neo_skeleton_tasks);
                    setError(false)
                    setLoading(false)
                }
                else{
                    setData([])
                    setError(true)
                    setLoading(false)
                    }
                
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            })
    }

    return { TaskListLoading, TaskListData, TaskListError, getTaskList };
}


export default useTaskList;