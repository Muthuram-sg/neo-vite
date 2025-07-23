import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useOfflineInstrumentList = () => {
    const [offlineInstrumentListLoading, setLoading] = useState(false);
    const [offlineInstrumentListData, setData] = useState(null);
    const [offlineInstrumentListError, setError] = useState(null);

    const getofflineInstrumentList = async (line_id) => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getOfflineInstrumentList, { line_id:line_id  })
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


        return { offlineInstrumentListLoading, offlineInstrumentListData, offlineInstrumentListError, getofflineInstrumentList };
    };

    export default useOfflineInstrumentList;