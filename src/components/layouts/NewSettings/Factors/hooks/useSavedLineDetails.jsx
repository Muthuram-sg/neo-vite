import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useSavedLineDetails = () => {
    const [updatedLineLoading, setLoading] = useState(false);
    const [updatedLineData, setData] = useState(null);
    const [updatedLineError, setError] = useState(null);

    const getSavedLineDetails = async ( line_id ) => {
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.GetUpdatedLineData,{ line_id })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            })
    }

    return { updatedLineLoading, updatedLineData, updatedLineError, getSavedLineDetails };
}


export default useSavedLineDetails;