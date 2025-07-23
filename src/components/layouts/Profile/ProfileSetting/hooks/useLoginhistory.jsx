import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useLoginhistory = () => {
    const [outLHLoading, setLoading] = useState(false);
    const [outLHData, setData] = useState(null);
    const [outLHError, setError] = useState(null);

    const getLoginhistory = async (user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.loginHistory, {user_id:user_id})
            .then((responseData) => {
                if (responseData.neo_skeleton_user_access_history) {
                    setData(responseData.neo_skeleton_user_access_history)
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
                console.log("NEW MODEL", e, "Getting login History Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outLHLoading, outLHData, outLHError, getLoginhistory };
};

export default useLoginhistory;