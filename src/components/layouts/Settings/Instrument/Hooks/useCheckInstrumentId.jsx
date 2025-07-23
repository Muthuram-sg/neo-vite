import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useCheckInstrumentId = () => {
    const [checkInstrumentIdLoading, setLoading] = useState(false);
    const [checkInstrumentIdData, setData] = useState(null);
    const [checkInstrumentIdError, setError] = useState(null);

    const getCheckInstrumentId = async (id,type) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.checkInstrumentId, { iid: id.toString() })
            .then((response) => {
                setData({Data: response ,type:type});
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

    return { checkInstrumentIdLoading, checkInstrumentIdData, checkInstrumentIdError, getCheckInstrumentId };
}


export default useCheckInstrumentId;