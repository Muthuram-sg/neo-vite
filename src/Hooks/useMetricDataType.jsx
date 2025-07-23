import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMetricDataType = () => {
    const [MetricDataTypeListLoading, setLoading] = useState(false);
    const [MetricDataTypeListData, setData] = useState(null);
    const [MetricDataTypeListError, setError] = useState(null);

    const getMetricDataType = async () => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getMetricDataType, {})
            .then((DataType) => {
                if (DataType !== undefined && DataType.neo_skeleton_metric_datatype && DataType.neo_skeleton_metric_datatype.length > 0) {
                    setData(DataType.neo_skeleton_metric_datatype);
                    setError(false)
                    setLoading(false)
                } else {
                    console.log("getMetricUnit unitData undefined");
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { MetricDataTypeListLoading, MetricDataTypeListData, MetricDataTypeListError, getMetricDataType };
}


export default useMetricDataType;