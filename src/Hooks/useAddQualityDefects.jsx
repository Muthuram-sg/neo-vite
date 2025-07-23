import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddQualityDefects = () => {
    const [AddQualityDefectsLoading, setLoading] = useState(false);
    const [AddQualityDefectsData, setData] = useState(null);
    const [AddQualityDefectsError, setError] = useState(null);

    const getAddQualityDefects = async (rejectObj,reasonID,user,description,plant) => {
        setLoading(true);
        // console.log(rejectObj,"rejectObj")
        configParam.RUN_GQL_API(mutations.addQualityDefectsWithoutOrderID, { entity_id: rejectObj.entity_id, reason_id: reasonID, quantity: "1", user_id: user,comments: description,time: rejectObj.time,line_id: plant,part_number: rejectObj.instrument_type===9 ?'Part '+rejectObj.value:null})
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_prod_quality_defects_one) {
                    setData(response.insert_neo_skeleton_prod_quality_defects_one);
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