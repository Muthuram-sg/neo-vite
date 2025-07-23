import { useState } from "react";
import configParam from "config"; 
import Mutations from "components/layouts/Mutations";
const useDeleteConnectivity = () => {
    const [deleteConnectivityLoading, setLoading] = useState(false);
    const [deleteConnectivityData, setData] = useState(null);
    const [deleteConnectivityError, setError] = useState(null);

    const deleteConnectivity = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteConnectivity, {id:id})
            .then((deleteconnectivity) => {
                if (deleteconnectivity.delete_neo_skeleton_connectivity) {
                    setData(deleteconnectivity.delete_neo_skeleton_connectivity)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Getting Quality Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { deleteConnectivityLoading, deleteConnectivityData, deleteConnectivityError, deleteConnectivity };
};

export default useDeleteConnectivity;