import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteInstrument = () => {
    const [outDelInstrumentLoading, setLoading] = useState(false);
    const [outDelInstrumentData, setData] = useState(null);
    const [outDelInstrumentError, setError] = useState(null);

    const getDelInstrumentFormula = async ( for_id ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.deleteInstrumentFormula,{ vir_id :for_id })
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

    return { outDelInstrumentLoading, outDelInstrumentData, outDelInstrumentError, getDelInstrumentFormula };
}


export default useDeleteInstrument;