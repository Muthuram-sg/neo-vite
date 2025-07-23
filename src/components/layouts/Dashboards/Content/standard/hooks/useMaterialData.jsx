import { useState } from "react";
import configParam from "config"; 

const useMaterialData = () => {
  const [MaterialLoading, setLoading] = useState(false);
  const [MaterialData, setData] = useState(null);
  const [MaterialError, setError] = useState(null);

  const getMaterial = async (schema, feedObj, dried_id,dried_key,scrap_id,scrap_key,date) => {
    setLoading(true);
    const body = {
      schema: schema,
      feed_iid: feedObj.feed_id,
      feed_key: feedObj.feed_key,
      dried_iid: dried_id,
      dried_key: dried_key,
      scrap_iid: scrap_id,
      scrap_key: scrap_key,
      from: date.start, 
      to: date.end
    }
    const url = "/dashboards/getdryermaterialdata";
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
  return { MaterialLoading, MaterialData, MaterialError, getMaterial };
};

export default useMaterialData;