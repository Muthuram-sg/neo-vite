import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAlarmAggregation = () => {
    const [alarmAggregationLoading, setLoading] = useState(false);
    const [alarmAggregationData, setData] = useState(null);
    const [alarmAggregationError, setError] = useState(null);

    const getAlarmAggregation = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getaggregate, {id: id})
            .then((returnData) => {
                if (returnData.neo_skeleton_alerts_v2) {
                    setData(returnData.neo_skeleton_alerts_v2[0].check_aggregate_window_function)
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
                console.log("NEW MODEL", e, "Alarm Overview", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { alarmAggregationLoading, alarmAggregationData, alarmAggregationError, getAlarmAggregation };
};

export default useGetAlarmAggregation;