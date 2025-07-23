import { useState } from "react";
import configParam from "config";

const useUpdateFaults = () => {
    const [faultupdateLoading, setLoading] = useState(false);
    const [faultupdateError, setError] = useState(null);
    const [faultupdateData, setData] = useState(null);


    const getUpdateFaultInfo = async (schema, time, iid, key,severity,defect, remarks) => {
        setLoading(true);
        const url = "/iiot/updatefaultinfo";
            let body = { data: { schema: schema, time: time, iid: iid, remarks: remarks, key: key ,severity:severity,defect:defect } }
            configParam.RUN_REST_API(url, body ,'','','POST')
            .then(res => {
                setData([res.data])
                setLoading(false)
                setError(false)
            })
            .catch((e) => {
                setData(null)
                setLoading(false)
                setError(e)
            })
    };
    return { faultupdateLoading, faultupdateData, faultupdateError, getUpdateFaultInfo };

}
export default useUpdateFaults;