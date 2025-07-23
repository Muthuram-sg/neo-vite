import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMetricsforInstrumentwithID = () => {
    const [metricsforinstrumentLoading, setLoading] = useState(false);
    const [metricsforinstrumentData, setData] = useState(null);
    const [metricsforinstrumentError, setError] = useState(null);

    const getMetricsforInstrumentwithID = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getMetricsForInstrumentWithID, {id : id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_instruments_metrics && response.neo_skeleton_instruments_metrics.length > 0) {
                    setData(response.neo_skeleton_instruments_metrics)
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
                console.log("NEW MODEL", e, "Explore", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { metricsforinstrumentLoading, metricsforinstrumentData, metricsforinstrumentError, getMetricsforInstrumentwithID };
};

export default useMetricsforInstrumentwithID;