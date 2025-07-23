import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetAlertCount= () => {
    const [ AlertCountLoading , setLoading] = useState(false);
    const [ AlertCountData, setData] = useState(null);
    const [ AlertCountError , setError] = useState(null);

    const getAlertCount = async (line_id, instrument_category) => {
   
        setLoading(true);
        let count = []
        await configParam.RUN_GQL_API(gqlQueries.timeSlotAlertCount, {entity_type :"time_slot", line_id :line_id, instrument_category: instrument_category}) 
        .then((response) => { 
          if(response !== undefined && response !== null && response.neo_skeleton_alerts_v2_aggregate){
            count =Object.keys(response).map((key) => ({
              "time_slot": response[key].aggregate.count,
            }));
          }
            
        
        })
        let Toolcount = []
        await configParam.RUN_GQL_API(gqlQueries.toolAlertCount, {entity_type :"tool", line_id :line_id, instrument_category: instrument_category}) 
        .then((response) => { 
          if(response !== undefined && response !== null && response.neo_skeleton_alerts_v2_aggregate){
            Toolcount = Object.keys(response).map((key) => ({
              "tool": response[key].aggregate.count,
            }));
          }
            
        
        })
        await configParam.RUN_GQL_API(gqlQueries.alertCount, {line_id :line_id, instrument_category: instrument_category }) 
          .then((response) => { 
            if(response !== undefined && response.neo_skeleton_alerts_v2_aggregate && response.neo_skeleton_connectivity_aggregate){
                let obj  =Object.keys(response).map((key) => ({
                    [key]: response[key].aggregate.count,
                  }));
                
                let combinedCount =[...Toolcount,...count,...obj];
                console.log("combinedCount",combinedCount)
                  setData(combinedCount)
                  setError(false)
                  setLoading(false)

            }else{
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
    return {   AlertCountLoading,  AlertCountData , AlertCountError,getAlertCount };
};

export default  useGetAlertCount;