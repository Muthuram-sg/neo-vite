import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMainLog = () => {
    const [mainLogLoading, setLoading] = useState(false);
    const [mainLogData, setData] = useState(null);
    const [mainLogError, setError] = useState(null);

    const getMainLog = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getMainLog, {entity_id: entity_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_maintenance_log) {
                    setData(returnData.neo_skeleton_maintenance_log)
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
    return { mainLogLoading, mainLogData, mainLogError, getMainLog };
};

export default useGetMainLog;