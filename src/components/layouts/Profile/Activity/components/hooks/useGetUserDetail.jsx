import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetUserDetail = () => {
    const [UserDetailLoading, setLoading] = useState(false);
    const [UserDetailData, setData] = useState(null);
    const [UserDetailError, setError] = useState(null);

    const getUserDetail = async (user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetUserDefaults, { user_id: user_id })
        .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_user && returnData.neo_skeleton_user.length > 0) {
                    setData(returnData.neo_skeleton_user[0])
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
                console.log("NEW MODEL", e, "Getting Activity Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { UserDetailLoading, UserDetailData, UserDetailError, getUserDetail };
};

export default useGetUserDetail;