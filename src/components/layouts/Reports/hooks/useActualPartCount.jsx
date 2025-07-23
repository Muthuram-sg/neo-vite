import { useState } from "react";
import configParam from "config"; 
import moment from 'moment';

const useActualPartCount = () => {
  const [ActualPartCountLoading, setLoading] = useState(false);
  const [ActualPartCountData, setData] = useState(null);
  const [ActualPartCountError, setError] = useState(null);
  const getActualPartCount = async (schema, data, val2, process,binary,downfall,downprocess) => {
    setLoading(true);
    Promise.all(data.map(async (val) => {
        let filteredProcess = process.filter(x => ((x.time.split('T')[0] === val) && (x.asset === val2)));
      const body = {
        schema: schema,
        instrument_id: filteredProcess.length > 0 ? filteredProcess[0].instrument_id : 0,
        metric_name: "part_count",
        start_date: moment(val).startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
        end_date: moment(val).endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
        binary: binary,
        downfall: downfall 
      }
      const url = "/dashboards/actualPartSignalCount";
      var TrendTable = []
      return configParam.RUN_REST_API(url, body)
        .then((res) => {
            let down = downprocess.filter(x => ((x.time.split('T')[0] === val) && (x.asset === val2))).reduce((total, thing) => total + thing.totalMins, 0)
            let avail = filteredProcess.reduce((total, thing) => total + thing.totalMins, 0) 
            let offmin = 1440 - (avail + down) 
            let avPerc = (avail / 1440) * 100;
            let powerval = avail + down
            if (res && !res.errorTitle && res.data.length > 0) {  
                TrendTable.push({
                    asset: val2,
                    date: val,
                    start_date: moment(val).startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                    end_date: moment(val).endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                    totalMins: avPerc.toFixed(2),
                    downtime: down,
                    intrumentid: filteredProcess.length > 0 ? filteredProcess[0].instrument_id : 0,
                    metric: filteredProcess.length > 0 ? filteredProcess[0].metric_name : '',
                    partcount: Number(res.data[0].count),
                    runtime: avail,
                    offtime: offmin,
                    powertime: powerval

                }) 
            } else { 
                TrendTable.push({
                    asset: val2,
                    date: val,
                    start_date: moment(val).startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                    end_date: moment(val).endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                    totalMins: filteredProcess.reduce((total, thing) => total + thing.totalMins, 0),
                    downtime: downprocess.filter(x => ((x.time.split('T')[0] === val) && (x.asset === val2))).reduce((total, thing) => total + thing.totalMins, 0),
                    intrumentid: filteredProcess.length > 0 ? filteredProcess[0].instrument_id : 0,
                    metric: filteredProcess.length > 0 ? filteredProcess[0].metric_name : '',
                    partcount: 0,
                    runtime: filteredProcess.reduce((total, thing) => total + thing.totalMins, 0),
                    offtime: offmin,
                    powertime: powerval  
                })
            }
            
            return { data: TrendTable}
            
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
  return { ActualPartCountLoading, ActualPartCountData, ActualPartCountError, getActualPartCount };
};

export default useActualPartCount;