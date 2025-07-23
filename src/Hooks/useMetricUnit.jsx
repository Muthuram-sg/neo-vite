import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMetricUnit = () => {
    const [MetricUnitListLoading, setLoading] = useState(false);
    const [MetricUnitListData, setData] = useState(null);
    const [MetricUnitListError, setError] = useState(null);

    const getMetricUnit = async () => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getMetricUnit, {})
            .then((unitData) => {
                if (unitData !== undefined && unitData.neo_skeleton_metric_unit && unitData.neo_skeleton_metric_unit.length > 0) {
                    setData(unitData.neo_skeleton_metric_unit);
                    setError(false)
                    setLoading(false)

                } else {
                   
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

    return { MetricUnitListLoading, MetricUnitListData, MetricUnitListError, getMetricUnit };
}


export default useMetricUnit;