import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useFetchMetricbyInstrumentId = () => {
    const [FetchMetricbyInstrumentIdLoading, setLoading] = useState(false); 
    const [FetchMetricbyInstrumentIdError, setError] = useState(null); 
    const [FetchMetricbyInstrumentIdData, setData] = useState(null); 

    const getFetchMetricbyInstrumentId = async (instrumentID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetMetricbyInstrumentId,{"intrument_id": instrumentID})
      
            .then((returnData) => {  
               
                if (returnData !== undefined && returnData) { 
               
                    if(returnData.neo_skeleton_instruments_metrics){
                        setData(returnData.neo_skeleton_instruments_metrics)
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
    return {  FetchMetricbyInstrumentIdLoading, FetchMetricbyInstrumentIdError,FetchMetricbyInstrumentIdData, getFetchMetricbyInstrumentId};
};

export default useFetchMetricbyInstrumentId;