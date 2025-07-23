import { useState } from "react";
import configParam from "config";

const useEditProduct = () => {
    const [editProductLoading, setLoading] = useState(false);
    const [editProductData, setData] = useState(null);
    const [editProductError, setError] = useState(null);

    const editProduct = async (productData) => {
        setLoading(true);
        let url = `/neonix-api/api/ProductMaster/EditProductMaster`;
        await configParam.RUN_REST_API(url, productData, '', '', "POST")
            .then((response) => {
                if (response) {
                    setData(response);
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, "Editing Product", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { editProductLoading, editProductData, editProductError, editProduct };
};

export default useEditProduct;
