import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetCurrentOperator = () => {
    const [GetCurrentOperatorLoading, setLoading] = useState(false);
    const [GetCurrentOperatorData, setData] = useState(null);
    const [GetCurrentOperatorError, setError] = useState(null);

    const getGetCurrentOperator = async (entity_id,start,end) => {
        setLoading(true);
        configParam.RUN_GQL_API(Queries.getCurrentShiftOperator,{entity_id:entity_id,start:start,end:end})
            .then((response) => {
                // console.log(response,response)
                if (response !== undefined && response.neo_skeleton_prod_operator) {
                    setData(response.neo_skeleton_prod_operator);
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

    return { GetCurrentOperatorLoading, GetCurrentOperatorData, GetCurrentOperatorError, getGetCurrentOperator };
}


export default useGetCurrentOperator;