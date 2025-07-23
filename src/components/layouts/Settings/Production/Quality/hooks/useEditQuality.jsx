import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useEditquality = () => {
    const [editqualitywithoutIDLoading, setLoading] = useState(false);
    const [editqualitywithoutIDData, setData] = useState(null);
    const [editqualitywithoutIDError, setError] = useState(null);

    const geteditqualitywithoutID = async (variable) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.UpdateQualityMetrics, variable)
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Edit Quality Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { editqualitywithoutIDLoading, editqualitywithoutIDData, editqualitywithoutIDError, geteditqualitywithoutID };
}


export default useEditquality;