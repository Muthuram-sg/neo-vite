import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetAlertAggregate= () => {
    const [ AlertAggregateLoading , setLoading] = useState(false);
    const [ AlertAggregateData, setData] = useState(null);
    const [ AlertAggregateError , setError] = useState(null);

    const getAlertAggregate = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.alertAggregateFunction, {}) 
          .then((aggregate) => {
            
            if ( aggregate !== undefined && aggregate.neo_skeleton_alert_check_aggregate_functions && aggregate.neo_skeleton_alert_check_aggregate_functions.length > 0) {
         
                setData(aggregate.neo_skeleton_alert_check_aggregate_functions)
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
    return {   AlertAggregateLoading,  AlertAggregateData , AlertAggregateError,getAlertAggregate };
};

export default  useGetAlertAggregate;