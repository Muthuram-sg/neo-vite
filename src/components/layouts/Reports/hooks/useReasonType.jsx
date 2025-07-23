import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useReasonType = () => {
    const [ReasonTypeLoading, setLoading] = useState(false); 
    const [ReasonTypeError, setError] = useState(null); 
    const [ReasonTypeData, setData] = useState(null); 

    const getReasonType = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getReasonTypes)
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_prod_reason_types) {
                    setData(returnData.neo_skeleton_prod_reason_types)
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
    return {  ReasonTypeLoading, ReasonTypeData, ReasonTypeError, getReasonType };
};

export default useReasonType;