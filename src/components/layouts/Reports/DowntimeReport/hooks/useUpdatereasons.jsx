import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdatereasons = () => {
    const [updatereasonswithoutIDLoading, setLoading] = useState(false);
    const [updatereasonswithoutIDData, setData] = useState(null);
    const [updatereasonswithoutIDError, setError] = useState(null);

    const getupdatereasonswithoutID = async (reason_id, outage_id , description,reason_tags) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.updateReason, { reason_id: reason_id, outage_id: outage_id , description : description , reason_tags :reason_tags})
            .then((response) => {
                console.log("update Reason",response);
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Update reason in Downtime report Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { updatereasonswithoutIDLoading, updatereasonswithoutIDData, updatereasonswithoutIDError, getupdatereasonswithoutID };
}


export default useUpdatereasons;