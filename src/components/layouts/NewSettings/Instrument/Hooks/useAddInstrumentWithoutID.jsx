import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddInstrumentwithoutID = () => {
    const [AddInstrumentwithoutIDLoading, setLoading] = useState(false);
    const [AddInstrumentwithoutIDData, setData] = useState(null);
    const [AddInstrumentwithoutIDError, setError] = useState(null);

    const getAddInstrumentwithoutID = async (line_id,formulaName,categoryID,typeID,user_id, isOffline,isForeCast) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.AddInstrumentWithoutID, { line_id: line_id, name: formulaName, category: categoryID, instrument_type: typeID, user_id: user_id, isOffline:isOffline,isForeCast:isForeCast})
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_instruments_one){
                setData(response.insert_neo_skeleton_instruments_one);
                setError(false)
                setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AddInstrumentwithoutIDLoading, AddInstrumentwithoutIDData, AddInstrumentwithoutIDError, getAddInstrumentwithoutID };
}


export default useAddInstrumentwithoutID;