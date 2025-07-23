import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMetricId = () => {
    const [insMetricLoading, setLoading] = useState(false);
    const [insMetricData, setData] = useState(null);
    const [insMetricError, setError] = useState(null);

    const InstrumentWiseMetric = async (name, title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.InstrumentWiseMetric, { name: name, title : title })
        .then(async (instrument_metric) => {
                const data = instrument_metric.neo_skeleton_metrics
                if (data ) {
                    setData(data) 
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Trends", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { insMetricLoading, insMetricData, insMetricError, InstrumentWiseMetric };
};

export default useGetMetricId;