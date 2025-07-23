import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useExecutionOrderList = () => {
    const [outOLLoading, setLoading] = useState(false);
    const [outOLData, setData] = useState(null);
    const [outOLError, setError] = useState(null);

    const getOrderList = async () => {
        setLoading(true);
        
        await configParam.RUN_GQL_API( gqlQueries.getExecution, {})
            .then((ExecutionData) => {
             
                if ( ExecutionData.neo_skeleton_prod_exec) 
                    {
                    setData(ExecutionData.neo_skeleton_prod_exec)
                   
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                  
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Getting Product Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
   
    return { outOLLoading, outOLData, outOLError, getOrderList };

};


export default useExecutionOrderList;
