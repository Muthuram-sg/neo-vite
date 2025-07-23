import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentType = () => {
    const [InstrumentTypeListLoading, setLoading] = useState(false);
    const [InstrumentTypeListData, setData] = useState(null);
    const [InstrumentTypeListError, setError] = useState(null);

    // const getInstrumentType = async (categoryID, line_id) => {
        const getInstrumentType = async (categoryID) => {
        setLoading(true);
        // if(line_id && line_id.length > 0){
        // await configParam.RUN_GQL_API(gqlQueries.getInstrumentTypeByLine, {id: categoryID, line_id: line_id})
        //     .then((instrumentType) => {
        //         if (instrumentType !== undefined && instrumentType.neo_skeleton_instruments && instrumentType.neo_skeleton_instruments.length > 0) {
        //             setData(instrumentType.neo_skeleton_instruments);
        //             setError(false)
        //             setLoading(false)
        //         } else {
        //             setData(null)
        //             setError(true)
        //             setLoading(false)

        //         }

        //     })
        //     .catch((e) => {
        //         console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date())
        //         setLoading(false);
        //         setError(e);
        //         setData(null);
        //     })
        // } else {
            await configParam.RUN_GQL_API(gqlQueries.getInstrumentType, {instrument_category_id: categoryID})
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
      //  }
    }

    return { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType };
}


export default useInstrumentType;