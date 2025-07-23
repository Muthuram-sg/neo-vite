import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useCheckInstrumentName = () => {
    const [checkInstrumentNameLoading, setLoading] = useState(false);
    const [checkInstrumentNameData, setData] = useState(null);
    const [checkInstrumentNameError, setError] = useState(null);

    const getCheckInstrumentName = async (instrumentName,type, line_id, InstID) => {
        setLoading(true);
        if (type.toLowerCase() === "create") {
        configParam.RUN_GQL_API(gqlQueries.checkInstrumentName, { name: instrumentName.toString(), line_id:line_id })
            .then((response) => {
                setData({Data:response, type: type});
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    } else if (type.toLowerCase() === "edit") {
        console.log("InstID", InstID, type)
        configParam.RUN_GQL_API(gqlQueries.checkEditInstrumentName, { name: instrumentName.toString(), line_id:line_id, id:InstID })
            .then((response) => {
                setData({Data:response, type: type});
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    } 
    }
    return { checkInstrumentNameLoading, checkInstrumentNameData, checkInstrumentNameError, getCheckInstrumentName };
}


export default useCheckInstrumentName;