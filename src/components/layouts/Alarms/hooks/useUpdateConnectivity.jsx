 import { useState } from "react";
import configParam from "config"; 
import Mutations from "components/layouts/Mutations";
const UseUpdateConnectivity = () => {
    const [updateConnectivityLoading, setLoading] = useState(false);
    const [updateConnectivityData, setData] = useState(null);
    const [updateConnectivityError, setError] = useState(null);

    const updateConnectivity = async (data) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateConnectivity, data)
            .then((updateconnectivity) => {
                if (updateconnectivity.update_neo_skeleton_connectivity) {
                    setData(updateconnectivity.update_neo_skeleton_connectivity)
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
    return { updateConnectivityLoading, updateConnectivityData, updateConnectivityError, updateConnectivity };
};

export default UseUpdateConnectivity;