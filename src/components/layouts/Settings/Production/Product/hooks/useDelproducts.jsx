import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelproducts = () => {
    const [delproductswithoutIDLoading, setLoading] = useState(false);
    const [delproductswithoutIDData, setData] = useState(null);
    const [delproductswithoutIDError, setError] = useState(null);

    const getadelproductswithoutID = async (orderids,productid) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.deleteProductId, {product_id : productid   })
        .then(async(response) => {
            return configParam.RUN_GQL_API(mutations.deleteProductWithRelations, { order_id:orderids , product_id : productid })
            .then((response1) => {
                setData(response1);
                setError(false)
                setLoading(false)
            })
           
        })
       
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", e, "Deleted in product setting", new Date())
            })
    }

    return { delproductswithoutIDLoading, delproductswithoutIDData, delproductswithoutIDError, getadelproductswithoutID };
}


export default useDelproducts;