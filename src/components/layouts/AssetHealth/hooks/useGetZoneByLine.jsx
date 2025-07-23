import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetZoneByLine = () => {
    const [zoneByLineLoading, setLoading] = useState(false);
    const [zoneByLineData, setData] = useState(null);
    const [zoneByLineError, setError] = useState(null);

    const getZonesByLine = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getZonesByLine, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_entity) {
                    setData(returnData.neo_skeleton_entity)
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
    return { zoneByLineLoading, zoneByLineData, zoneByLineError, getZonesByLine };
};

export default useGetZoneByLine;