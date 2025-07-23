import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetExecutionOrderWithStart = () => {
    const [GetExecutionOrderWithStartLoading, setLoading] = useState(false);
    const [GetExecutionOrderWithStartData, setData] = useState(null);
    const [GetExecutionOrderWithStartError, setError] = useState(null);

    const getExecutionOrderWithStart = async (entity_id,start, end,btn) => {
        setLoading(true);
        let Query = Queries.getExecutionForSelectedTime
        if(btn === 11 || btn === 6){
            Query = Queries.getExecutionForCurrentTime
        }
        configParam.RUN_GQL_API(Query,{entity_id:entity_id,start:start,end:end})
            .then((response) => {
                // console.log(response,"response",Query)
                if (response !== undefined && response.neo_skeleton_prod_exec) {
                    setData(response.neo_skeleton_prod_exec);
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

    return { GetExecutionOrderWithStartLoading, GetExecutionOrderWithStartData, GetExecutionOrderWithStartError, getExecutionOrderWithStart };
}


export default useGetExecutionOrderWithStart;