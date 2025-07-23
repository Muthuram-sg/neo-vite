import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useVirtualInstrumentFormula = () => {
    const [VirtualInstrumentFormulaLoading, setLoading] = useState(false);
    const [VirtualInstrumentFormuladata, setData] = useState(null);
    const [VirtualInstrumentFormulaerror, setError] = useState(null);

    const getVirtualInstrumentFormula = async (viids) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getVirtualInstrumentFormula, { VIID: viids })
            .then(result => {
                if (result && result.neo_skeleton_virtual_instruments && result.neo_skeleton_virtual_instruments.length > 0 ) {
                    setData(result.neo_skeleton_virtual_instruments)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula };
}

export default useVirtualInstrumentFormula;
