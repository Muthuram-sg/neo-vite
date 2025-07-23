import { useState } from "react";
import configParam from "config";

const useGetDataforAlerts = () => {
    const [DataforAlertsLoading, setLoading] = useState(false);
    const [DataforAlertsData, setData] = useState(null);
    const [DataforAlertsError, setError] = useState(null);

    const getDataforAlerts= async (schema, instruments, keys,from,to,datacount,f90,maxalert) => {
      console.log(schema, instruments, keys,from,to,datacount,f90,maxalert,"hook data")
        setLoading(true);
        
            let body ={schema:schema ,instrumentid : instruments , metricid:keys , from : from , to : to , datacount,f90:f90,maxalert:maxalert}
            console.log(body,"body")
          
            await configParam.RUN_REST_API('/alerts/getDataforAlerts', body, '', '', 'POST')
            .then(result => {
              console.log(result,"result hook")
               if (result &&  result.data) {
                    setLoading(false)
                    setData(result.data)
                    setError(false)
                } else {
                    setLoading(false)
                    setData([])
                    setError(false)
                }
              
            })
            .catch((err) => {
              setError(err)
              setLoading(false)
              setData([])
              console.log('error');
            })
      
        
    };

    return { DataforAlertsLoading, DataforAlertsData, DataforAlertsError, getDataforAlerts };
};

export default useGetDataforAlerts;