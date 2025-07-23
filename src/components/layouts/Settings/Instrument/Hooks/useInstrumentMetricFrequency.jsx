import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentMetricFrequency = () => {
    const [InstrumentMetricFrequencyLoading, setLoading] = useState(false);
    const [InstrumentMetricFrequencyData, setData] = useState(null);
    const [InstrumentMetricFrequencyError, setError] = useState(null);

    const getInstrumentMetricFrequency = async (instruments_id) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getFrequency, {instruments_id: instruments_id })
            .then((FrequencyList) => {
                if (FrequencyList !== undefined && FrequencyList.neo_skeleton_instruments_metrics ) {
                    setData(FrequencyList.neo_skeleton_instruments_metrics);
                    setError(false)
                    setLoading(false)
                } else {
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

    return { InstrumentMetricFrequencyLoading, InstrumentMetricFrequencyData, InstrumentMetricFrequencyError, getInstrumentMetricFrequency };
}


export default useInstrumentMetricFrequency;