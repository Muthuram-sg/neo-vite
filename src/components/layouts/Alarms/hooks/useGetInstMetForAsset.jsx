import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetInstMetForAsset= () => {
    const [ InstMetLoading , setLoading] = useState(false);
    const [ InstMetData, setData] = useState(null);
    const [ InstMetError , setError] = useState(null);

    const getInstMetForAsset = async (instID,metID) => {
        console.log(instID,metID,"instID,metIDinstID,metID")
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstMetOfAsset, { instrument_id: instID,metric_id:metID}) 
          .then((response) => {
         
           console.log(response,"responseresponseresponse")
                setData(response.neo_skeleton_instruments_metrics[0].id)
                setError(false)
                setLoading(false)
          
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   InstMetLoading,  InstMetData , InstMetError, getInstMetForAsset };
};

export default useGetInstMetForAsset;