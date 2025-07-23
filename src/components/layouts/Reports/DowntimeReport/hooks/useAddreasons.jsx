import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddreasons = () => {
    const [addreasonswithoutIDLoading, setLoading] = useState(false);
    const [addresonswithoutIDData, setData] = useState(null);
    const [addreasonswithoutIDError, setError] = useState(null);

    const getaddreasonswithoutID = async (datas, entity_id, reason_id,comments,user_id,line_id,reason_tags) => {

        
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addOutageWithoutOrderID, { start_dt: datas.start_dt, end_dt: datas.end_dt, entity_id: entity_id, reason_id: reason_id,comments:comments,user_id:user_id,line_id:line_id,reason_tags:reason_tags })
            .then((response) => {
                console.log("add reason",response);
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Add Reasons Downtime Report Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { addreasonswithoutIDLoading, addresonswithoutIDData, addreasonswithoutIDError, getaddreasonswithoutID };
}


export default useAddreasons;