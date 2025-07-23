import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useReasonTags = () => {
    const [ReasonTagsListLoading, setLoading] = useState(false);
    const [ReasonTagsListData, setData] = useState(null);
    const [ReasonTagsListError, setError] = useState(null);

    const getReasonTags = async (line_id) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getReasonTags, {line_id : line_id })
            .then((tagsData) => {
                if (tagsData !== undefined && tagsData.neo_skeleton_prod_reason_tags && tagsData.neo_skeleton_prod_reason_tags.length > 0) {
                   
                    setData(tagsData.neo_skeleton_prod_reason_tags);
                    setError(false)
                    setLoading(false)

                } else {
                   
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

    return { ReasonTagsListLoading, ReasonTagsListData, ReasonTagsListError, getReasonTags };
}


export default useReasonTags;