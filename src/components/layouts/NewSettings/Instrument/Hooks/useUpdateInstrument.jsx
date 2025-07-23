import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import gqlQueries from "components/layouts/Queries";




const useUpdateInstrument = () => {
    const [UpdateInstrumentLoading, setLoading] = useState(false);
    const [UpdateInstrumentData, setData] = useState(null);
    const [UpdateInstrumentError, setError] = useState(null);

    const getUpdateInstrument = async (datas) => {
        let object = (val) => {
            return {
                instruments_id: datas.instrumentID,
                metrics_id: val,
                updated_by: datas.currUser.id,
                created_by: datas.currUser.id,
                frequency: datas.insFreq
            };
        };

        let instrumentMetricsArr1; 

        setLoading(true);

        try {
            const response = await configParam.RUN_GQL_API(mutations.UpdateInstrument, {
                id: datas.instrumentID,
                line_id: datas.line_id,
                name: datas.formulaName,
                category: datas.categoryID,
                instrument_class: datas.isoID ? datas.isoID : null,
                instrument_type: datas.typeID,
                updated_by: datas.user_id,
                isOffline: datas.offline,
                isScalingFactors: datas.isScalingFactors,
                isForeCast: datas.isForeCast 
            });


            if (response !== undefined && response.update_neo_skeleton_instruments && response.update_neo_skeleton_instruments.affected_rows >= 1) {
                const instrument_metrics = await configParam.RUN_GQL_API(gqlQueries.duplicateInstrument, { id: datas.instrumentID });

                let difference = datas.extMetric.filter(x => !datas.newMetric.includes(x));
                let fcids_removed = datas.extFCMetric.filter(x => !datas.newFCMetric.includes(x));

                if (instrument_metrics !== undefined && instrument_metrics.neo_skeleton_instruments_metrics && instrument_metrics.neo_skeleton_instruments_metrics.length > 0) {
                    if (difference.length > 0) {
                        const instrument_metrics1 = await configParam.RUN_GQL_API(gqlQueries.getInstrumentMetricId, { metrics_id: difference, instruments_id: datas.instrumentID });
                        const data1 = instrument_metrics1.neo_skeleton_instruments_metrics;
                        let map1 = data1.map((val) => {
                            return val.id;
                        });
                        if (fcids_removed.length > 0) {
                            map1 = map1.concat(fcids_removed)
                        }
                        const response1 = await configParam.RUN_GQL_API(mutations.delAlertsV2, { insrument_metrics_id: map1 });
                         await configParam.RUN_GQL_API(mutations.delForecastMetrics, { ins_met_is: fcids_removed })
                        if (response1) {

                            let difference1 = datas.extMetric.filter(x => !datas.newMetric.includes(x));
                            const response2 = await configParam.RUN_GQL_API(mutations.deleteInstrumentMetrics, { instruments_id: datas.instrumentID, metrics_id: difference1 });

                            if (response2) {
                                instrumentMetricsArr1 = [];
                                let difference2 = datas.newMetric.filter(x => !datas.extMetric.includes(x));
                                let fcids_added = datas.newFCMetric.filter(x => !datas.extFCMetric.includes(x));

                                if (difference2.length > 0 || fcids_added.length > 0) {
                                    difference2.map((val) => {
                                        if (val) {
                                            let obj = object(val);
                                            obj = {...obj,enable_forecast: fcids_added.includes(val) ? true :false}
                                            instrumentMetricsArr1.push(obj);
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        instrumentMetricsArr1 = [];
                        let fcids_added = datas.newFCMetric.filter(x => !datas.extFCMetric.includes(x));
                        let difference3 = datas.newMetric.filter(x => !datas.extMetric.includes(x));
                        if (difference3.length > 0 ||  fcids_added.length > 0) {
                            difference3.map((val) => {
                                if (val) {
                                    let obj = object(val);
                                    obj = {...obj,enable_forecast: fcids_added.includes(val) ? true :false}
                                    instrumentMetricsArr1.push(obj);
                                }
                            });
                        }
                    }
                } else {
                    if (datas.metricsID.length > 0) {
                        instrumentMetricsArr1 = [];
                        let fcids_added = datas.newFCMetric.filter(x => !datas.extFCMetric.includes(x));

                        datas.metricsID.map((val) => {
                            if (val) {
                                let obj = { 
                                    instruments_id: datas.instrumentID,
                                    metrics_id: val.id,
                                    updated_by: datas.currUser.id,
                                    created_by: datas.currUser.id,
                                    frequency: datas.insFreq,
                                    factor: val.factor,
                                    calibrate: val.calibrate,
                                    enable_forecast : fcids_added.includes(val.id) ? true :false,
                                };
                                instrumentMetricsArr1.push(obj);
                            }
                        });
                    }
                }
                console.log(instrumentMetricsArr1,"instrumentMetricsArr1")
                setData(instrumentMetricsArr1);
                setError(false);
                setLoading(false);
            } else {
                setData(null);
                setError(true);
                setLoading(false);
            }
        } catch (error) {
            console.log("NEW MODEL", "API FAILURE", error, window.location.pathname.split("/").pop(), new Date());
            setLoading(false);
            setError(error);
            setData(null);
        }
    };

    return { UpdateInstrumentLoading, UpdateInstrumentData, UpdateInstrumentError, getUpdateInstrument };
};

export default useUpdateInstrument;
