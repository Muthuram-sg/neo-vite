import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelquality = () => {
    const [delqualitywithoutIDLoading, setLoading] = useState(false);
    const [delqualitywithoutIDData, setData] = useState(null);
    const [delqualitywithoutIDError, setError] = useState(null);

    const getdelqualitywithoutID = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.DeleteQualityMetrics, {id:id})
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Delete Quality Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { delqualitywithoutIDLoading, delqualitywithoutIDData, delqualitywithoutIDError, getdelqualitywithoutID };
}


export default useDelquality;