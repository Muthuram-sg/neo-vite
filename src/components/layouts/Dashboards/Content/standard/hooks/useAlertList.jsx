import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAlertList = () => {
    const [alertlistLoading, setLoading] = useState(false);
    const [alertlistdata, setData] = useState(null);
    const [alertlisterror, setError] = useState(null);

    const getAlertList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.alertList, { line_id: line_id })
            .then(alertlist => {
                if (alertlist !== undefined && alertlist.neo_skeleton_alerts_v2 && alertlist.neo_skeleton_alerts_v2.length > 0) {
                    setData(alertlist.neo_skeleton_alerts_v2)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }


                // console.log(alertsList, "alertsListalertsList")
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { alertlistLoading, alertlistdata, alertlisterror, getAlertList };
}

export default useAlertList;
