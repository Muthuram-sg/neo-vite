import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import gqlQueries from "components/layouts/Queries";



//Hook to finalise the list of forecast metrics associated with an instrument
const useUpdateInstrumentMetricForecast = () => {
    const [UpdateInstrumentMetricForecastLoading, setLoading] = useState(false);
    const [UpdateInstrumentMetricForecastData, setData] = useState(null);
    const [UpdateInstrumentMetricForecastError, setError] = useState(null);




    const getUpdateInstrumentMetricForecast = async (instrumentID, line_id, formulaName, categoryID, typeID, user_id, extMetric, newMetric, currUser, insFreq, metricsID, offline, isforecast, extFCMetric, newFCMetric) => {
    //  console.log(instrumentID, line_id, formulaName, categoryID, typeID, user_id, extMetric, newMetric, currUser, insFreq, metricsID, offline, isforecast, extFCMetric, newFCMetric,'instrumentID, line_id, formulaName, categoryID, typeID, user_id, extMetric, newMetric, currUser, insFreq, metricsID, offline, isforecast, extFCMetric, newFCMetric')
        let object=(data,index) => {
            return {
                ins_met_is: data[index].id,
                parameters: null,
                model: null,
                status: 0
            }
        }
        function processValue(val, data, instrumentId, instrumentMetricsArr) {
            let index = data.findIndex(i => i.instruments_id === instrumentId && i.metrics_id === val);
            if (val && index >= 0) {
                let obj = object(data, index);
                instrumentMetricsArr.push(obj);
            }
        }
        const handleApiError = (e, pathname) => {
            console.log("NEW MODEL", "API FAILURE", e, pathname, new Date());
            setLoading(false);
            setError(e);
            setData(null);
        };
        setLoading(true);


        let difference = extFCMetric.filter(x => !newFCMetric.includes(x));
        console.log(difference,'difference2')

        
        if (difference.length > 0) {
            await configParam.RUN_GQL_API(gqlQueries.getInstrumentMetricId, { metrics_id: difference, instruments_id: instrumentID })
                .then(async (instrument_metrics) => {
                    const data = instrument_metrics.neo_skeleton_instruments_metrics;
                    let map1 = data.map((val) => {
                        return val.id
                    });
                    const resultfinal = await configParam.RUN_GQL_API(mutations.delForecastMetrics, { ins_met_is: map1 })
                        .then((response) => {
                            if (response) {
                                let instrumentMetricsArr = []
                                let difference1 = newMetric.filter(x => !extMetric.includes(x));
                                if (difference1.length > 0) {

                                    // eslint-disable-next-line array-callback-return
                                    difference1.map((val) => {
                                        processValue(val, data, instrumentID, instrumentMetricsArr);
                                    });

                                }

                                return instrumentMetricsArr

                            }
                            return []
                        })
                        console.log(resultfinal,"resultfinal")
                    setData(resultfinal)
                    setError(false)
                    setLoading(false)
                })
                .catch((e) => handleApiError(e, window.location.pathname.split("/").pop()));


        }
        else {
            let difference2 = newFCMetric.filter(x => !extFCMetric.includes(x));
            console.log(difference2,'difference2')
            if (difference2.length > 0) {
                await configParam.RUN_GQL_API(gqlQueries.getInstrumentMetricId, { metrics_id: difference2, instruments_id: instrumentID })
                    .then(async (instrument_metrics) => {
                        const data = instrument_metrics.neo_skeleton_instruments_metrics;
                        let instrumentMetricsArr = []
                        // eslint-disable-next-line array-callback-return
                        difference2.map((val) => {
                            processValue(val, data, instrumentID, instrumentMetricsArr);
                        });
                        console.log(instrumentMetricsArr,"resultfinalElse")

                     
                        setData(instrumentMetricsArr)
                        setError(false)
                        setLoading(false)

                    })
                    .catch((e) => handleApiError(e, window.location.pathname.split("/").pop()));
            }
        }
    }
    return { UpdateInstrumentMetricForecastLoading, UpdateInstrumentMetricForecastData, UpdateInstrumentMetricForecastError, getUpdateInstrumentMetricForecast };


}
export default useUpdateInstrumentMetricForecast;