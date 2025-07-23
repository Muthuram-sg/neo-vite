import { useState } from "react";
import configParam from "config";
const useGetAvailability = () => {
  const [availabilityLoading, setLoading] = useState(false);
  const [availabilityData, setData] = useState(null);
  const [availabilityError, setError] = useState(null);
  const getAvailability = async (schema, data, start_date, end_date,pageindex,pagesize,energyIntru) => { 
    setLoading(true);
    // console.log(data,"data")
    Promise.all(data.map(async (val) => {
      let maxmic = val.mic_stop_duration ? val.mic_stop_duration : 0
      const body = {
        schema: schema,
        instrument_id: val.instrumentByMachineStatusSignalInstrument.id,
        metric_name: val.is_status_signal_available === true ? 'execution' : val.metricByMachineStatusSignal.name,
        start_date: start_date,
        end_date: end_date,
        mic_stop: maxmic,
        active_signal: val.is_status_signal_available,
        downfall: val.is_part_count_downfall,
        pageindex : pageindex,
        pagesize: pagesize,
        energyInstrument : energyIntru ? energyIntru : ''
      }
      
      const url = "/dashboards/getAssetUtilization";
      return configParam.RUN_REST_API(url, body)
        .then(async (response) => { 
          if (response && !response.errorTitle) {
            if (response.data.length > 0) { 
              
              let final_outages = response.data;
          
              let final_result = [];
              if (final_outages.length > 0) { 
                const unique = final_outages.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v) === JSON.stringify(v2))) === i); //remove duplicate
                const result1 = unique.filter(x => Object.keys(x).length > 0) //remove empty object
                const result = result1.filter(y => y.time !== y.next) //remove if start and end is same
                result.sort((a, b) => new Date(b.time) - new Date(a.time)) // sorting based on time in descending
                final_result = result; 
              } 
              return { raw: final_result ,Count: 0  }
            } else {
              setLoading(false)
              return { raw: [], data: response.data, Count: 0 }
            }
          } else {
            setLoading(false)
            return { raw: [], data: response, Count: 0 }
          }
        })
        .catch((e) => {
          return e;
        });
    }))
      .then(Finaldata => {
        setData(Finaldata);
        setError(false)
        setLoading(false)
      })
      .catch((e) => {
        setData(e);
        setError(true)
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      });
  };
  return { availabilityLoading, availabilityData, availabilityError, getAvailability };
};

export default useGetAvailability;