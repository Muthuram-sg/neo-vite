import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useGetDeleteMaintLog = () => {
    const [delMaintLogLoading, setLoading] = useState(false);
    const [delMaintLogData, setData] = useState(null);
    const [delMaintLogError, setError] = useState(null);

    const getDelMaintLog = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.deleteMaintLogs, { id: id })
            .then((response) => {
                setData(response.delete_neo_skeleton_maintenance_log);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", e, "Deleted in quality Report", new Date())
            })
    }

    return { delMaintLogLoading, delMaintLogData, delMaintLogError, getDelMaintLog };
}


export default useGetDeleteMaintLog;