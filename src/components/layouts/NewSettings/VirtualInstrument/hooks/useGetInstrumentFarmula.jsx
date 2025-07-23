import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
// NOSONAR start -  skip 
const useGetInstrumentFarmula = () => {
    const [outDTLoading, setLoading] = useState(false);//NOSONAR
    const [outDTData, setData] = useState(null);//NOSONAR
    const [outDTError, setError] = useState(null);//NOSONAR

    const getInstrumentFormulaList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentFormula, { line_id: line_id })
            .then((returnLineFormula) => {
                if (returnLineFormula !== undefined && returnLineFormula.neo_skeleton_virtual_instruments ) {
                    setData(returnLineFormula.neo_skeleton_virtual_instruments);
                    setLoading(false);
                
                  } else {
                    console.log("returndata undefined getInstrumentFormulaList");
                  }
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });
            

    };
    return { outDTLoading, outDTData, outDTError, getInstrumentFormulaList };
};
// NOSONAR end -  skip 

export default useGetInstrumentFarmula;