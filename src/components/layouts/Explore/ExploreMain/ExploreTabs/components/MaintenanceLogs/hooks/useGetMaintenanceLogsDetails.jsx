import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMaintenanceLogsDetails = () => {
    const [outMaintenanceInfoLoading, setLoading] = useState(false);
    const [outMaintenanceInfoData, setData] = useState(null);
    const [outMaintenanceInfoError, setError] = useState(null);

    const getMaintenanceLogsDetails = async (entity_id, from, to) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getMaintenanceLogsHistory, { entity_id: entity_id, from: from, to: to })
            .then((response) => {
                if (response.neo_skeleton_maintenance_log) {
                    setData(response.neo_skeleton_maintenance_log)
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
                console.log("NEW MODEL", e, "Get Maintenance Logs Explore", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outMaintenanceInfoLoading, outMaintenanceInfoData, outMaintenanceInfoError, getMaintenanceLogsDetails };
};

export default useGetMaintenanceLogsDetails;