import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentMetricId = () => {
    const [InstrumentMetricIdLoading, setLoading] = useState(false);
    const [InstrumentMetricIdData, setData] = useState(null);
    const [InstrumentMetricIdError, setError] = useState(null);

    const getInstrumentMetricId = async (difference,instrumentID) => {
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.getInstrumentMetricId, { metrics_id: difference, instruments_id: instrumentID })
            .then((response) => {
                if (response!== undefined && response.neo_skeleton_instruments_metrics) {
                  
                    setData(response.neo_skeleton_instruments_metrics);
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
                } 

            )
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { InstrumentMetricIdLoading, InstrumentMetricIdData, InstrumentMetricIdError, getInstrumentMetricId };
}


export default useInstrumentMetricId;