import { useState } from "react";
import configParam from "config";

const useGetAIcameraData = () => {
    const [AIdataLoading, setLoading] = useState(false);
    const [AIdataData, setData] = useState(null);
    const [AIdataError, setError] = useState(null);

    const getAIcameraData = async (schema,instrument_id,start,end,pageSize,initial,last_timestamp) => {
        setLoading(true);
        const url = "/iiot/getGypsumDefectspagination";
 
        let body = {
            schema:schema,
            instrument_id:instrument_id,
            from:start,
            to:end,
            pageSize:pageSize,
            initial:initial,
            last_timestamp:last_timestamp? last_timestamp:""

        }

        await configParam.RUN_REST_API(url, body)
            .then((response) => {
                if (response) {
                    setLoading(false);
                    setError(false);
                    setData(response);

                } else {
                    setLoading(false);
                    setError(false);
                    setData([]);
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };

    return { AIdataLoading, AIdataData, AIdataError, getAIcameraData };
};

export default useGetAIcameraData;