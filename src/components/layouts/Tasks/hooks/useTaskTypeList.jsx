import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useTaskTypeList = () => {
    const [TypeListLoading, setLoading] = useState(false); 
    const [TypeListError, setError] = useState(null); 
    const [TypeListData, setData] = useState(null); 

    const getTypeList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getTasksTypes,{})
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_task_types && returnData.neo_skeleton_task_types.length > 0) { 
                    
                    setData(returnData.neo_skeleton_task_types.filter(x=> x.id === 29 || x.id === 30 || x.id === 28)) 
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
    return {  TypeListLoading, TypeListData, TypeListError, getTypeList };
};

export default useTaskTypeList;