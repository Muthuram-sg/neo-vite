import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelaccesslists = () => {
    const [delaccesslistwithoutIDLoading, setLoading] = useState(false);
    const [delaccesslistwithoutIDData, setData] = useState(null);
    const [delaccesslistwithoutIDError, setError] = useState(null);

    const getadelaccesswithoutID = async (user_id, role_id, line_id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.DeleteUserRoleLineAccess, { user_id:user_id, role_id:role_id, line_id:line_id })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", e, "Deleted in profile setting", new Date())
            })
    }

    return { delaccesslistwithoutIDLoading, delaccesslistwithoutIDData, delaccesslistwithoutIDError, getadelaccesswithoutID };
}


export default useDelaccesslists; 