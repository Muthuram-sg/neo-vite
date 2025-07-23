import { useState } from "react";
import configParam from "config"; 

const useGetLengthOfConn = () => {
    const [LengthOfConnLoading, setLoading] = useState(false);
    const [LengthOfConnData, setData] = useState(null);
    const [LengthOfConnError, setError] = useState(null);

    const getLengthOfConn = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/settings/getlengthofConnection', body)
            .then((res) => {
                console.log(res,"res")
                if (res !== undefined) {
                    setData(res)
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
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { LengthOfConnLoading, LengthOfConnData, LengthOfConnError, getLengthOfConn };
};

export default useGetLengthOfConn;