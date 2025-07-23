import { useState } from "react";
import configParam from "config"; 

const useGetDeviceRunning = () => {
    const [DeviceRunningLoading, setLoading] = useState(false);
    const [DeviceRunningData, setData] = useState(null);
    const [DeviceRunningError, setError] = useState(null);

    const getDeviceRunning = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/settings/getDAQService', body)
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
    return { DeviceRunningLoading, DeviceRunningData, DeviceRunningError, getDeviceRunning };
};

export default useGetDeviceRunning;