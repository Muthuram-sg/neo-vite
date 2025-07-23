import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMultiLineInstrumentList = () => {
    const [MultiLineInstrumentListLoading, setLoading] = useState(false);
    const [MultiLineInstrumentListData, setData] = useState(null);
    const [MultiLineInstrumentListError, setError] = useState(null); 
    const getMultiLineInstrumentList = async (line_id) => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetMultiLineInstrumentList, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_instruments) {
                    setData(response.neo_skeleton_instruments)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { MultiLineInstrumentListLoading, MultiLineInstrumentListData, MultiLineInstrumentListError, getMultiLineInstrumentList };
};

export default useMultiLineInstrumentList;