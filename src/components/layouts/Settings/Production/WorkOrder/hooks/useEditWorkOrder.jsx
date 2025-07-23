import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useEditWorkOrder = () => {
    const [EditWorkOrderLoading, setLoading] = useState(false); 
    const [EditWorkOrderError, setError] = useState(null); 
    const [EditWorkOrderData, setData] = useState(null); 

    const getEditWorkOrder = async (datas,deldate,product,quantity,user_id,id,unit) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.editOrder,{ order_id: datas.orderID, start_dt: datas.stDate, end_dt: datas.eddate, qty: quantity, product_id: product, user_id: user_id,  delivery_date : deldate ,id : id,quantity_unit: unit })
        
            .then((returnData) => {
                if (returnData.update_neo_skeleton_prod_order) {
                    setData(returnData.update_neo_skeleton_prod_order)
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
    return {  EditWorkOrderLoading, EditWorkOrderData, EditWorkOrderError, getEditWorkOrder };
};

export default useEditWorkOrder;