import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetOnlineInstrument= () => {
    const [ InstrumentListLoading , setLoading] = useState(false);
    const [ InstrumentListData, setData] = useState(null);
    const [ InstrumentListError , setError] = useState(null);

    const getOnlineInstrumentList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getOnlineInstruments, { line_id: line_id }) 
          .then((instrumentsData) => {
        
            if ( instrumentsData !== undefined && instrumentsData.neo_skeleton_instruments) {
                setData(instrumentsData.neo_skeleton_instruments)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   InstrumentListLoading,  InstrumentListData , InstrumentListError,getOnlineInstrumentList };
};

export default useGetOnlineInstrument;