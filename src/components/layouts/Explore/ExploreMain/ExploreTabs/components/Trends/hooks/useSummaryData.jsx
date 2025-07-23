import { useState } from "react";
import configParam from "config";

const useSummaryData = () => {
    const [summaryLoading, setLoading] = useState(false);
    const [summaryData, setData] = useState(null);
    const [summaryError, setError] = useState(null);

    const getSummaryData = async (meters, schema) => {
        setLoading(true);
        const url = "/iiot/getSummary";
        Promise.all(
            meters.map(async (x) => {
                let body = {
                    schema: schema,
                    from: x.frmDate,
                    to: x.toDate,
                    instrumentid: x.id,
                    metricid: x.metric_val
                }
                return  configParam.RUN_REST_API(url, body)
                    .then((response) => {

                        if (response && !response.errorTitle && response.data) {
                            return response.data
                        } else {
                            return []
                        }
                    })
            }))
            .then((result) => {
                setLoading(false);
                setError(false);
                setData(result);
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { summaryLoading, summaryData, summaryError, getSummaryData };
};

export default useSummaryData;