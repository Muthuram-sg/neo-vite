import { useState } from "react";
import configParam from "config"; 
import moment from 'moment';

const useAvailabilityMachineStatus = () => {
  const [AvailabilityMachineStatusLoading, setLoading] = useState(false);
  const [AvailabilityMachineStatusData, setData] = useState(null);
  const [AvailabilityMachineStatusError, setError] = useState(null);
  const getAvailabilityMachineStatus = async (schema, data, start_date, end_date,StopDuration) => {
    setLoading(true);
    Promise.all(data.map(async (val) => {
      const body = {
        schema: schema,
        instrument_id: val.instrumentByMachineStatusSignalInstrument.id,
        metric_name: val.metricByMachineStatusSignal.name,
        start_date: start_date,
        end_date: end_date,
        mic_stop: StopDuration ? val.mic_stop_duration : 0, 
        active_signal: val.is_status_signal_available,
        downfall: val.is_part_count_downfall
      }
      const url = "/dashboards/machinestatussignal";
      let temp1 = [];
      return configParam.RUN_REST_API(url, body)
        .then(async (response) => {
            if (response && response.data && response.data.length > 0) {
                temp1 = [...response.data]
                // eslint-disable-next-line array-callback-return
                temp1.forEach((tempval, tempind) => {
                    let datearray = [];
                    datearray.push(new Date(tempval.next));
                    datearray.push(new Date());
                    tempval.entity_id = val.entity_id;
                    tempval.instrument_id = val.instrument.id;
                    tempval.metric_name = val.metric.name;
                    tempval.start_date = tempval.time;
                    tempval.end_date = tempval.next;
                    tempval.reason = 0
                    tempval.comments = '';
                    tempval.prod_outage_id = 0;
                    tempval.order_id = 0;
                    // eslint-disable-next-line array-callback-return
                    val.entity.prod_outages.forEach(x => {
                        let startCheck = moment(x.start_dt).isBetween(moment(tempval.time), moment(Math.min.apply(null, datearray)))
                        if (startCheck || new Date(x.start_dt).toISOString() === new Date(tempval.time).toISOString()) {
                           
                            tempval.reason = x.prod_reason.id
                            tempval.comments = x.comments
                            tempval.prod_outage_id = x.id;
                        }
                        tempval.order_id = x.order_id;
                    })
                })
            } 

            return { data: temp1, binary: val.is_part_count_binary,downfall:val.is_part_count_downfall,
                status: val.is_status_signal_available,
                start_date: start_date,
                end_date: end_date
            }
        })
        .catch((e) => {
          return e;
        });
    }))
      .then(data1 => {
        setData(data1);
        setError(false)
      })
      .catch((e) => {
        setData(e);
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      });
  };
  return { AvailabilityMachineStatusLoading, AvailabilityMachineStatusData, AvailabilityMachineStatusError, getAvailabilityMachineStatus };
};

export default useAvailabilityMachineStatus;