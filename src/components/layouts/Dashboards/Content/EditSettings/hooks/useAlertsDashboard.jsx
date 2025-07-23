import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetAlertsDashboard = () => {
    const [alertsDashboardLoading, setLoading] = useState(false);
    const [alertsDashboarddata, setData] = useState(null);
    const [alertsDashboarderror, setError] = useState(null);

    const getAlertsDashboard = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.alertDashboard, { line_id: line_id })
        .then(alertsDashboard => {
            if (alertsDashboard !== undefined && alertsDashboard.neo_skeleton_alerts_v2) {
                setData(alertsDashboard.neo_skeleton_alerts_v2)
                setError(false)
                setLoading(false)
            } else {
                setData(null)
                setError(true)
                setLoading(false)
            }


             console.log(alertsDashboard, "alertsDashboardalertsDashboard")
        })
        .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
        });



    }
    return { alertsDashboardLoading, alertsDashboarddata, alertsDashboarderror, getAlertsDashboard };
}

export default useGetAlertsDashboard;
