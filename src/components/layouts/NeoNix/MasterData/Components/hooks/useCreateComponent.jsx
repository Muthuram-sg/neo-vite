import { useState } from "react";
import configParam from "config";

const useCreateComponent = () => {
    const [createComponentLoading, setLoading] = useState(false);
    const [createComponentData, setData] = useState(null);
    const [createComponentError, setError] = useState(null);

    const createComponent = async (componentDetails) => {
        setLoading(true);
        let url = `/neonix-api/api/ComponentMaster/CreateComponentMaster`;
        await configParam.RUN_REST_API(url, componentDetails, '', '', "POST")
            .then((response) => {
                console.log(response,'response')
                if (response) {
                    setData(response);
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, "Creating Components", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { createComponentLoading, createComponentData, createComponentError, createComponent };
};

export default useCreateComponent;
