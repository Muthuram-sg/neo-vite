import { useState } from "react";
import configParam from "config"; 

const useAlertCounts = () => {
  const [alertCountLoading, setLoading] = useState(false);
  const [alertCountData, setData] = useState(null);
  const [alertCountError, setError] = useState(null);

  const getAlertCount = async (schema,lineID,start,end) => {
    setLoading(true);
    const body = {
      schema: schema, 
      line_id: lineID,
      start: start,
      end: end
    }
    const url = "/alerts/alertCount";
    await configParam.RUN_REST_API(url, body)
      .then((response) => {
        if (response && !response.errorTitle) {
          setData(response.data);
          if (response.data.length > 0) { 
            setError(false);
          } else {
            setError(true);
          }
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
 
  return { alertCountLoading, alertCountData, alertCountError, getAlertCount };
};

export default useAlertCounts;