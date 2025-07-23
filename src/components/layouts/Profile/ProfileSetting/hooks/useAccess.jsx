import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAccess = () => {
    const [outALLoading, setLoading] = useState(false);
    const [outALData, setData] = useState(null);
    const [outALError, setError] = useState(null);

    const getAccessList = async (user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetAccessLinesList, {user_id:user_id})
            .then((responseData) => {
                if (responseData.neo_skeleton_user_role_line) {
                    setData(responseData.neo_skeleton_user_role_line)
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
                console.log("NEW MODEL", e, "Getting Product Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outALLoading, outALData, outALError, getAccessList };
};

export default useAccess;