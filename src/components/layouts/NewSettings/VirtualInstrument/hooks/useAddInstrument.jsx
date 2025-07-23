import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
// NOSONAR start -  skip start
const useAddInstrument = () => {
    const [outVInstrumentLoading, setLoading] = useState(false);//NOSONAR
    const [outVInstrumentData, setData] = useState(null);//NOSONAR
    const [outVInstrumentError, setError] = useState(null);//NOSONAR

    const getAddInstrumentFormula = async ( line_id,name,formula,created_by ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.addInstrumentFormula,{ line_id,name,formula,created_by })
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
// NOSONAR end -  skip 

export default useAddInstrument;