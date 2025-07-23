import { useState } from "react";
import configParam from "config"; 

const useGetAllCustomerMaster = () => {
    const [allCustomersLoading, setLoading] = useState(false);
    const [allCustomersData, setData] = useState(null);
    const [allCustomersError, setError] = useState(null);

    const getAllCustomers = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/CustomerMaster/AllCustomerMaster";
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

    return { allCustomersLoading, allCustomersData, allCustomersError, getAllCustomers };
}


export default useGetAllCustomerMaster;