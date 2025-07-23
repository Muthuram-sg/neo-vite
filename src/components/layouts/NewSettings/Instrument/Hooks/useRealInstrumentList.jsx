import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useRealInstrumentList = () => {
    const [realInstrumentListLoading, setLoading] = useState(false);
    const [realInstrumentListData, setData] = useState(null);
    const [realInstrumentListError, setError] = useState(null);

    const getRealInstrumentList = async (line_id) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getRealInstrumentList, { line_id:line_id  })
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_instruments ) {
                    setData(returnData.neo_skeleton_instruments);
                    setError(false)
                    setLoading(false)
                } else {
                    
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
    };


        return { realInstrumentListLoading, realInstrumentListData, realInstrumentListError, getRealInstrumentList };
    };

    export default useRealInstrumentList;