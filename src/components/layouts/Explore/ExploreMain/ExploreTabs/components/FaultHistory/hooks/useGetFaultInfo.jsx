import { useState } from "react";
import configParam from "config";

const useGetFaultInfo = () => {
    const [faultInfoLoading, setLoading] = useState(false); 
    const [faultInfoError, setError] = useState(null); 
    const [faultInfoData, setData] = useState(null); 
    

    const getFaultInfo = async (schema,frmDate,toDate) => {
        setLoading(true);
      
        await configParam
        .RUN_REST_API("/iiot/getfaultinfo", { schema: schema, from: frmDate, to: toDate })
        .then((result) => {
          if (result.data && result.data.length > 0) {
            setLoading(false)
            setError(false)
            setData( result.data)
          } else {
            setLoading(false)
            setError(false)
            setData([])
          }
  
        }).catch(error => { 
            setLoading(false)
            setError(error)
            setData(null)
            console.log('error', error) 
        });
        
    };
    return {  faultInfoLoading, faultInfoData, faultInfoError, getFaultInfo };
};

export default useGetFaultInfo;