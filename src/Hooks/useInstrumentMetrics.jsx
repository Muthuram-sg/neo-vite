import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentMetrics = () => {
    const [instrumentMetricsListLoading, setLoading] = useState(false);
    const [instrumentMetricsListData, setData] = useState(null);
    const [instrumentMetricsListError, setError] = useState(null); 
    const instrumentMetricsList = async (id) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentMetrics, {line_id: id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_instruments_metrics) {
                    setData(response.neo_skeleton_instruments_metrics)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { instrumentMetricsListLoading, instrumentMetricsListData, instrumentMetricsListError, instrumentMetricsList };
};

export default useInstrumentMetrics;
