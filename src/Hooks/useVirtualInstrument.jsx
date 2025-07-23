import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useVirtualInstrument = () => {
    const [virtualInstrumentListLoading, setLoading] = useState(false);
    const [virtualInstrumentListData, setData] = useState(null);
    const [virtualInstrumentListError, setError] = useState(null); 
    const virtualInstrumentList = async (line_id) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentFormula, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_virtual_instruments) {
                    setData(response.neo_skeleton_virtual_instruments)
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
    return { virtualInstrumentListLoading, virtualInstrumentListData, virtualInstrumentListError, virtualInstrumentList };
};

export default useVirtualInstrument;