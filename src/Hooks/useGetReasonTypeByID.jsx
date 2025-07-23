import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetReasonTypeByID = () => {
    const [ReasonListLoading, setLoading] = useState(false);
    const [ReasonListData, setData] = useState(null);
    const [ReasonListError, setError] = useState(null);

    const getReason = async (id) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getReasonsListbyTypeOnly, { reasonType: id })
            .then((unitData) => {
                if (unitData !== undefined && unitData.neo_skeleton_prod_reasons && unitData.neo_skeleton_prod_reasons.length > 0) {
                    setData(unitData.neo_skeleton_prod_reasons);
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

    return { ReasonListLoading, ReasonListData, ReasonListError, getReason };
}


export default useGetReasonTypeByID;