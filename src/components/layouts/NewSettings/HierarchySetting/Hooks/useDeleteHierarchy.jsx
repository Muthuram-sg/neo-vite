import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteHierarchy = () => {
    const [deleteHierarchyLoading, setLoading] = useState(false);
    const [deleteHierarchyData, setData] = useState(null);
    const [deleteHierarchyError, setError] = useState(null); 
    const deleteHierarchy = async (hierid) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.DeleteHierarchy, { hier_id: hierid })
            .then((response) => {
                if (response !== undefined && response.delete_hierarchy) {
                    setData(response.delete_hierarchy)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { deleteHierarchyLoading, deleteHierarchyData, deleteHierarchyError, deleteHierarchy };
};

export default useDeleteHierarchy;