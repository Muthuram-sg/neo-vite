import { useState } from "react";
import configParam from "config";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import moment from "moment";
import { useRecoilState } from "recoil";
import {instrumentsArry,currentDashboard} from "recoilStore/atoms";

const useFetchMultiMetricDashboardData = () => {
    const [fetchMultiMetricDashboardLoading, setLoading] = useState(false); 
    const [fetchMultiMetricDashboardError, setError] = useState(null); 
    const [fetchMultiMetricDashboardData, setData] = useState(null); 
    const [instrumentList] = useRecoilState(instrumentsArry);
    const [selectedDashboard] = useRecoilState(currentDashboard);

    const getfetchMultiMetricDashboard = async (url, body,metricField) => {
        setLoading(true); 
        let start = body.from;
        let end = body.to

        body['from'] = start;
        body['to']= end;
            if((body.type === 'Table' || body.type === 'pie') && Object.keys(metricField).length>0){
             
              
                  metricField = Object.keys(metricField)
                        .filter(key => metricField[key].hasOwnProperty('instrument'))
                        .reduce((obj, key) => {
                            obj[key] = metricField[key];
                            return obj;
                        }, {});

                    // console.log(metricField,"hook Table Data")
                
             
          let metricInstruments = {};
          Object.keys(metricField).forEach(field => {
              let MetList = metricField[field] && metricField[field].metric && metricField[field].metric.map(x => x.split('-')[0]);
              let metricKey = MetList.toString();  
              if (!metricInstruments[metricKey]) {
                  metricInstruments[metricKey] = [];
              }
              metricInstruments[metricKey].push(metricField[field].instrument);
          });


        //   console.clear()
          Promise.all(Object.keys(metricInstruments).map(field => {
          
              let instruments = metricInstruments[field].join(','); // Get instruments in comma-separated format            
              let metric;
              if (body.isConsumption) {
                  metric = field.filter(f => f !== 'kwh').toString();
              } else {
                  metric = field.toString();
              }
          
              let params = {
                  schema: body.schema,
                  instrument_id: instruments || null,
                  metrics: metric || null,
                  from: start,
                  to: end,
              };
          


             
          
              return configParam.RUN_REST_API('/dashboards/getDashboardTopAlarmData', params, '', '','POST')
                  .then((response) => {
                      if (response && !response.errorTitle) {
                        console.log(response)
                        return response.data
                      } else {
                        return []
                      }
                  })
                  .catch((e) => {
                      console.log("NEW MODEL", "ERR", e, "Reports", new Date());
                    //   return play ? exist : [];
                    return []
                  });
          }))
          
.then(data => {
  console.log(data,'data')
  

// console.log(merged, "merged");
    setLoading(false);
    setError(false);
    setData(data);
});

            }
        
    };
    return {  fetchMultiMetricDashboardLoading, fetchMultiMetricDashboardData, fetchMultiMetricDashboardError, getfetchMultiMetricDashboard };
};

export default useFetchMultiMetricDashboardData;