import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddQualityDefects = () => {
    const [AddQualityDefectsLoading, setLoading] = useState(false);
    const [AddQualityDefectsData, setData] = useState(null);
    const [AddQualityDefectsError, setError] = useState(null);

    const getAddQualityDefects = async (body) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addQualityDefectsWithoutOrderID,body)
            .then((response) => {
                // console.log(response,"addQualityDefectsWithoutOrderID")
                if (response !== undefined && response.insert_neo_skeleton_prod_quality_defects && response.insert_neo_skeleton_prod_quality_defects.returning.length > 0) {
                    setData(response.insert_neo_skeleton_prod_quality_defects.returning);
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

    return { AddQualityDefectsLoading, AddQualityDefectsData, AddQualityDefectsError, getAddQualityDefects };
}


export default useAddQualityDefects;