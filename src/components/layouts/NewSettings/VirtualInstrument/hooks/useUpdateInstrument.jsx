import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";
// NOSONAR start -  skip 
const useUpdateInstrument = () => {
    const [outUpdateInstrumentLoading, setLoading] = useState(false);//NOSONAR
    const [outUpdateInstrumentData, setData] = useState(null);//NOSONAR
    const [outUpdateInstrumentError, setError] = useState(null);//NOSONAR

    const getUpdateInstrumentFormula = async ( for_id,line_id,name,formula,updated_by ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.editInstrumentFormula,{ for_id,line_id,name,formula,updated_by })
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

// NOSONAR end -  skip 

export default useUpdateInstrument;