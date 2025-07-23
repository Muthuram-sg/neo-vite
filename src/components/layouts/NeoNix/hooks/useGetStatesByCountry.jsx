import { useState } from "react";
import configParam from "config"; 

const useGetStatesByCountry = () => {
    const [statesLoading, setLoading] = useState(false);
    const [statesData, setData] = useState(null);
    const [statesError, setError] = useState(null);

    const getStatesByCountry = async (countryCode) => {

        setLoading(true);
        const url = `/neonix-api/api/CustomerMaster/StatesByCountry?countryCode=${countryCode}`;

        await configParam.RUN_REST_API(url, "", "", "", "Get")
            .then((response) => {
                if (response !== undefined && response) {
                    setData(response.response);
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.error("API FAILURE", e);
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return {
        statesLoading,
        statesData,
        statesError,
        getStatesByCountry,
    };
};

export default useGetStatesByCountry;
