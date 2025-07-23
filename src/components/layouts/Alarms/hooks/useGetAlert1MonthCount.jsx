import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetAlert1MonthCount= () => {
    const [ AlertsCountLoading , setLoading] = useState(false);
    const [ AlertsCountData, setData] = useState(null);
    const [ AlertsCountError , setError] = useState(null);

    const getAlertsCount = async (line_id, instrument_category, dates) => {

      const startDateFromDates = new Date(dates.StartDate);
      const year = startDateFromDates.getFullYear();
      const month = startDateFromDates.getMonth(); 
      
      const startOfMonth = new Date(year, month, 1); 
      const endOfMonth = new Date(year, month + 1, 0); 
      
      const formatDate = (date, isEndOfDay = false) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const time = isEndOfDay ? "23:59:59" : "00:00:00";
        return `${year}-${month}-${day}T${time}Z`;
      };
      
      const startDate = formatDate(startOfMonth); 
      const endDate = formatDate(endOfMonth, true);   
      
        setLoading(true);
        let count = []
        await configParam.RUN_GQL_API(gqlQueries.timeSlot1AlertCount, {entity_type :"time_slot", line_id :line_id, instrument_category: instrument_category, start_date:startDate, end_date: endDate}) 
        .then((response) => { 
          if(response !== undefined && response !== null && response.neo_skeleton_alerts_v2_aggregate){
            count =Object.keys(response).map((key) => ({
              "time_slot": response[key].aggregate.count,
            }));
          }
            
        
        })
        let Toolcount = []
        await configParam.RUN_GQL_API(gqlQueries.toolAlert1Count, {entity_type :"tool", line_id :line_id, instrument_category: instrument_category, start_date:startDate, end_date: endDate}) 
        .then((response) => { 
          if(response !== undefined && response !== null && response.neo_skeleton_alerts_v2_aggregate){
            Toolcount = Object.keys(response).map((key) => ({
              "tool": response[key].aggregate.count,
            }));
          }
            
        
        })
        await configParam.RUN_GQL_API(gqlQueries.alert1Count, {line_id :line_id, instrument_category: instrument_category, start_date:startDate, end_date: endDate }) 
          .then((response) => { 
            if(response !== undefined && response.neo_skeleton_alerts_v2_aggregate && response.neo_skeleton_connectivity_aggregate){
                let obj  =Object.keys(response).map((key) => ({
                    [key]: response[key].aggregate.count,
                  }));
                
                let combinedCount =[...Toolcount,...count,...obj];
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
    return {   AlertsCountLoading,  AlertsCountData , AlertsCountError,getAlertsCount };
};

export default  useGetAlert1MonthCount;