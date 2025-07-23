import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useProductQuantity = () => {
    const [productquantitylistLoading, setLoading] = useState(false);
    const [productquantitylistdata, setData] = useState(null);
    const [productquantitylisterror, setError] = useState(null);

    const getProductQuantityList = async (start_dt,end_dt,line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getProductQuantity, { start_dt : start_dt , end_dt : end_dt , line_id : line_id })
            .then(prodquantitylist => {
                if (prodquantitylist !== undefined && prodquantitylist.neo_skeleton_prod_exec) {
                    setData(prodquantitylist.neo_skeleton_prod_exec)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }


            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { productquantitylistLoading, productquantitylistdata, productquantitylisterror, getProductQuantityList };
}

export default useProductQuantity;
