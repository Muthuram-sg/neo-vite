import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useProductList = () => {
    const [ProductListLoading, setLoading] = useState(false);
    const [ProductListData, setData] = useState(null);
    const [ProductListError, setError] = useState(null); 
    const getProductList = async () => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getProducts, {})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_prod_products) {
                    setData(response.neo_skeleton_prod_products)
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
            });

    };
    return { ProductListLoading, ProductListData, ProductListError, getProductList };
};

export default useProductList;