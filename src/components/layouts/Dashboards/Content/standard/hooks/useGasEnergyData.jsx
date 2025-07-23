import { useState } from "react";
import configParam from "config"; 

const useGasEnergyData = () => {
  const [GasEnergyLoading, setLoading] = useState(false);
  const [GasEnergyData, setData] = useState(null);
  const [GasEnergyError, setError] = useState(null);

  const getGasEnergy = async (schema, instrument_id, metric_name, start_date, end_date) => {
    setLoading(true);
    const body = {
      schema: schema, 
      iid: instrument_id,
      key: metric_name,
      from: start_date, 
      to: end_date, 
    }
    const url = "/dashboards/getdryerenergydata";
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
  return { GasEnergyLoading, GasEnergyData, GasEnergyError, getGasEnergy };
};

export default useGasEnergyData;