import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";


const useDeleteOfflineAlerts = () => {
    const [delOfflinewithoutIDLoading, setLoading] = useState(false);
    const [delOfflinewithoutIDData, setData] = useState(null);
    const [delOfflinewithoutIDError, setError] = useState(null);

    const getDeleteOfflineInstument = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.deleteOfflineAlerts, { iid: id })
            .then((response) => {
                console.log("response",response)
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Delete Downtime Reasons Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { delOfflinewithoutIDLoading, delOfflinewithoutIDData, delOfflinewithoutIDError, getDeleteOfflineInstument };
}


export default useDeleteOfflineAlerts;