import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

//Hook to insert the final list of forecast metrics associated with an instrument
const useAddInstrumentMetricsForecast = () => {
    const [AddInstrumentMetricsForecastLoading, setLoading] = useState(false);
    const [AddInstrumentMetricsForecastData, setData] = useState(null);
    const [AddInstrumentMetricsForecastError, setError] = useState(null);

    const getAddInstrumentMetricsForecast = async ( instrumentMetricsArrForecast ) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.addForecasting,{ objects: instrumentMetricsArrForecast })
            .then((response) => {
                if (response!== undefined && response.insert_neo_skeleton_instruments_metrics_forecasting) {
                    // console.log('addedresponse',response)
                    setData(response.insert_neo_skeleton_instruments_metrics_forecasting);
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

    return { AddInstrumentMetricsForecastLoading, AddInstrumentMetricsForecastData, AddInstrumentMetricsForecastError, getAddInstrumentMetricsForecast };
}


export default useAddInstrumentMetricsForecast;