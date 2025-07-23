import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import gqlQueries from "components/layouts/Queries";




const useDeleteInstrument = () => {
    const [DeleteInstrumentLoading, setLoading] = useState(false);
    const [DeleteInstrumentData, setData] = useState(null);
    const [DeleteInstrumentError, setError] = useState(null);




    const getDeleteInstrument = async (instrumentID) => {
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.duplicateInstrument, { id: instrumentID })
            .then(async (instrument_metrics) => {
                if (instrument_metrics !== undefined && instrument_metrics.neo_skeleton_instruments_metrics && instrument_metrics.neo_skeleton_instruments_metrics.length > 0) {
                    var metrics = instrument_metrics.neo_skeleton_instruments_metrics.map((val => val.metrics_id))
                    const result1 = await configParam.RUN_GQL_API(gqlQueries.getInstrumentMetricId, { metrics_id: metrics, instruments_id: instrumentID })
                        .then(async (response) => {
                            const data = response.neo_skeleton_instruments_metrics;
                            let map1 = data.map((val) => {
                                return val.id
                            });

                          return configParam.RUN_GQL_API(mutations.delAlertsV2, { insrument_metrics_id: map1 })
                                .then(async (response1) => {
                                    if (response1) {

                                        return configParam.RUN_GQL_API(mutations.deleteInstrumentMetrics, { instruments_id: instrumentID, metrics_id: metrics })
                                            .then((response2) => {

                                                if (response2 !== undefined && response2.delete_neo_skeleton_instruments_metrics) {
                                                    var deleted_metrics = response2.delete_neo_skeleton_instruments_metrics.affected_rows

                                                    return deleted_metrics === metrics.length;
                                                }
                                                else return false

                                            })

                                        
                                    }
                                    else return false
                                })
                            
                        })
                    setData(result1)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(true)
                    setError(false)
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

    return { DeleteInstrumentLoading, DeleteInstrumentData, DeleteInstrumentError, getDeleteInstrument };
}


export default useDeleteInstrument;