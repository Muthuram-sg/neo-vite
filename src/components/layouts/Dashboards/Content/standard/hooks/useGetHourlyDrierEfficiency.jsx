import { useState } from "react";
import configParam from "config"; 

const useGetHourlyDrierEfficiency= () => {
  const [HourlyEfficiencyLoading, setLoading] = useState(false);
  const [HourlyEfficiencyData, setData] = useState(null);
  const [HourlyEfficiencyError, setError] = useState(null);

  const getHourlyEfficiency = async (schema, start_date, end_date,entity_id,dryer,islongRange) => {
    setLoading(true);
    const body = {
      schema: schema,
      from: start_date, 
      to: end_date,
      feed_iid: dryer.total_sand_fed_instrument?dryer.total_sand_fed_instrument:"",
      feed_key: dryer.MetricBySandFeed?dryer.MetricBySandFeed.name:"",
      dried_iid: dryer.total_sand_dried_instrument?dryer.total_sand_dried_instrument:"",
      dried_key: dryer.MetricBySandDried?dryer.MetricBySandDried.name:"",
      scrap_iid: dryer.total_scrap_instrument?dryer.total_scrap_instrument:"",
      scrap_key: dryer.MetricBySandScrap?dryer.MetricBySandScrap.name:"",
      moistin_iid: dryer.moisture_input_instrument,
      moistin_key: dryer.MetricByMoistureIn?dryer.MetricByMoistureIn.name:"",
      moistout_iid: dryer.moisture_output_instrument,
      moistout_key: dryer.MetricByMoistureOut?dryer.MetricByMoistureOut.name:"",
      gas_iid: dryer.gas_energy_consumption_instrument,
      gas_key: dryer.MetricByGasEnergy?dryer.MetricByGasEnergy.name:"",
      elect_iid: dryer.electrical_energy_consumption_instrument,
      elect_key: dryer.MetricByElectricalEnergy?dryer.MetricByElectricalEnergy.name:"",
      execution_iid: dryer.total_startup_time_instrument,
      execution_key: dryer.MetricByExecution?dryer.MetricByExecution.name:"",
      entity_id: entity_id,
      is_dryer_per_day : islongRange ? 1 : 0

    }
    const url = "/dashboards/getdryerhourlydata";
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
  return { HourlyEfficiencyLoading, HourlyEfficiencyData, HourlyEfficiencyError, getHourlyEfficiency };
};

export default useGetHourlyDrierEfficiency;