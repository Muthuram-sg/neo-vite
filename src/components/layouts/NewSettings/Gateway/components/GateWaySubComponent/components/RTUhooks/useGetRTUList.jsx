import { useState } from "react";
import configParam from "config"; 

const useGetRTUConfiguration = () => {
    const [RTUConfigurationLoading, setLoading] = useState(false);
    const [RTUConfigurationData, setData] = useState(null);
    const [RTUConfigurationError, setError] = useState(null);

    const getRTUConfiguration = async (body) => {
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
    return { RTUConfigurationLoading, RTUConfigurationData, RTUConfigurationError, getRTUConfiguration };
};

export default useGetRTUConfiguration;