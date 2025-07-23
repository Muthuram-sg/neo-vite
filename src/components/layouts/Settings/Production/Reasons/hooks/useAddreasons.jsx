import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddreasons = () => {
    const [addreasonswithoutIDLoading, setLoading] = useState(false);
    const [addreasonswithoutIDData, setData] = useState(null);
    const [addreasonswithoutIDError, setError] = useState(null);

    const getaddreasonswithoutID = async (reason, type_id, user_id, line_id,include_in_oee,reason_tag,hmi) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addReasons, { reason: reason, type_id: type_id, user_id: user_id, line_id: line_id,include_in_oee:include_in_oee,reason_tag :reason_tag,hmi:hmi })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Add Reasons Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { addreasonswithoutIDLoading, addreasonswithoutIDData, addreasonswithoutIDError, getaddreasonswithoutID };
}


export default useAddreasons;