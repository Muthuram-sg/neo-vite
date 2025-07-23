import { useState } from "react";
import configParam from "config";

const useGetComponents = () => {
    const [getComponentsLoading, setLoading] = useState(false);
    const [getComponentsData, setData] = useState(null);
    const [getComponentsError, setError] = useState(null);

    const getComponents = async () => {
        setLoading(true);
        let url = `/neonix-api/api/ComponentMaster/GetAllComponentMaster`;
        await configParam.RUN_REST_API(url, '', '', '', "GET")
            .then((response) => {
                if (response && response.response) {
                    setData(response.response);
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, "Fetching Components", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { getComponentsLoading, getComponentsData, getComponentsError, getComponents };
};

export default useGetComponents;
