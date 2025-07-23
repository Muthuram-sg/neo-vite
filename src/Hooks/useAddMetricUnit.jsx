import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddMetricUnit = () => {
    const [AddMetricUnitLoading, setLoading] = useState(false);
    const [AddMetricUnitData, setData] = useState(null);
    const [AddMetricUnitError, setError] = useState(null);

    const getAddMetricUnit = async (MetricUnit, MetricUnitDesc) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.addMetricUnit, { unit: MetricUnit, description: MetricUnitDesc })
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_metric_unit_one) {
                    setData(response.insert_neo_skeleton_metric_unit_one);
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

    return { AddMetricUnitLoading, AddMetricUnitData, AddMetricUnitError, getAddMetricUnit };
}


export default useAddMetricUnit;