/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAccess = () => {
    const [AccessLoading, setLoading] = useState(false);
    const [AccessData, setData] = useState(null);
    const [AccessError, setError] = useState(null);

    const getAccess = async (line_id) => {
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
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AccessLoading, AccessData, AccessError, getAccess };
};

export default useGetAccess;
