import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useActionTaken = () => {
    const [ActionTakenListLoading, setLoading] = useState(false); 
    const [ActionTakenListError, setError] = useState(null); 
    const [ActionTakenListData, setData] = useState(null); 

    const getActionTakenList = async (mcc,scc) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetTaskActionTaken,{ mcc_id: mcc, scc_id: scc })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_task_feedback_action && returnData.neo_skeleton_task_feedback_action.length > 0) { 
                    const actionList = returnData.neo_skeleton_task_feedback_action.map(val=>{
                        return { ...val,"name": val.feedback_action, "id": val.id };
                    })
                    setData(actionList)
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
    return {  ActionTakenListLoading, ActionTakenListData, ActionTakenListError, getActionTakenList };
};

export default useActionTaken;