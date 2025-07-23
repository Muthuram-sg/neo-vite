import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useFetchInstrumentbyLine = () => {
    const [FetchInstrumentbyLineLoading, setLoading] = useState(false); 
    const [FetchInstrumentbyLineError, setError] = useState(null); 
    const [FetchInstrumentbyLineData, setData] = useState(null); 

    const getFetchInstrumentbyLine = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.FetchInstumentlistbyLine,{"line_id": lineID})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                  // console.log(returnData);
                    if(returnData.neo_skeleton_instruments){
                        setData(returnData.neo_skeleton_instruments)
                        setError(false)
                        setLoading(false)
                        
                    }
                    
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  FetchInstrumentbyLineLoading, FetchInstrumentbyLineError, FetchInstrumentbyLineData, getFetchInstrumentbyLine};
};

export default useFetchInstrumentbyLine;