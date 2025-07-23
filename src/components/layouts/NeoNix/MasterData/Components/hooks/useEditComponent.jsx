import { useState } from "react";
import configParam from "config";

const useEditComponent = () => {
    const [editComponentLoading, setLoading] = useState(false);
    const [editComponentData, setData] = useState(null);
    const [editComponentError, setError] = useState(null);

    const editComponent = async (componentDetails) => {
        setLoading(true);
        let url = `/neonix-api/api/ComponentMaster/EditComponentMaster`;
        await configParam.RUN_REST_API(url, componentDetails, '', '', "POST")
            .then((response) => {
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
                console.log("NEW MODEL", "API FAILURE", e, "Editing Components", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { editComponentLoading, editComponentData, editComponentError, editComponent };
};

export default useEditComponent;
