import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddInstrument = () => {
    const [outVInstrumentLoading, setLoading] = useState(false);
    const [outVInstrumentData, setData] = useState(null);
    const [outVInstrumentError, setError] = useState(null);

    const getAddInstrumentFormula = async ( line_id,name,formula ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.addInstrumentFormula,{ line_id,name,formula })
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

    return { outVInstrumentLoading, outVInstrumentData, outVInstrumentError, getAddInstrumentFormula };
}


export default useAddInstrument;