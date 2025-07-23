import { useState } from "react";
import configParam from "config";

const useGetForeCastData = () => {
    const [forecastdataLoading, setLoading] = useState(false);
    const [forecastdataData, setData] = useState(null);
    const [forecastdataError, setError] = useState(null);

    const getForeCastData = async (metric, key, schema) => {
        setLoading(true);
        const url = "/iiot/getforecastdata";
        let body = {
            instrument_id: metric,//31014,
            metric_name: key,//"kw",
            days: 7,
            schema: schema
        }
        await configParam.RUN_REST_API(url, body)
            .then((response) => {
                const result = response.data;
                if (result && result.predictions && result.message === "successful") {
                    setLoading(false);
                    setError(false);
                    setData(result.predictions)

                } else {
                    setLoading(false);
                    setError(false);
                    setData({});
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });





    };

    return { forecastdataLoading, forecastdataData, forecastdataError, getForeCastData };
};

export default useGetForeCastData;