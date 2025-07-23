import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMetricsList = () => {
    const [metricsListLoading, setLoading] = useState(false);
    const [metricsListData, setData] = useState(null);
    const [metricsListError, setError] = useState(null); 
    const metricsList = async (line_id) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getParameterList, {})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_metrics) {
                    setData(response.neo_skeleton_metrics)
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
    return { metricsListLoading, metricsListData, metricsListError, metricsList };
};

export default useMetricsList;