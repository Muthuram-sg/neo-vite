import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetSteelProducts = () => {
    const [SteelProductLoading, setLoading] = useState(false);
    const [SteelProductData, setData] = useState(null);
    const [SteelProductError, setError] = useState(null);

    const getSteelProduct = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSteelProducts)
            .then((returnData) => {
                if (returnData.neo_skeleton_steel_products) {
                    setData(returnData.neo_skeleton_steel_products)
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
                console.log("NEW MODEL", e, "Get Steel Products", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { SteelProductLoading, SteelProductData, SteelProductError, getSteelProduct };
};

export default useGetSteelProducts;