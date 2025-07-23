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
                                console.log("response4",response4)
                                return configParam.RUN_GQL_API(mutations.deleteOfflineAlerts, { iid: instrumentID })
                              

                        .then(async(response5) => {
                            console.log("response5",response5)
                            return configParam.RUN_GQL_API(mutations.DeleteInstrument, { id: instrumentID, line_id: line_id })

                            .then((response6) => {
                                console.log("response6",response6)
                                if (response6 !== undefined && response6.delete_neo_skeleton_instruments) {
                                    return response6.delete_neo_skeleton_instruments
                                }
                                else return []
                            })
                            
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