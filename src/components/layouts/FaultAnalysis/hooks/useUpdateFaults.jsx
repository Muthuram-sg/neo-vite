import { useState } from "react";
import configParam from "config";

const useUpdateFaults = () => {
    const [faultupdateLoading, setLoading] = useState(false);
    const [faultupdateError, setError] = useState(null);
    const [faultupdateData, setData] = useState(null);


    const getUpdateFaultInfo = async (schema,Data) => {
        setLoading(true);
        let url = "/iiot/updatefaultinfo";
            let body ={schema: schema,data: Data} 
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