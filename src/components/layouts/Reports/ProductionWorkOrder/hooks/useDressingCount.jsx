import { useState } from "react";
import configParam from "config"; 

const useDressingCount = () => {
  const [dressingCountLoading, setLoading] = useState(false);
  const [dressingCountData, setData] = useState(null);
  const [dressingCountError, setError] = useState(null);

  const getDressingCount = async (schema,data,from,to,instrument) => {
    Promise.all(data.map(async (val) => {
      setLoading(true);
      if(val.dressing_signal && val.dressing_program){
        const body = {
            schema: schema,
            metric: val.metricByDressingSignal.name,
            program: val.dressing_program,
            from: from,
            to: to,
            instrument: val.part_signal_instrument
          };
          const url = "/iiot/getDressingCount";
            return configParam
            .RUN_REST_API(url, body)
            .then((response) => {
              if (response && !response.errorTitle) {
                if (response.data.count) {
                  return response.data;
                } else {
                  return {count:0,data: []};
                }
              } else {
                return {count:0,data: []};
              }
            })
            .catch((e) => {
                console.log('production report','dressingcount','err',e)
              return {count:0,data: []};
            });
      }else{
        return {count: 0,data: []}
      }
      
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
  return { dressingCountLoading, dressingCountData, dressingCountError, getDressingCount };
}; 
export default useDressingCount;