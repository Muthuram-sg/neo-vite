import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useCreateGateWay = () => {
    const [CreateGateWayLoading, setLoading] = useState(false);
    const [CreateGateWayData, setData] = useState(null);
    const [CreateGateWayError, setError] = useState(null);

    const getCreateGateWay = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.createGateWay,body)
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_gateway) {
                    setData(returnData.insert_neo_skeleton_gateway)
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
    return { CreateGateWayLoading, CreateGateWayData, CreateGateWayError, getCreateGateWay };
};

export default useCreateGateWay;