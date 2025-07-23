import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateMetric = () => {
    const [UpdateMetricLoading, setLoading] = useState(false);
    const [UpdateMetricData, setData] = useState(null);
    const [UpdateMetricError, setError] = useState(null);

    const getUpdateMetric = async (metric_id,instrument_type,metric_datatype,metric_unit,name,title,type) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.UpdateMetric, {metric_id: metric_id,instrument_type: instrument_type, metric_datatype: metric_datatype, metric_unit: metric_unit, name: name, title: title, type: type})
            .then((response) => {
                if (response !== undefined && response.update_neo_skeleton_metrics) {
                    setData(response.update_neo_skeleton_metrics);
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

    return { UpdateMetricLoading, UpdateMetricData, UpdateMetricError, getUpdateMetric };
}


export default useUpdateMetric;