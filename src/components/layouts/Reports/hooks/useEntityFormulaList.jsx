import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useEntityFormulaList = () => {
    const [EntityFormulaListLoading, setLoading] = useState(false); 
    const [EntityFormulaListError, setError] = useState(null); 
    const [EntityFormulaListData, setData] = useState(null); 

    const getEntityFormulaList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getInstrumentFormula,{line_id: line_id})
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_virtual_instruments && returnData.neo_skeleton_virtual_instruments) {
                    setData(returnData.neo_skeleton_virtual_instruments)
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  EntityFormulaListLoading, EntityFormulaListData, EntityFormulaListError, getEntityFormulaList };
};

export default useEntityFormulaList;