/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetGroupMetric = () => {
    const [GroupMetricLoading, setLoading] = useState(false);
    const [GroupMetricData, setData] = useState(null);
    const [GroupMetricError, setError] = useState(null);

    const getGroupMetrics = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getGroupMetrics, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_metrics_group) {
                    setData(returnData.neo_skeleton_metrics_group)
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
                console.log("NEW MODEL", e, "GateWay Setting", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { GroupMetricLoading, GroupMetricData, GroupMetricError, getGroupMetrics };
};

export default useGetGroupMetric;
