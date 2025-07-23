import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateLog = () => {
    const [updateMaintLogLoading, setLoading] = useState(false);
    const [updateMaintLogData, setData] = useState(null);
    const [updateMaintLogError, setError] = useState(null);

    const getUpdateLog = async (id,log_date, log) => {
        setLoading(true);
        console.log("id,log_date, log",id,log_date, log)
        configParam.RUN_GQL_API(mutations.updateMaintLogs, {id:id, log_date: log_date, log: log})
            .then((response) => {
                setData(response.update_neo_skeleton_maintenance_log);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Update reason in Downtime report Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { updateMaintLogLoading, updateMaintLogData, updateMaintLogError, getUpdateLog };
}


export default useUpdateLog;