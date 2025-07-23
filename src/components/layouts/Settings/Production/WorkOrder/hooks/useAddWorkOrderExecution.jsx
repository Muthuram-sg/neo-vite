import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddWorkOrderExecution = () => {
    const [AddWorkOrderExecutionLoading, setLoading] = useState(false); 
    const [AddWorkOrderExecutionError, setError] = useState(null); 
    const [AddWorkOrderExecutionData, setData] = useState(null); 

    const getAddWorkOrderExecution = async (datas,eddate,entity_id,operator_id,user_id,line_id,status) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.addWorkExecution,{ order_id: datas.orderID, start_dt: datas.stDate, end_dt: eddate,operator_id :operator_id ,entity_id:entity_id, user_id: user_id, line_id: line_id  ,status : status })
        
            .then((returnData) => {
                if (returnData.insert_neo_skeleton_prod_exec_one) {
                    setData(returnData.insert_neo_skeleton_prod_exec_one)
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
                console.log("NEW MODEL", "ERR", e, "WorkOrderExecution Setting", new Date())
            });

    };
    return {  AddWorkOrderExecutionLoading, AddWorkOrderExecutionData, AddWorkOrderExecutionError, getAddWorkOrderExecution };
};

export default useAddWorkOrderExecution;