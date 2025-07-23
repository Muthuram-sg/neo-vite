import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelQuality = () => {
    const [delqualitywithoutIDLoading, setLoading] = useState(false);
    const [delqualitywithoutIDData, setData] = useState(null);
    const [delqualitywithoutIDError, setError] = useState(null);

    const getadelqualitywithoutID = async (defect_id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.deleteDefects, { defect_id: defect_id })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", e, "Deleted in quality Report", new Date())
            })
    }

    return { delqualitywithoutIDLoading, delqualitywithoutIDData, delqualitywithoutIDError, getadelqualitywithoutID };
}


export default useDelQuality;