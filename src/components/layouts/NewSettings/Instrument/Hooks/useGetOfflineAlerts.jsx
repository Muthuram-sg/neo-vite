/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetOfflineAlerts = () => {
    const [getOfflineLoading, setLoading] = useState(false);
    const [getOfflineData, setData] = useState(null);
    const [getOfflineError, setError] = useState(null);

    const getOfflineAlerts = async (line_id,instId ) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getOffline_Alerts,{line_id: line_id,iid:instId})
            .then((returnData) => {
             console.log("returnDatareturnData",returnData)
                if (returnData.neo_skeleton_alerts_offline) {
                    setData(returnData.neo_skeleton_alerts_offline)
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
                console.log("NEW MODEL", e, "GateWay Setting", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { getOfflineLoading, getOfflineData, getOfflineError, getOfflineAlerts };
};

export default useGetOfflineAlerts;

