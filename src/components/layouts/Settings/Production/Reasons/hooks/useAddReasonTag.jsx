import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddReasonTag = () => {
    const [AddReasonTagLoading, setLoading] = useState(false);
    const [AddReasonTagData, setData] = useState(null);
    const [AddReasonTagError, setError] = useState(null);

    const getAddReasonTag = async (ReasonTag,user_id,line_id, reason_type) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.addReasonTag, { reason_tag : ReasonTag , user_id : user_id , line_id : line_id, reason_type: reason_type})
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_prod_reason_tags_one) {
                    setData(response.insert_neo_skeleton_prod_reason_tags_one);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AddReasonTagLoading, AddReasonTagData, AddReasonTagError, getAddReasonTag };
}


export default useAddReasonTag;