import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";


const useDeleteInstrumentFormula = () => {
    const [DeleteInstrumentFormulaLoading, setLoading] = useState(false);
    const [DeleteInstrumentFormulaData, setData] = useState(null);
    const [DeleteInstrumentFormulaError, setError] = useState(null);

    const getDeleteInstrumentFormula = async (instrumentID, line_id) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.deleteInstrumentAnnotations, { instruments_id: instrumentID })
            .then(async (response) => {
                const result = await configParam.RUN_GQL_API(mutations.deleteInstrumentOEEConfig, { instruments_id: instrumentID })
                
                    .then(async (response1) => {
                       return configParam.RUN_GQL_API(mutations.deleteInstrumentConnectivity, { instrument_id: instrumentID })

                       .then(async(response2) => {
                        return configParam.RUN_GQL_API(mutations.deleteInstrumentsMapping, { instrument_id: instrumentID })

                        .then(async(response3) => {
                            return configParam.RUN_GQL_API(mutations.deleteTaskInstrument, { instrument_id: instrumentID })
                       
                        .then(async(response4) => {
                            return configParam.RUN_GQL_API(mutations.DeleteInstrument, { id: instrumentID, line_id: line_id })
                           
                            .then((response5) => {
                                if (response5 !== undefined && response5.delete_neo_skeleton_instruments) {
                                    return response5.delete_neo_skeleton_instruments
                                }
                                else return []
                            })
                            
                        })
                       
                    })
                       
                        })
                       
                    })
                setData(result);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
                    
         }

    return { DeleteInstrumentFormulaLoading, DeleteInstrumentFormulaData, DeleteInstrumentFormulaError, getDeleteInstrumentFormula };
    }


    export default useDeleteInstrumentFormula;