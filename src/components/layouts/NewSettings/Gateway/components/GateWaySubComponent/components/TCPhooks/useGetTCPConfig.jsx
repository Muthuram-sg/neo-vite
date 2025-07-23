import { useState } from "react";
import configParam from "config"; 

const useGetTCPConfiguration = () => {
    const [TCPConfigurationLoading, setLoading] = useState(false);
    const [TCPConfigurationData, setData] = useState(null);
    const [TCPConfigurationError, setError] = useState(null);

    const getTCPConfiguration = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/settings/getDAQService', body)
            .then((res) => {
                console.log(res,"res")
                if (res !== undefined) {
                    setData(res.data)
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
    return { TCPConfigurationLoading, TCPConfigurationData, TCPConfigurationError, getTCPConfiguration };
};

export default useGetTCPConfiguration;