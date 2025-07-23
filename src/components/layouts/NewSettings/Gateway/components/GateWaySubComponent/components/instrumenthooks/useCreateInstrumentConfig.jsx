import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useCreateGateWayinstrumentConfig = () => {
    const [CreateGateWayinstrumentConfigLoading, setLoading] = useState(false);
    const [CreateGateWayinstrumentConfigData, setData] = useState(null);
    const [CreateGateWayinstrumentConfigError, setError] = useState(null);

    const getCreateGateWayinstrumentConfig = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.createGatewayInstrumentConfig,body)
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_gateway_instruments) {
                    setData(returnData.insert_neo_skeleton_gateway_instruments)
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
                console.log("NEW MODEL", e, "Entity Setting - Asset Instruments Mapping", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { CreateGateWayinstrumentConfigLoading, CreateGateWayinstrumentConfigData, CreateGateWayinstrumentConfigError, getCreateGateWayinstrumentConfig };
};

export default useCreateGateWayinstrumentConfig;