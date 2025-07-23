import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseProducts = () => {
    const [outGPLoading, setLoading] = useState(false);
    const [outGPData, setData] = useState(null);
    const [outGPError, setError] = useState(null);

    const getProduct = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getProducts, {})
            .then((productData) => {
                
                if (productData.neo_skeleton_prod_products) {
                    setData(productData.neo_skeleton_prod_products)
                   
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
    return { outGPLoading, outGPData, outGPError, getProduct };
};

export default UseProducts;