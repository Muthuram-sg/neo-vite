import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddTask = () => {
    const [AddTaskLoading, setLoading] = useState(false); 
    const [AddTaskError, setError] = useState(null); 
    const [AddTaskData, setData] = useState(null); 

    const getAddTask = async (datas,actionRecommended,faultModeID,instrumentStatusID,actionTaken,actionTakenDate,comments) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.addTask,{
            title: datas.title, description: datas.description, entity_id: datas.entity, instrument_id: datas.instrumentID, assingee: datas.assignee,observed_date: datas.observedDate, observed_by: datas.observedBy, reported_by: datas.reportedBy, due_date: datas.dueDate,
            type: datas.type, priority: datas.priority, status: datas.status, created_by: datas.userid, updated_by: datas.userid, 
            action_recommended: actionRecommended ? actionRecommended : "", 
            fault_mode: faultModeID, action_taken: actionTaken, action_taken_date: actionTakenDate,
            comments: comments, instrument_status_type_id: instrumentStatusID,mcc_id: datas.mcc_id,scc_id:datas.scc_id,reported_date: datas.reportedDate
        })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.insert_neo_skeleton_tasks_one) { 
                    
                    setData([returnData.insert_neo_skeleton_tasks_one])
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
    return {  AddTaskLoading, AddTaskData, AddTaskError, getAddTask };
};

export default useAddTask;