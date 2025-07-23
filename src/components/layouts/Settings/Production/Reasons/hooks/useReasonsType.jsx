import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseReasonsType = () => {
    const [outRTYLoading, setLoading] = useState(false);
    const [outRTYData, setData] = useState(null);
    const [outRTYError, setError] = useState(null);

    const getReasonTypes = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getReasonTypes, {})
            .then((productData) => {
                if (productData.neo_skeleton_prod_reason_types) {
                    setData(productData.neo_skeleton_prod_reason_types)
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
                console.log("NEW MODEL", e, "Getting Reasons Type Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outRTYLoading, outRTYData, outRTYError, getReasonTypes };
};

export default UseReasonsType;