import { useState } from "react";
import configParam from "config"; 

const useGetOperation = () => {
    const [OperationLoading, setLoading] = useState(false);
    const [OperationData, setData] = useState(null);
    const [OperationError, setError] = useState(null);

    const getOperation = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/OperationMaster/GetOperationMaster";
        await configParam.RUN_REST_API(url, "",'','',"Get")
        .then((response) => {
            if (response !== undefined && (response)) {
                setData(response.response);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(response)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { OperationLoading, OperationData, OperationError, getOperation };
}


export default useGetOperation;