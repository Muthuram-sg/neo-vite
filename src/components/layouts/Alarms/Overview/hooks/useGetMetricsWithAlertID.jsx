import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMetricsWithAlertID = () => {
    const [alarmMetricsLoading, setLoading] = useState(false);
    const [alarmMetricsData, setData] = useState(null);
    const [alarmMetricsError, setError] = useState(null);

    const getAlarmMetrics = async (alertIds) => {
        setLoading(true);
        try {
            const returnDataArray = await Promise.all(
                alertIds.map(async (alertId) => {
                    const returnData = await configParam.RUN_GQL_API(gqlQueries.getMetrics, { id: alertId });
                    return returnData.neo_skeleton_alerts_v2[0];
                })
            );
    
            const transformedDataArray = returnDataArray.map(item => {
                if (item) {
                    const { instruments_metric: { metric: { name: metric_name } }, ...rest } = item;
                    return { metric_name, ...rest };
                } else {
                    return [];
                }
            });
    
            // Combine all the transformed data into a single array
            const combinedData = transformedDataArray.reduce((acc, cur) => acc.concat(cur), []);
    
            setData(combinedData);
            setError(false);
            setLoading(false);
        } catch (error) {
            console.log("Error fetching data:", error);
            setLoading(false);
            setError(true);
            setData([]);
        }
    };    
    return { alarmMetricsLoading, alarmMetricsData, alarmMetricsError, getAlarmMetrics };
};

export default useGetMetricsWithAlertID;