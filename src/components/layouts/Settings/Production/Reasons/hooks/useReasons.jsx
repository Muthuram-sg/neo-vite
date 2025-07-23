import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseReasons = () => {
    const [outGRLoading, setLoading] = useState(false);
    const [outGRData, setData] = useState(null);
    const [outGRError, setError] = useState(null);

    const getReasons = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getReasons, {})
            .then((productData) => {
                if (productData.neo_skeleton_prod_reasons) {
                    setData(productData.neo_skeleton_prod_reasons)
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
                console.log("NEW MODEL", e, "Getting Reasons Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outGRLoading, outGRData, outGRError, getReasons };
};

export default UseReasons;