import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import gqlQueries from "components/layouts/Queries";

const useAddInstrumentwithID = () => {
    const [AddInstrumentwithIDLoading, setLoading] = useState(false);
    const [AddInstrumentwithIDData, setData] = useState(null);
    const [AddInstrumentwithIDError, setError] = useState(null);

// eslint-disable-next-line react-hooks/exhaustive-deps
    const getAddInstrumentwithID = async (datas, user_id, metricsID, currUser, insFreq,isOffline,isScalingFactors,isForeCast,fcMetricsID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutations.AddInstrumentWithID, { id: datas.data.instrumentID, line_id: datas.data.line_id, name: datas.data.formulaName, category: datas.data.categoryID, instrument_class: datas.isoID ? datas.isoID : null , instrument_type: datas.typeID, user_id: user_id,isOffline:isOffline,isScalingFactors:isScalingFactors, isForeCast:isForeCast })
            .then(async (response) => {
                if (response !== undefined && response.insert_neo_skeleton_instruments_one) {
                    let data1 = response.insert_neo_skeleton_instruments_one
                    if (data1) {

                        const lastInsertID = data1.id;
                        const result = await configParam.RUN_GQL_API(gqlQueries.duplicateInstrument, { id: lastInsertID })
                            .then(async(instrument_metrics) => {

                                if (instrument_metrics !== undefined && instrument_metrics.neo_skeleton_instruments_metrics && instrument_metrics.neo_skeleton_instruments_metrics.length > 0) {
                                    return []
                                } else {
                                    let instrumentMetricsArr = []
                                    if (metricsID.length > 0) {
                                        let fcids = fcMetricsID.map(val=>val.id)
                                        // eslint-disable-next-line array-callback-return
                                        metricsID.map((val) => {
                                            if (val.id) {
                                                let obj = {
                                                    instruments_id: lastInsertID,
                                                    metrics_id: val.id,
                                                    updated_by: currUser.id,
                                                    created_by: currUser.id,
                                                    frequency: insFreq,
                                                    enable_forecast : fcids.includes(val.id) ? true :false,
                                                    factor: val.factor,
                                                    calibrate: val.calibrate
                                                };
                                                instrumentMetricsArr.push(obj);
                                            }


                                        });
                                        return instrumentMetricsArr
                                    } else {
                                        return []
                                    }
                                }
                            });
                        setData(result);
                        setError(false)
                        setLoading(false)
                    }

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

    return { AddInstrumentwithIDLoading, AddInstrumentwithIDData, AddInstrumentwithIDError, getAddInstrumentwithID };
}


export default useAddInstrumentwithID;