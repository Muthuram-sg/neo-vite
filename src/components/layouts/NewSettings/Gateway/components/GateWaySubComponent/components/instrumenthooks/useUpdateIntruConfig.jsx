import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateGateWayinstrumentConfig = () => {
    const [updateGateWayinstrumentConfigLoading, setLoading] = useState(false);
    const [updateGateWayinstrumentConfigData, setData] = useState(null);
    const [updateGateWayinstrumentConfigError, setError] = useState(null);

    const getUpdateGateWayinstrumentConfig = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateGatewayInstrumentConfig,body)
            .then((returnData) => {
               
                if (returnData.update_neo_skeleton_gateway_instruments) {
                    setData(returnData.update_neo_skeleton_gateway_instruments)
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
    return { updateGateWayinstrumentConfigLoading, updateGateWayinstrumentConfigData, updateGateWayinstrumentConfigError, getUpdateGateWayinstrumentConfig };
};

export default useUpdateGateWayinstrumentConfig;