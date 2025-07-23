import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetInstrumentMetricsByInsId = () => {
    const [InstrumentMetricsByInsIdLoading, setLoading] = useState(false);
    const [InstrumentMetricsByInsIdData, setData] = useState(null);
    const [InstrumentMetricsByInsIdError, setError] = useState(null);



    const getInstrumentMetricsByInsId = async (instrumentID, metrics_id) => {
        setLoading(true);
        configParam.RUN_GQL_API(gqlQueries.getInstrumentMetricIdByInsId, { instruments_id: instrumentID, metrics_id : metrics_id })
            .then(async (instrument_metrics) => {
                const data = instrument_metrics.neo_skeleton_instruments_metrics;

                if (data.length > 0) {
                    let map1 = data.map((val) => {
                        
                        return val.id
                    })
                        setData(map1)
                        setError(false)
                        setLoading(false)
                } else {
                    setData(null)
                    setError(false)
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

    return { InstrumentMetricsByInsIdLoading, InstrumentMetricsByInsIdData, InstrumentMetricsByInsIdError, getInstrumentMetricsByInsId };
}


export default useGetInstrumentMetricsByInsId;