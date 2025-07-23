import { useState } from "react";
import configParam from "config";

const useGetAllCustomer = () => {
    const [allCustomerLoading, setLoading] = useState(false);
    const [allCustomerData, setData] = useState(null);
    const [allCustomerError, setError] = useState(null);

    const getAllCustomer = async () => {
        setLoading(true);
        let url = "/neonix-api/api/CustomerMaster/GetUserList";
        
        await configParam.RUN_REST_API(url, "", "", "", "Get")
            .then((response) => {
                if (response !== undefined && response) {
                    setData(response.response);
                    setError(false);
                    setLoading(false);
                } else {
                    setData(null);
                    setError(response);
                    setLoading(false);
                }
            })
            .catch((e) => {
                console.log("CUSTOMER LIST API FAILURE", e, window.location.pathname.split("/").pop(), new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { allCustomerLoading, allCustomerData, allCustomerError, getAllCustomer };
};

export default useGetAllCustomer;
