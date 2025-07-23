import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
import gqlQueries from "components/layouts/Queries";

const useUpdateMetricScalingFactor = () => {
    const [UpdateMetricScalingFactorLoading, setLoading] = useState(false);
    const [UpdateMetricScalingFactorData, setData] = useState(null);
    const [UpdateMetricScalingFactorError, setError] = useState(null);

    const getUpdateMetricScalingFactor = async (instruments_id, MetricFields,dialogMode,extFCMetric,newFCMetric) => {
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.getMetricsForInstrumentWithID, { id: instruments_id })
            .then(async (response) => {

                if (response !== undefined && response.neo_skeleton_instruments_metrics) {
                    const data = response.neo_skeleton_instruments_metrics;

                    if (data.length > 0) {
                        
                        // Merge all the metric scaling factor details for the instrument (hint: Onchange)
                        let updatedScalingFactor = []
                        data.forEach(item => {
                            let index 
                            if(dialogMode === "edit"){
                                index = MetricFields.filter((val) => item.metrics_id === val.metric_id )

                            }else{
                             index = MetricFields.filter((val) => item.metrics_id ===  val.id)

                            }

                            if (index.length > 0) {
                                const firstIndex = index[0];
                                const metricId = dialogMode === "edit" ? firstIndex.metric_id : firstIndex.id;
                                const mFactor = dialogMode === "edit" ? firstIndex.mFactor : firstIndex.factor;
                                
                                let calibrationValue;
                                if (dialogMode === "edit") {
                                    calibrationValue = firstIndex.calibrationValue;
                                } else {
                                    calibrationValue = firstIndex.calibrate !== "" ? firstIndex.calibrate : 0;
                                }
                            
                                updatedScalingFactor.push({ metric_id: metricId, mFactor, calibrationValue });
                            }
                            
                             else {
                                updatedScalingFactor.push({ metric_id: item.metrics_id, mFactor: 1, calibrationValue: 0 });
                            }
                        })

                        // Any metric multiplication factor or calibrate value changed means the array has the value
                        // eslint-disable-next-line array-callback-return
                        let differenceMetricArr = updatedScalingFactor.filter(val => {
                            let index = data.filter((item) => item.metrics_id === val.metrics_id && item.factor === val.factor && item.calibrate === val.calibrate)
                            if (index.length === 0) {
                                return val
                            }
                        })

                         console.log(newFCMetric,"newFCMetric")
                           differenceMetricArr = differenceMetricArr.map(x=>{
                            if(newFCMetric.length > 0 ){
                                return {...x,enable_forecast:newFCMetric.includes(x.metric_id)}
                            }else{
                                return x
                            }
                           })
                        // Scaling Factor changed metric  update
                        if (differenceMetricArr.length > 0) {
                        console.log(differenceMetricArr,"differenceMetricArr")
                            differenceMetricArr.forEach(async (val) => {

                                await configParam.RUN_GQL_API(mutations.UpdateMetricScalingFactor, { instruments_id: instruments_id, metrics_id: val.metric_id, enable_forecast:val.enable_forecast,factor: val.mFactor, calibrate: val.calibrationValue})
                                    .then((response1) => {
                                        if (response1) {
                                            if (response1 !== undefined && response1.update_neo_skeleton_instruments_metrics) {
                                                setData(response1.update_neo_skeleton_instruments_metrics);
                                                setError(false)
                                                setLoading(false)
                                            }
                                            else {
                                                setData(null)
                                                setError(true)
                                                setLoading(false)
                                            }
                                        }
                                    })
                            });
                        }
                        else {
                            setData(response.neo_skeleton_instruments_metrics)
                            setError(false)
                            setLoading(false)
                        }
                    }
                }
                else {
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

    return { UpdateMetricScalingFactorLoading, UpdateMetricScalingFactorData, UpdateMetricScalingFactorError, getUpdateMetricScalingFactor };
}


export default useUpdateMetricScalingFactor;