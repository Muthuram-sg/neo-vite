import { useState } from "react";
import configParam from "config";

const useGetProduct = () => {
    const [getProductLoading, setLoading] = useState(false);
    const [getProductData, setData] = useState(null);
    const [getProductError, setError] = useState(null);

    const getProduct = async () => {
        setLoading(true); 
        let url = `/neonix-api/api/ProductMaster/GetProductMaster`;
        await configParam.RUN_REST_API(url, '', '', '', "GET")
            .then((response) => {
                if (response && response.response) {
                    setData(response.response);
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, "Fetching Products", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { getProductLoading, getProductData, getProductError, getProduct };
};

export default useGetProduct;
