import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddWorkOrder = () => {
    const [AddWorkOrderLoading, setLoading] = useState(false); 
    const [AddWorkOrderError, setError] = useState(null); 
    const [AddWorkOrderData, setData] = useState(null); 

    const getAddWorkOrder = async (datas,deldate,product,quantity,user_id,line_id,unit) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.addOrder,{ order_id: datas.orderID, start_dt: datas.stDate, end_dt: datas.eddate, qty: quantity, product_id: product, user_id: user_id, line_id: line_id , delivery_date : deldate,quantity_unit: unit  })
        
            .then((returnData) => {
                if (returnData.insert_neo_skeleton_prod_order_one) {
                    setData(returnData.insert_neo_skeleton_prod_order_one)
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
    return {  AddWorkOrderLoading, AddWorkOrderData, AddWorkOrderError, getAddWorkOrder };
};

export default useAddWorkOrder;