import { useState } from "react";
import configParam from "config";

const usePartsPerDressingCount = () => {
  const [partsPerDressingCountLoading, setLoading] = useState(false);
  const [partsPerDressingCountData, setData] = useState(null);
  const [partsPerDressingCountError, setError] = useState(null);

  const getPartsPerDressingCount = async (schema, instrumentObj,date, binary, downfall, dressProg, dressMetric) => {
    setLoading(true);
    const body = {
      schema: schema,
      instrument_id: instrumentObj.instrument,
      metric_name: instrumentObj.metric,
      start_date:date.start,
      dress_metric: dressMetric,
      dress_prog: dressProg,
      end_date: date.end,
      binary: binary,
      downfall: downfall
    }
    const url = "/dashboards/getpartsperdressing";
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

  return { partsPerDressingCountLoading, partsPerDressingCountData, partsPerDressingCountError, getPartsPerDressingCount };
};
export default usePartsPerDressingCount;