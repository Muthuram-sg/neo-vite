import { useState } from "react";
import configParam from "config"; 

const useSandScrapData = () => {
  const [SandScrapLoading, setLoading] = useState(false);
  const [SandScrapData, setData] = useState(null);
  const [SandScrapError, setError] = useState(null);

  const getSandScrap = async (schema, instrument_id, metric_name, start_date, end_date) => {
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
  return { SandScrapLoading, SandScrapData, SandScrapError, getSandScrap };
};

export default useSandScrapData;