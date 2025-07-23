import { useState } from "react";
import configParam from "config"; 

const useGetAllPolicy = () => {
    const [allPolicyLoading, setLoading] = useState(false);
    const [allPolicyData, setData] = useState(null);
    const [allPolicyError, setError] = useState(null);

    const getAllPolicy = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/Policy/GetAllPolicyMaster";
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

    return { allPolicyLoading, allPolicyData, allPolicyError, getAllPolicy };
}


export default useGetAllPolicy;