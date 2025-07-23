/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetGateWay = () => {
    const [GateWayLoading, setLoading] = useState(false);
    const [GateWayData, setData] = useState(null);
    const [GateWayError, setError] = useState(null);

    const getGateWay = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getGateWay, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_gateway) {
                    setData(returnData.neo_skeleton_gateway)
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
                console.log("NEW MODEL", e, "GateWay Setting", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { GateWayLoading, GateWayData, GateWayError, getGateWay };
};

export default useGetGateWay;
