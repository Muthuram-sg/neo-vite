import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateGateWay = () => {
    const [UpdateGateWayLoading, setLoading] = useState(false);
    const [UpdateGateWayData, setData] = useState(null);
    const [UpdateGateWayError, setError] = useState(null);

    const getUpdateGateWay = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateGateWay,body)
            .then((returnData) => {
             
                if (returnData.update_neo_skeleton_gateway) {
                    setData(returnData.update_neo_skeleton_gateway)
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
                console.log("NEW MODEL", e, "Entity Setting - Update Asset Instruments Mapping", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { UpdateGateWayLoading, UpdateGateWayData, UpdateGateWayError, getUpdateGateWay };
};

export default useUpdateGateWay;