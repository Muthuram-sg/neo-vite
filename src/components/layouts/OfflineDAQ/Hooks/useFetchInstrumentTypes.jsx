import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useFetchInstrumentTypes = () => {
    const [InstrumentTypeListLoading, setLoading] = useState(false);
    const [InstrumentTypeListData, setData] = useState(null);
    const [InstrumentTypeListError, setError] = useState(null);

    const getInstrumentType = async () => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getInstrumentType, {})
            .then((instrumentType) => {
                if (instrumentType !== undefined && instrumentType.neo_skeleton_instrument_types && instrumentType.neo_skeleton_instrument_types.length > 0) {
                    setData(instrumentType.neo_skeleton_instrument_types);
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)

                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType };
}


export default useFetchInstrumentTypes;