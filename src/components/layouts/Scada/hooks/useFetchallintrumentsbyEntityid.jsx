import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useFetchallintrumentsbyEntityid = () => {
    const [FetchallintrumentsbyEntityidLoading, setLoading] = useState(false); 
    const [FetchallintrumentsbyEntityidError, setError] = useState(null); 
    const [FetchallintrumentsbyEntityidData, setData] = useState(null); 

    const getFetchallintrumentsbyEntityid = async (entityID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getInstrumentWithEntityId,{"entity_id": entityID})
      
            .then((returnData) => {  
               
                if (returnData !== undefined && returnData) { 
                  // console.log(returnData);
                    if(returnData.neo_skeleton_entity_instruments){
                        setData(returnData.neo_skeleton_entity_instruments)
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
    return {  FetchallintrumentsbyEntityidLoading, FetchallintrumentsbyEntityidError,FetchallintrumentsbyEntityidData, getFetchallintrumentsbyEntityid};
};

export default useFetchallintrumentsbyEntityid;