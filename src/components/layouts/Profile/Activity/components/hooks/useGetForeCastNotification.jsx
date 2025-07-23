import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetForeCastNotification = () => {
    const [ForeCastLoading, setLoading] = useState(false);
    const [ForeCastData, setData] = useState(null);
    const [ForeCastError, setError] = useState(null);

    const getForeCastNotification = async (line_id, start, end) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getForeCastNotifications, { from: start, to: end })
            .then((result) => {
                if (result && result.neo_skeleton_instruments_metrics_forecasting && result.neo_skeleton_instruments_metrics_forecasting.length > 0) {
                    setData(result.neo_skeleton_instruments_metrics_forecasting.filter(fn => fn.instruments_metric.instrument.line_id === line_id));
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
                console.log("NEW MODEL", e, "Getting Activity Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { ForeCastLoading, ForeCastData, ForeCastError, getForeCastNotification };
};

export default useGetForeCastNotification;