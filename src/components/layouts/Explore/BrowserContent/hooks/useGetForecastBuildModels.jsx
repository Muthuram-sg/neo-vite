import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useForecastBuildModels = () => {
    const [forecastBuildModelLoading, setLoading] = useState(false);
    const [forecastBuildModelData, setData] = useState(null);
    const [forecastBuildModelError, setError] = useState(null);

    const getForecastBuildModels = async (line_id,user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getForeCastModelBuildStatus, {line_id:line_id})
            .then((modelData) => {
                if (modelData.neo_skeleton_instruments_metrics_forecasting && modelData.neo_skeleton_instruments_metrics_forecasting.length > 0 ) {
                    setData(modelData.neo_skeleton_instruments_metrics_forecasting)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Explore", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { forecastBuildModelLoading, forecastBuildModelData, forecastBuildModelError, getForecastBuildModels };
};

export default useForecastBuildModels;