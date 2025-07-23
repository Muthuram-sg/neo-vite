import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateInstrument = () => {
    const [outUpdateInstrumentLoading, setLoading] = useState(false);
    const [outUpdateInstrumentData, setData] = useState(null);
    const [outUpdateInstrumentError, setError] = useState(null);

    const getUpdateInstrumentFormula = async ( for_id,line_id,name,formula ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.editInstrumentFormula,{ for_id,line_id,name,formula })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { outUpdateInstrumentLoading, outUpdateInstrumentData, outUpdateInstrumentError, getUpdateInstrumentFormula };
}


export default useUpdateInstrument;