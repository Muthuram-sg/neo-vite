import { useState } from "react";
import configParam from "config"; 

const useGetMQttConfiguration = () => {
    const [MQttConfigurationLoading, setLoading] = useState(false);
    const [MQttConfigurationData, setData] = useState(null);
    const [MQttConfigurationError, setError] = useState(null);

    const getMQttConfiguration = async (body) => {
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
    return { MQttConfigurationLoading, MQttConfigurationData, MQttConfigurationError, getMQttConfiguration };
};

export default useGetMQttConfiguration;