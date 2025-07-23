import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetDryerCount = () => {
    const [DryerCountLoading, setLoading] = useState(false);
    const [DryerCountData, setData] = useState(null);
    const [DryerCountError, setError] = useState(null);

    const getDryerCount = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getDryerCountForLine, {line_id:id})
            .then((productData) => {
               
                if (productData.neo_skeleton_dryer_config_aggregate.aggregate.count) {
                    setData(productData.neo_skeleton_dryer_config_aggregate.aggregate.count)
                   
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
    return { DryerCountLoading, DryerCountData, DryerCountError, getDryerCount };
};

export default useGetDryerCount;