import { useState } from "react";
import configParam from "config"; 
import moment from 'moment';

const useActualPartCountShift = () => {
  const [ActualPartCountShiftLoading, setLoading] = useState(false);
  const [ActualPartCountShiftData, setData] = useState(null);
  const [ActualPartCountShiftError, setError] = useState(null);
  const getActualPartCountShift = async (schema, data, val2, process,binary,downfall,downprocess) => {
    setLoading(true);
    Promise.all(data.map(async (val) => {
        let intrID = process.filter(x => ((moment(x.time).isBetween(val.start, val.end)) && (x.asset === val2)))
        let metName = process.filter(x => ((moment(x.time).isBetween(val.start, val.end)) && (x.asset === val2)))
      const body = {
        schema: schema,
        instrument_id: intrID.length > 0 ? intrID[0].instrument_id : "0",
        metric_name: metName.length > 0 ? metName[0].metric_name : "part_count",
        start_date: moment(val.start).format("YYYY-MM-DDTHH:mm:ss"),
        end_date: moment(val.end).format("YYYY-MM-DDTHH:mm:ss"),
        binary: binary,
        downfall: downfall 
      }
      const url = "/dashboards/actualPartSignalCount";
      var TrendshiftTable = []
      return configParam.RUN_REST_API(url, body)
        .then((res) => {
            let down = downprocess.filter(x => ((moment(x.time).isBetween(val.start, val.end)) && (x.asset === val2))).reduce((total, thing) => total + thing.totalMins, 0)
            let avail = process.filter(x => ((moment(x.time).isBetween(val.start, val.end)) && (x.asset === val2))).reduce((total, thing) => total + thing.totalMins, 0)
            let offmin = 480 - (avail + down)
            let avPerc = (avail / 480) * 100;
            let powerval = avail + down
            if (res && !res.errorTitle && res.data.length > 0) {  
                TrendshiftTable.push({
                    asset: val2,
                    date: val.start.split('T')[0],
                    shiftname: val.name,
                    start_date: moment(val.start).format("YYYY-MM-DDTHH:mm:ss"),
                    end_date: moment(val.end).format("YYYY-MM-DDTHH:mm:ss"),
                    totalMins: avPerc.toFixed(2),
                    downtime: down,
                    partcount: Number(res.data[0].count),
                    runtime: avail,
                    offtime: offmin,
                    powertime: powerval

                }) 
            } else { 
                TrendshiftTable.push({
                    asset: val2,
                    date: val.start.split('T')[0],
                    shiftname: val.name,
                    start_date: moment(val.start).format("YYYY-MM-DDTHH:mm:ss"),
                    end_date: moment(val.end).format("YYYY-MM-DDTHH:mm:ss"),
                    totalMins: avPerc.toFixed(2),
                    downtime: down,
                    partcount: 0,
                    runtime: avail,
                    offtime: offmin,
                    powertime: powerval
                })
            }
            
            return TrendshiftTable
            
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
  return { ActualPartCountShiftLoading, ActualPartCountShiftData, ActualPartCountShiftError, getActualPartCountShift };
};

export default useActualPartCountShift;