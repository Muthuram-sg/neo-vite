import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";


const UseMaintainceLog = () => {
    const [outMaintainceLoading, setLoading] = useState(false);
    const [outMaintainceData, setData] = useState(null);
    const [outMaintainceError, setError] = useState(null);


    const getMaintainceLogdata = async (LineId,from,to) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getMaintainceLog, {LineId:LineId,from: from, to: to})
            .then((data) => {
                if (data.neo_skeleton_maintenance_log) {
                    setData(data.neo_skeleton_maintenance_log)
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
                console.log("NEW MODEL", e, "Maintaince report screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outMaintainceLoading, outMaintainceData, outMaintainceError, getMaintainceLogdata };
};

export default UseMaintainceLog;