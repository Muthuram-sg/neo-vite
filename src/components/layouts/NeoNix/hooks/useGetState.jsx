import { useState } from "react";
import configParam from "config";

const useGetCitiesByState = () => {
    const [citiesLoading, setLoading] = useState(false);
    const [citiesData, setData] = useState(null);
    const [citiesError, setError] = useState(null);

    const getCitiesByState = async (stateCode) => {
        setLoading(true);
        const url = `/neonix-api/api/CustomerMaster/CitiesByState?stateCode=${stateCode}`;

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
        citiesLoading,
        citiesData,
        citiesError,
        getCitiesByState,
    };
};

export default useGetCitiesByState;
