import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useAllTask = () => {
    const [allTaskListLoading, setLoading] = useState(false); 
    const [allTaskListError, setError] = useState(null); 
    const [allTaskListData, setData] = useState(null); 

    const getAllTaskList = async (lineID, startDate, endDate, insType) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.alltasklist,{ line_id: lineID, from: startDate, to: endDate, instrument_type : insType })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_tasks) { 
                    
                    setData(returnData.neo_skeleton_tasks)
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
    return {  allTaskListLoading, allTaskListData, allTaskListError, getAllTaskList };
};

export default useAllTask;