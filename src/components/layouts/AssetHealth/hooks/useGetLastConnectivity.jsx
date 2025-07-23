import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetLastConnectivity = () => {
    const [lastConnectStatusLoading, setLoading] = useState(false);
    const [lastConnectStatusData, setData] = useState(null);
    const [lastConnectStatusError, setError] = useState(null);

    const getLastConnectivity = async (instrument_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getLastConnectivity, {instrument_id: instrument_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_connectivity) {
                    setData(returnData.neo_skeleton_connectivity)
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
    return { lastConnectStatusLoading, lastConnectStatusData, lastConnectStatusError, getLastConnectivity };
};

export default useGetLastConnectivity;