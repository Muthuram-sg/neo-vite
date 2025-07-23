import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useEditreasons = () => {
    const [editreasonswithoutIDLoading, setLoading] = useState(false);
    const [editresonswithoutIDData, setData] = useState(null);
    const [editreasonswithoutIDError, setError] = useState(null);

    const geteditreasonswithoutID = async (id, reason, type_id, user_id,include_in_oee,reason_tag,hmi) => {
        console.log(id, reason, type_id, user_id,include_in_oee,reason_tag,hmi,"hook check")
        setLoading(true);
        configParam.RUN_GQL_API(mutations.editReasons, { id: id, reason: reason, type_id: type_id, user_id: user_id,include_in_oee:include_in_oee,reason_tag : reason_tag ,hmi:hmi})
            .then((response) => {
                console.log(response,"hook response")
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Edit Reasons Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { editreasonswithoutIDLoading, editresonswithoutIDData, editreasonswithoutIDError, geteditreasonswithoutID };
}


export default useEditreasons;