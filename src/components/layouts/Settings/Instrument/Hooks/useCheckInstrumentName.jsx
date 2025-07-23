import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useCheckInstrumentName = () => {
    const [checkInstrumentNameLoading, setLoading] = useState(false);
    const [checkInstrumentNameData, setData] = useState(null);
    const [checkInstrumentNameError, setError] = useState(null);

    const getCheckInstrumentName = async (instrumentName,type) => {
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.checkInstrumentName, { name: instrumentName.toString() })
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

    return { checkInstrumentNameLoading, checkInstrumentNameData, checkInstrumentNameError, getCheckInstrumentName };
}


export default useCheckInstrumentName;