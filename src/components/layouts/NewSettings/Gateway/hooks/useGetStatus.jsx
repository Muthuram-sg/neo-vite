import { useState } from "react";
import configParam from "config"; 

const useGetStatus = () => {
    const [StatusLoading, setLoading] = useState(false);
    const [StatusData, setData] = useState(null);
    const [StatusError, setError] = useState(null);

    const getStatus = async (body) => {
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
    return { StatusLoading, StatusData, StatusError, getStatus };
};

export default useGetStatus;