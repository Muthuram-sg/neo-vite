import { useState } from "react";
import configParam from "config";

const useGetOptixData = () => {
    const [OptixdataLoading, setLoading] = useState(false);
    const [OptixdataData, setData] = useState(null);
    const [OptixdataError, setError] = useState(null);

    const getOptixData = async (schema,instrument_id,start,end) => {
        setLoading(true);
        const url = "/iiot/getGypsumDefects";
        let body = {
            schema:schema,
            instrument_id:instrument_id,
            from:start,
            to:end
        }
        await configParam.RUN_REST_API(url, body)
            .then((response) => {
                if (response  && response.data) {
                    console.log(response.data)
                    setLoading(false);
                    setError(false);
                    setData(response.data);

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

    return { OptixdataLoading, OptixdataData, OptixdataError, getOptixData };
};

export default useGetOptixData;