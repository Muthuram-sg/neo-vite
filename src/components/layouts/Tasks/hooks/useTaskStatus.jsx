import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTaskStatus = () => {
    const [StatusListLoading, setLoading] = useState(false); 
    const [StatusListError, setError] = useState(null); 
    const [StatusListData, setData] = useState(null); 

    const getStatusList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getTaskStatus,{})
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_task_status && returnData.neo_skeleton_task_status.length > 0) { 
                    
                    setData(returnData.neo_skeleton_task_status)
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
    return {  StatusListLoading, StatusListData, StatusListError, getStatusList };
};

export default useTaskStatus;