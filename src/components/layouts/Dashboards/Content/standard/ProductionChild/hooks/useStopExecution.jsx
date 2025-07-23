import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useStopExecution = () => {
    const [StopExecutionLoading, setLoading] = useState(false);
    const [StopExecutionData, setData] = useState(null);
    const [StopExecutionError, setError] = useState(null);

    const getStopExecution = async (id,end_dt,stat) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.WOStopExecution,{id:id,end_dt:end_dt,status: stat})
            .then((response) => { 
                if (response !== undefined && response.update_neo_skeleton_prod_exec) {
                    setData(response.update_neo_skeleton_prod_exec);
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { StopExecutionLoading, StopExecutionData, StopExecutionError, getStopExecution };
}


export default useStopExecution;