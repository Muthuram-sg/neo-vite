import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentMapList = () => {
    const [InstrmentMapListLoading, setLoading] = useState(false);
    const [InstrmentMapListdata, setData] = useState(null);
    const [InstrmentMapListerror, setError] = useState(null);

    const getInstrmentMapList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentMapList, { line_id: line_id })
            
            .then(InstrmentMapList => {
                // console.log(InstrmentMapList,"InstrmentMapList")
                if (InstrmentMapList !== undefined && InstrmentMapList.neo_skeleton_instruments) {
                    setData(InstrmentMapList.neo_skeleton_instruments)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }


                // console.log(alertsList, "alertsListalertsList")
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { InstrmentMapListLoading, InstrmentMapListdata, InstrmentMapListerror, getInstrmentMapList };
}

export default useInstrumentMapList;
