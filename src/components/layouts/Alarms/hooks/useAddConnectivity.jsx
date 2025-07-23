import { useState } from "react";
import configParam from "config"; 
import Mutations from "components/layouts/Mutations";
const UseAddConnectivity = () => {
    const [addConnectivityLoading, setLoading] = useState(false);
    const [addConnectivityData, setData] = useState(null);
    const [addConnectivityError, setError] = useState(null);

    const addConnectivity = async (data) => {
     
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.AddBulkConnectivity, {objects:data})
            .then((addconnectivity) => { 
                if (addconnectivity && addconnectivity.insert_neo_skeleton_connectivity) { 
                    setData(addconnectivity.insert_neo_skeleton_connectivity)
                    setError(false)
                    setLoading(false)
                }
                else { 
                 
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Getting Quality Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { addConnectivityLoading, addConnectivityData, addConnectivityError, addConnectivity };
};

export default UseAddConnectivity;