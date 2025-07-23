import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddquality = () => {
    const [addqualitywithoutIDLoading, setLoading] = useState(false);
    const [addqualitywithoutIDData, setData] = useState(null);
    const [addqualitywithoutIDError, setError] = useState(null);

    const getaddqualitywithoutID = async (variables) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.InsertQualityMetrics, { parameter: variables })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Add Quality Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { addqualitywithoutIDLoading, addqualitywithoutIDData, addqualitywithoutIDError, getaddqualitywithoutID };
}


export default useAddquality;