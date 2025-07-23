import { useState } from "react";
import configParam from "config";

const useCreateProduct = () => {
    const [createProductLoading, setLoading] = useState(false);
    const [createProductData, setData] = useState(null);
    const [createProductError, setError] = useState(null);

    const createProduct = async (productData) => {
        setLoading(true);
        let url = `/neonix-api/api/ProductMaster/CreateProductMaster`;
        await configParam.RUN_REST_API(url, productData, '', '', "POST")
            .then((response) => {
                console.log("NEW MODEL", "API RESPONSE", response, "Creating Product", new Date());
                if (response) {
                    if (typeof response === "string") {
                        setData(response); // Wrap the string in an object
                    } else {
                        setData(response && response.response ? response.response : null); // Use the object directly
                    }
                  
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, "Creating Product", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { createProductLoading, createProductData, createProductError, createProduct };
};

export default useCreateProduct;
