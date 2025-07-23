import { useState } from "react";
import configParam from "config"; 

const useSandFeedData = () => {
  const [SandFeedLoading, setLoading] = useState(false);
  const [SandFeedData, setData] = useState(null);
  const [SandFeedError, setError] = useState(null);

  const getSandFeed = async (schema, instrument_id, metric_name, start_date, end_date) => {
    setLoading(true);
    const body = {
      schema: schema,
      iid: instrument_id,
      key: metric_name,
      from: start_date, 
      to: end_date
    }
    const url = "/dashboards/getdryerdata";
    await configParam.RUN_REST_API(url, body)
      .then((response) => {
        if (response && !response.errorTitle) {
            console.log('sandfeed',response.data);
          setData(response.data);
          setError(false); 
        } else {
          setData(response);
          setError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
        setData(null);
      });
  }; 
  return { SandFeedLoading, SandFeedData, SandFeedError, getSandFeed };
};

export default useSandFeedData;