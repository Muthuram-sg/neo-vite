import { useState } from "react";
import configParam from "config"; 

const useActualPartSignalSA = () => {
    const [ActualPartSignalSALoading, setLoading] = useState(false);
    const [ActualPartSignalSAData, setData] = useState(null);
    const [ActualPartSignalSAError, setError] = useState(null);

    const getActualPartSignalSA = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/dashboards/actualPartSignalSA', body)
            .then((res) => {
                if (res !== undefined && res.data) {
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
    return { ActualPartSignalSALoading, ActualPartSignalSAData, ActualPartSignalSAError, getActualPartSignalSA };
};

export default useActualPartSignalSA;