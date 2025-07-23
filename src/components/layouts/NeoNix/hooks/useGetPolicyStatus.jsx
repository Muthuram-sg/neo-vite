import { useState } from "react";
import configParam from "config"; 

const useGetPolicyStatus = () => {
    const [policyStatusLoading, setLoading] = useState(false);
    const [policyStatusData, setData] = useState(null);
    const [policyStatusError, setError] = useState(null);

    const getPolicyStatus = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/Policy/GetPolicyMasterStatus";
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

    return { policyStatusLoading, policyStatusData, policyStatusError, getPolicyStatus };
}


export default useGetPolicyStatus;