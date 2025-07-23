import { useState } from "react";
import configParam from "config";

const useDeleteComponent = () => {
    const [deleteComponentLoading, setLoading] = useState(false);
    const [deleteComponentData, setData] = useState(null);
    const [deleteComponentError, setError] = useState(null);

    const deleteComponent = async (componentId) => {
        setLoading(true);
        let url = `/neonix-api/api/ComponentMaster/RemoveComponentMaster`;
        await configParam.RUN_REST_API(url, componentId, '', '', "DELETE")
            .then((response) => {
                if (response) {
                    if (typeof response === "string") {
                        setData(response); // Wrap the string in an object
                    } else {
                        setData(response && response.response ? response.response : null); // Use the object directly
                    }
                    setError(false);
                } else {
                    setData(null);
                    setError(response);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, "Deleting Components", new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { deleteComponentLoading, deleteComponentData, deleteComponentError, deleteComponent };
};

export default useDeleteComponent;
