import { useState } from "react";
import configParam from "config"; 

const useGetTestConnection = () => {
    const [TestConnectionLoading, setLoading] = useState(false);
    const [TestConnectionData, setData] = useState(null);
    const [TestConnectionError, setError] = useState(null);

    const getTestConnection = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/settings/getTestConnection', body)
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
    return { TestConnectionLoading, TestConnectionData, TestConnectionError, getTestConnection };
};

export default useGetTestConnection;