import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetWorkOrderWithStart = () => {
    const [GetWorkOrderWithStartLoading, setLoading] = useState(false);
    const [GetWorkOrderWithStartData, setData] = useState(null);
    const [GetWorkOrderWithStartError, setError] = useState(null);

    const getWorkOrderWithStart = async (line_id,start) => {
        setLoading(true);
        configParam.RUN_GQL_API(Queries.getLineWOSelectedTime,{line_id:line_id,start:start})
            .then((response) => { 
                if (response !== undefined && response.neo_skeleton_prod_order) {
                    setData(response.neo_skeleton_prod_order);
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

    return { GetWorkOrderWithStartLoading, GetWorkOrderWithStartData, GetWorkOrderWithStartError, getWorkOrderWithStart };
}


export default useGetWorkOrderWithStart;