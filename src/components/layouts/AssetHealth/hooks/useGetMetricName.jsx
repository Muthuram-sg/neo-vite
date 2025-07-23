import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMetricName = () => {
    const [metricnameLoading, setLoading] = useState(false);
    const [metricnameData, setData] = useState(null);
    const [metricnameError, setError] = useState(null);

    const getmetricname = async (name) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getmetricname, {name: name})
            .then((returnData) => {
                if (returnData.neo_skeleton_metrics) {
                    setData(returnData.neo_skeleton_metrics)
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { metricnameLoading, metricnameData, metricnameError, getmetricname };
};

export default useGetMetricName;