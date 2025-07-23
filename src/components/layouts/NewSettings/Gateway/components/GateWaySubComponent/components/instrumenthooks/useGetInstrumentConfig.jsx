/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetInstrumentConfig = () => {
    const [GateWayInstrumentConfigLoading, setLoading] = useState(false);
    const [GateWayInstrumentConfigData, setData] = useState(null);
    const [GateWayInstrumentConfigError, setError] = useState(null);

    const getGateWayInstrumentConfig = async (gateway_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getGateWayInstrumentDetail, {gateway_id: gateway_id})
            .then((returnData) => {
                console.log(returnData,"returnData")
                if (returnData.neo_skeleton_gateway_instruments) {
                    setData(returnData.neo_skeleton_gateway_instruments)
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
    return { GateWayInstrumentConfigLoading, GateWayInstrumentConfigData, GateWayInstrumentConfigError, getGateWayInstrumentConfig };
};

export default useGetInstrumentConfig;
