import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const UseUpdateOfflineAlerts = () => {
 const [offlineAlertsLoading, setLoading] = useState(false);
    const [updateOfflineData, setData] = useState(null);
    const [offlineError, setError] = useState(null);
// eslint-disable-next-line react-hooks/exhaustive-deps
    const getUpdateOfflineAlerts = async ( InstrumentID,frequency_seconds,escalation_times,escalation_users,last_check_time,updated_by,line_id,frequency_count ) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.updateOfflineAlerts,{iid:InstrumentID,frequency_seconds:frequency_seconds,escalation_times:escalation_times,escalation_users:escalation_users,last_check_time:last_check_time,updated_by:updated_by,line_id:line_id,frequency_count:frequency_count})
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            })
    }

    return { offlineAlertsLoading, updateOfflineData, offlineError, getUpdateOfflineAlerts };
}

export default UseUpdateOfflineAlerts;
