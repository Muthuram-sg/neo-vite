import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMultiLineUsersList = () => {
    const [MultiLineUsersListLoading, setLoading] = useState(false);
    const [MultiLineUsersListData, setData] = useState(null);
    const [MultiLineUsersListError, setError] = useState(null); 
    const getMultiLineUsersList = async (line_id) => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetMultilineUsersList, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_user_role_line) {
                    setData(response.neo_skeleton_user_role_line)
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
    return { MultiLineUsersListLoading, MultiLineUsersListData, MultiLineUsersListError, getMultiLineUsersList };
};

export default useMultiLineUsersList;