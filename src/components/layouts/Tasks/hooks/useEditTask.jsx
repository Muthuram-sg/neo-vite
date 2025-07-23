import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useEditTask = () => {
    const [EditTaskLoading, setLoading] = useState(false); 
    const [EditTaskError, setError] = useState(null); 
    const [EditTaskData, setData] = useState(null); 

    const getEditTask = async (datas, comments,
        reasonStart, observedDate, observedBy, 
        reportedBy, instrumentID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.updateTask,{
            taskid: datas.taskId, title: datas.title, type: datas.type, priority: datas.priority,
            status:datas.status, entity_id: datas.entity, assingee: datas.assignee,
            description: datas.description, due_date: datas.dueDate, updated_by: datas.userid,
            action_taken: datas.actionTaken, action_recommended: datas.actionRecommended, 
            fault_mode: datas.faultModeID, instrument_status_type_id: datas.instrumentStatusID, comments: comments,
            action_taken_date: reasonStart, observed_date: observedDate, observed_by: observedBy, 
            reported_by: reportedBy, instrument_id: instrumentID,mcc_id: datas.mcc_id,scc_id:datas.scc_id,reported_date: datas.reportedDate,
            task_closed_by: datas.task_closed_by
        })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_tasks) { 
                    
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
    return {  EditTaskLoading, EditTaskData, EditTaskError, getEditTask };
};

export default useEditTask;