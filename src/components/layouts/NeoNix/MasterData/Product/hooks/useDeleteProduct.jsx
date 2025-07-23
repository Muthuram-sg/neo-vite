import { useState } from "react";
import configParam from "config";

const useDeleteProduct = () => {
    const [deleteProductLoading, setLoading] = useState(false);
    const [deleteProductData, setData] = useState(null);
    const [deleteProductError, setError] = useState(null);

    const deleteProduct = async (productId) => {
        setLoading(true);
        let url = `/neonix-api/api/ProductMaster/RemoveProductMaster`;
        await configParam.RUN_REST_API(url, productId, '', '', "DELETE")
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
                console.log("NEW MODEL", "API FAILURE", e, "Deleting Product", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { deleteProductLoading, deleteProductData, deleteProductError, deleteProduct };
};

export default useDeleteProduct;
