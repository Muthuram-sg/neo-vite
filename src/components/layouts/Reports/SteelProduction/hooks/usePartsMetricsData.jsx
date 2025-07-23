import { useState } from "react";
import configParam from "config";

const usePartsMetricsData = () => {
  const [partMetricsDataLoading, setLoading] = useState(false);
  const [partMetricsData, setData] = useState(null);
  const [partMetricsDataError, setError] = useState(null);

  const getPartMetricsData = async (schema,instrumentid,metricid, start_date, end_date) => { 
   
    setLoading(true);
      let start = start_date
      let end = end_date; 
      
        const body = {
          schema: schema,
          instrumentid:instrumentid,
          metricid: metricid,
          from: start,
          to: end,
          
        }
       
        const url = "/iiot/getRawData";
        return configParam.RUN_REST_API(url, body)
          .then(async (response) => {   
          
            setData(response)
            setError(false)
            setLoading(false)
            return response

          })
          .catch((e) => {
            console.log('err1',e);
            setData(e);
            setLoading(false);
            setError(true)
            return []
          });
     


    
    
  }; 
  return { partMetricsDataLoading, partMetricsData, partMetricsDataError, getPartMetricsData };
};



export default usePartsMetricsData;