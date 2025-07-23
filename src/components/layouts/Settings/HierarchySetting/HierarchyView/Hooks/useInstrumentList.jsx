import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentList = () => {
    const [instrumentListLoading, setLoading] = useState(false);
    const [instrumentListData, setData] = useState(null);
    const [instrumentListError, setError] = useState(null); 
    const instrumentList = async (line_id) => {
       
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getRealInstrumentList, {line_id: line_id})
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
    return { instrumentListLoading, instrumentListData, instrumentListError, instrumentList };
};

export default useInstrumentList;