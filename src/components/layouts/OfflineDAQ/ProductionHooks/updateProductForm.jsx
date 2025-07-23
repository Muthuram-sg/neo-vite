import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useEditProduct = () => {
    const [EditProductLoading, setLoading] = useState(false); 
    const [EditProductError, setError] = useState(null); 
    const [EditProductData, setData] = useState(null); 

    const getEditProduct = async (id,user_id,form_name) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.OfflineProductUpdate,{ id: id,form_name: form_name,updated_by: user_id, })
        
            .then((returnData) => {
                if (returnData.update_neo_skeleton_production_form) {
                    setData(returnData.update_neo_skeleton_production_form.affected_rows)
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  EditProductLoading, EditProductData, EditProductError, getEditProduct };
};

export default useEditProduct;