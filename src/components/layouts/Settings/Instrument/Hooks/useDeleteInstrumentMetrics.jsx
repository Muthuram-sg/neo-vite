import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteInstrumentMetrics = () => {
    const [DeleteInstrumentMetricsLoading, setLoading] = useState(false);
    const [DeleteInstrumentMetricsData, setData] = useState(null);
    const [DeleteInstrumentMetricsError, setError] = useState(null);

    const getDeleteInstrumentMetrics = async (instrumentID,difference) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.deleteInstrumentMetrics, { instruments_id: instrumentID, metrics_id: difference })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteInstrumentMetricsLoading, DeleteInstrumentMetricsData, DeleteInstrumentMetricsError, getDeleteInstrumentMetrics };
}


export default useDeleteInstrumentMetrics;