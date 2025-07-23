import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateExecution = () => {
    const [updateExecutionLoading, setLoading] = useState(false); 
    const [updateExecutionError, setError] = useState(null); 
    const [updateExecutionData, setData] = useState(null); 

    const getupdateExecution = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateExecution,body)
        
            .then((returnData) => {
                
                if (returnData.update_neo_skeleton_prod_exec && returnData.update_neo_skeleton_prod_exec.affected_rows>0) {
                    setData(returnData.update_neo_skeleton_prod_exec.affected_rows)
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  updateExecutionLoading, updateExecutionData, updateExecutionError, getupdateExecution };
};

export default useUpdateExecution;