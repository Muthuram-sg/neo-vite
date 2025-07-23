import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteWorkOrder = () => {
    const [DeleteWorkOrderLoading, setLoading] = useState(false); 
    const [DeleteWorkOrderError, setError] = useState(null); 
    const [DeleteWorkOrderData, setData] = useState(null); 

    const getDeleteWorkOrder = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteWorkOrderWithRelations,{ id:id })
        
            .then((returnData) => {
                if (returnData) {
                    setData(returnData)
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
                console.log("NEW MODEL", "ERR", e, "WorkOrder Setting", new Date())
            });

    };
    return {  DeleteWorkOrderLoading, DeleteWorkOrderData, DeleteWorkOrderError, getDeleteWorkOrder };
};

export default useDeleteWorkOrder;