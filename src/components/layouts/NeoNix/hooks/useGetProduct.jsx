import { useState } from "react";
import configParam from "config";

const useGetProduct = () => {
    const [productLoading, setLoading] = useState(false);
    const [productData, setData] = useState(null);
    const [productError, setError] = useState(null);

    const getproduct = async () => {
        setLoading(true);
        const url = '/neonix-api/api/ProductMaster/GetProductMaster';

        await configParam.RUN_REST_API(url, "", "", "", "Get")
            .then((response) => {
                if (response !== undefined && response) {
                    setData(response.response);
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.error("API FAILURE", e);
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return {
        productLoading,
        productData,
        productError,
        getproduct,
    };
};

export default useGetProduct;
