import { useState } from "react";
import configParam from "config";
import moment from 'moment';

const usePartsSummary = () => {
  const [partSumLoading, setLoading] = useState(false);//NOSONAR
  const [partSumData, setData] = useState(null);//NOSONAR
  const [partSumError, setError] = useState(null);//NOSONAR


  const getPartsPerHour = async (entity,date, binary, downfall, dressProg,islongrange, dressMetric,isRepeat,previousData,DateArr) => {//NOSONAR
    // Need to optimize param in sonar
    setLoading(true);
    let startDate
    let EndDate 
    if(isRepeat){   
      startDate = moment(moment().subtract(10, 'seconds')).format('YYYY-MM-DDTHH:mm:ssZ')
      EndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    }else{
      startDate = date.start
      EndDate = date.end;
    }
    function FormatData (data){
      return DateArr.map(f=>{
        let FilterPart = data.filter(d=> moment(d.hour).format('YYYY-MM-DDTHH:mm:ss') === moment(f).format('YYYY-MM-DDTHH:mm:ss'))//NOSONAR
        // console.log(FilterPart,"HourHour",f)
        if(FilterPart.length>0){
          return {"hour": FilterPart[0].hour,"partsperhour": FilterPart[0].partsperhour,"dressingCount": FilterPart[0].dressingCount}
        }else{
          return {"hour": f,"partsperhour": 0,"dressingCount": 0}
        }
      }) 
    }
     console.log(DateArr,"DateArrDateArr",entity)
    const body = {
      schema: entity.schema,
      instrument_id: entity.instrument,
      metric_name: entity.metric,
      start_date:startDate,
      dress_metric: dressMetric,
      dress_prog: dressProg,
      end_date: EndDate,
      binary: binary,
      downfall: downfall,
      parts_per_day:islongrange ? 1 : 0
    }
    const url = "/dashboards/actualPartSignalPerHour";
    await configParam.RUN_REST_API(url, body)
      .then((response) => {
        if (response && !response.errorTitle) { 
          let resData = response.data ? response.data : []
          
          var parts =resData;
          if(isRepeat){
            parts = previousData.map(v=>{
              let partCnt = v.partsperhour
              if((resData.length>0) && v.hour === resData[0].hour){
                partCnt = Number(v.partsperhour+resData[0].partsperhour)
                // console.log(partCnt,"partCnt")
              }
              
              return {...v,partsperhour:partCnt}
            })

          }
          let FinalArr = FormatData(parts) 
          // console.log(previousData,"previousData",parts,isRepeat,FinalArr)
          setData(FinalArr);
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

  return { partSumLoading, partSumData, partSumError, getPartsPerHour };
};

export default usePartsSummary;