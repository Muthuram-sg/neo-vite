import { useState } from "react";
import configParam from "config";
import moment from 'moment';

const usePartSignalCount = () => {
  const [PartSignalCountLoading, setLoading] = useState(false);//NOSONAR
  const [PartSignalCountData, setData] = useState(null);//NOSONAR
  const [PartSignalCountError, setError] = useState(null);//NOSONAR

  const getPartSignalCount = async (DressArr, Oeecon,headPlant) => { 
    setLoading(true);
    Promise.all(
        DressArr.map(async (val, i) => { 
        
        let DressData = []
        if((DressArr.length-1) !== i){  
            const body = {
                schema: headPlant.schema,
                instrument_id: Oeecon.part_signal_instrument,
                metric_name: "part_count",
                start_date: moment(val.time).format('YYYY-MM-DDTHH:mm:ssZ'),
                end_date: moment(DressArr[i+1].time).format('YYYY-MM-DDTHH:mm:ssZ'),
                binary: Oeecon.is_part_count_binary,
                downfall: Oeecon.is_part_count_downfall 
            }
            const url = "/dashboards/actualPartSignalCount";  
            await configParam.RUN_REST_API(url, body)
            .then((res) => {  
                    if(res.data.length > 0 && res.data[0].count !== '0'){
                        DressData.push({time:  moment(val.time).format('YYYY-MM-DDTHH:mm'), count: res.data[0].count})
                    } 
                  
            }) 
        }
        return DressData
    }))
    .then((data) => {
        
        let result2 = [];
        data.forEach(x => result2 = [...result2, ...x]);
        setLoading(false);
        setError(false);
        setData(result2); 
        // console.log(result2,"result2")
        
    })  
    .catch((e) => {
        setLoading(false);
        setError(true);
        setData(null);
    });
  };
 

  return { PartSignalCountLoading, PartSignalCountData, PartSignalCountError, getPartSignalCount };
};

export default usePartSignalCount;