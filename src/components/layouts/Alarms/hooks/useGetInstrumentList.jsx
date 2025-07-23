import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetInstrumentList= () => {
    const [ InstrumentListLoading , setLoading] = useState(false);
    const [ InstrumentListData, setData] = useState(null);
    const [ InstrumentListError , setError] = useState(null);

    const getInstrumentList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentList, { line_id: line_id }) 
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
    return {   InstrumentListLoading,  InstrumentListData , InstrumentListError,getInstrumentList };
};

export default useGetInstrumentList;