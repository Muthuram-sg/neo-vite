import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddInstrumentMetrics = () => {
    const [AddInstrumentMetricsLoading, setLoading] = useState(false);
    const [AddInstrumentMetricsData, setData] = useState(null);
    const [AddInstrumentMetricsError, setError] = useState(null);

    const getAddInstrumentMetrics = async ( instrumentMetricsArr ) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.addInstrumentMetrics,{ formMetrics: instrumentMetricsArr })
            .then((response) => {
                if (response!== undefined && response.insert_neo_skeleton_instruments_metrics) {
                    setData(response.insert_neo_skeleton_instruments_metrics);
            
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
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AddInstrumentMetricsLoading, AddInstrumentMetricsData, AddInstrumentMetricsError, getAddInstrumentMetrics };
}


export default useAddInstrumentMetrics;