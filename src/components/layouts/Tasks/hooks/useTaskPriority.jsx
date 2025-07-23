import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTaskPriority = () => {
    const [PriorityListLoading, setLoading] = useState(false); 
    const [PriorityListError, setError] = useState(null); 
    const [PriorityListData, setData] = useState(null); 

    const getPriorityList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getTaskPriorities,{})
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_task_priority && returnData.neo_skeleton_task_priority.length > 0) { 
                    
                    setData(returnData.neo_skeleton_task_priority.filter(x=> x.id !== 1 && x.id !== 2 && x.id !== 3))
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
    return {  PriorityListLoading, PriorityListData, PriorityListError, getPriorityList };
};

export default useTaskPriority;