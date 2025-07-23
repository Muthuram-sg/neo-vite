import { useState } from "react";
import configParam from "config"; 

const useGetDeviceMake = () => {
    const [DeviceMakeLoading, setLoading] = useState(false);
    const [DeviceMakeData, setData] = useState(null);
    const [DeviceMakeError, setError] = useState(null);

    const getDeviceMake = async (body) => {
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
    return { DeviceMakeLoading, DeviceMakeData, DeviceMakeError, getDeviceMake };
};

export default useGetDeviceMake;