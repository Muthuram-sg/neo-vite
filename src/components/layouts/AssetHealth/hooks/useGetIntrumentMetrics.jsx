import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetIntrumentMetrics = () => {
    const [instrumentMetricsLoading, setLoading] = useState(false);
    const [instrumentMetricsData, setData] = useState(null);
    const [instrumentMetricsError, setError] = useState(null);

    const getInstrumentMetrics = async (instruments_id) => {
        console.log("instruments_id", instruments_id)
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInsMetrics, {instruments_id: instruments_id})
            .then((returnData) => {
                console.log("returnData", returnData)
                if (returnData.neo_skeleton_instruments_metrics) {
                    setData(returnData.neo_skeleton_instruments_metrics)
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
    return { instrumentMetricsLoading, instrumentMetricsData, instrumentMetricsError, getInstrumentMetrics };
};

export default useGetIntrumentMetrics;