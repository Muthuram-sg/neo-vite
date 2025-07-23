import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddNewLog = () => {
    const [outMaintenanceLogsLoading, setLoading] = useState(false);
    const [outMaintenanceLogsData, setData] = useState(null);
    const [outMaintenanceLogsError, setError] = useState(null);

    const getAddMaintenanceLogsDetails = async (entity_id, line_id, log, user_id, log_date) => {
        console.log("testing", entity_id, line_id, log, user_id, log_date)
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.addMaintLogs, { entity_id: entity_id, line_id: line_id, log: log, created_by: user_id, updated_by: user_id, log_date: log_date })
            .then((response) => {
                if (response.insert_neo_skeleton_maintenance_log) {
                    console.log("testingresl", response.insert_neo_skeleton_maintenance_log)
                    setData(response.insert_neo_skeleton_maintenance_log)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "Maintenance Logs Explore", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { outMaintenanceLogsLoading, outMaintenanceLogsData, outMaintenanceLogsError, getAddMaintenanceLogsDetails };
}


export default useAddNewLog;