import { useState } from "react";
import configParam from "config"; 

const useGetCustomerMaster = () => {
    const [allCustomerLoading, setLoading] = useState(false);
    const [allCustomerData, setData] = useState(null);
    const [allCustomerError, setError] = useState(null);

    const getCustomerData = async () => {
        setLoading(true);
        let url = "/neonix-api/api/Company/GetCompanyType";
        await configParam.RUN_REST_API(url, "",'','',"Get")
        .then((response) => {
            if (response !== undefined && (response)) {
                console.log("sakjdvnjasndvjksad", response)
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

    return { allCustomerLoading, allCustomerError, allCustomerData, getCustomerData };
}


export default useGetCustomerMaster;