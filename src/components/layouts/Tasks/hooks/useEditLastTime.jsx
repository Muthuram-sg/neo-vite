import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useEditLastTime = () => {
    const [EditLastTimeLoading, setLoading] = useState(false); 
    const [EditLastTimeError, setError] = useState(null); 
    const [EditLastTimeData, setData] = useState(null); 

    const getEditLastTime = async (taskId,LastRemindedTime) => {
            
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.updateTaskLastTime,{
            taskid: taskId, last_remainded_time : LastRemindedTime,
        })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_tasks) { 
                    console.log([returnData.update_neo_skeleton_tasks],"hook last time data")
                    setData([returnData.update_neo_skeleton_tasks])
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
    return {  EditLastTimeLoading, EditLastTimeError, EditLastTimeData, getEditLastTime };
};

export default useEditLastTime;