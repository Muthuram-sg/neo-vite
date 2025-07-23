import { useState } from "react";
import configParam from "config";
import moment from 'moment';
const useGetDefectsData = () => {
    const [allDefectsDataLoading, setallDefectsDataLoading] = useState(false);
    const [allDefectsData,setData ] = useState(null);
    const [allDefectsDataerror,setError ] = useState(null);
    
    const getfetchDefectData = (queryData,play,overallData) => {
      
   let body=queryData
   if(play){
    body={...body, 
     from: moment(body.to).subtract(10, 'seconds').format('YYYY-MM-DDTHH:mm:ss'),
      // to:  moment().format('YYYY-MM-DDTHH:mm:ss')
    }
   }
   
      setallDefectsDataLoading(true);
        
          configParam.RUN_REST_API('/dashboards/getDefectsData', body)
          .then(result => {
            
            if(play ){
             
              setData([...overallData,...result.data]);
            }
          else{
            console.log("resultttt",result)
            setData(result.data)
          }
            setError(false)
            setallDefectsDataLoading(false)
          })
          .catch((err) => {
            console.log('error');
            setallDefectsDataLoading(false);
            setError(err);
            setData(null);
          })
    
    
      }
    return {allDefectsDataLoading, allDefectsData, allDefectsDataerror, getfetchDefectData };
}

export default useGetDefectsData;
