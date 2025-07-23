import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useDuplicateInstrument = () => {
    const [DuplicateInstrumentLoading, setLoading] = useState(false);
    const [DuplicateInstrumentData, setData] = useState(null);
    const [DuplicateInstrumentError, setError] = useState(null);



    const getDuplicateInstrument = async (lastInsertID) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.duplicateInstrument, { id: lastInsertID })
            .then((response) => {
                if (response!== undefined && response.neo_skeleton_instruments_metrics) {
                   
                    setData(response.neo_skeleton_instruments_metrics);
                    setError(false)
                    setLoading(false)
                }
                else{
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

    return { DuplicateInstrumentLoading, DuplicateInstrumentData, DuplicateInstrumentError, getDuplicateInstrument };
}


export default useDuplicateInstrument;