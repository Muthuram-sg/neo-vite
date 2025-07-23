import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetDowntimeAlertCount= () => {
    const [ AlertDowntimeCountLoading , setLoading] = useState(false);
    const [ AlertDowntimeCountData, setData] = useState(null);
    const [ AlertDowntimeCountError , setError] = useState(null);

    const getAlertDowntimeCount = async (line_id, instrument_category) => {
        setLoading(true);
       
        await configParam.RUN_GQL_API(gqlQueries.downtimeAlertCount, {entity_type :"downtime", line_id :line_id, instrument_category: instrument_category}) 
        .then((response) => { 
          if(response !== undefined && response !== null && response.neo_skeleton_alerts_v2_aggregate){
         
           setData(response.neo_skeleton_alerts_v2_aggregate.aggregate.count)
                  setError(false)
                  setLoading(false)
          }
          else{
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
    return {   AlertDowntimeCountLoading,  AlertDowntimeCountData , AlertDowntimeCountError,getAlertDowntimeCount };
};

export default  useGetDowntimeAlertCount;