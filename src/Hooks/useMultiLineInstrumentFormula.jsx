import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMultiLineInstrumentFormula = () => {
    const [MultiLineInstrumentFormulaListLoading, setLoading] = useState(false);
    const [MultiLineInstrumentFormulaListData, setData] = useState(null);
    const [MultiLineInstrumentFormulaListError, setError] = useState(null); 
    const getMultiLineInstrumentFormulaList = async (line_id) => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getMultiLineInstrumentFormula, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_virtual_instruments) {
                    setData(response.neo_skeleton_virtual_instruments)
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
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { MultiLineInstrumentFormulaListLoading, MultiLineInstrumentFormulaListData, MultiLineInstrumentFormulaListError, getMultiLineInstrumentFormulaList };
};

export default useMultiLineInstrumentFormula;