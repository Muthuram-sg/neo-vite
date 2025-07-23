import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetProductUnit = () => {
    const [ProductUnitsLoading, setLoading] = useState(false);
    const [ProductUnitsData, setData] = useState(null);
    const [ProductUnitsError, setError] = useState(null);

    const getProductUnit = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getProductUnit, {})
            .then((productData) => {
                //  console.log(productData,"original data ")
                if (productData.neo_skeleton_metric_unit) {
                    setData(productData.neo_skeleton_metric_unit)
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
    return { ProductUnitsLoading, ProductUnitsData, ProductUnitsError, getProductUnit };
};

export default useGetProductUnit;