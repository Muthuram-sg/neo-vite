import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetLastAlert = () => {
    const [lastAlertLoading, setLoading] = useState(false);
    const [lastAlertData, setData] = useState(null);
    const [lastAlertError, setError] = useState(null);

    const getLastAlert = async (instrument_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getLastAlert, {instrument_id: instrument_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_alerts_v2) {
                    setData(returnData.neo_skeleton_alerts_v2)
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { lastAlertLoading, lastAlertData, lastAlertError, getLastAlert };
};

export default useGetLastAlert;