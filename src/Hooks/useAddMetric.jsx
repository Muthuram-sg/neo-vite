import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddMetric = () => {
    const [AddMetricLoading, setLoading] = useState(false);
    const [AddMetricData, setData] = useState(null);
    const [AddMetricError, setError] = useState(null);

    const getAddMetric = async (DataTypeID, UnitID, masterMetric, MetricTitle, MetrictypeID, typeID) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.addMetric, { metric_datatype: DataTypeID, metric_unit: UnitID, name: masterMetric, title: MetricTitle, type: MetrictypeID, instrument_type: typeID })
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_metrics_one) {
                    setData(response.insert_neo_skeleton_metrics_one);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AddMetricLoading, AddMetricData, AddMetricError, getAddMetric };
}


export default useAddMetric;