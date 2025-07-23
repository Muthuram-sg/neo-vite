import { useState } from "react";
import configParam from "config";  
import mutations from "components/layouts/Mutations";
const useCreateAlarm= () => {
    const [ CreateAlarmLoading , setLoading] = useState(false);
    const [ CreateAlarmData, setData] = useState(null);
    const [ CreateAlarmError , setError] = useState(null);

    const getCreateAlarm = async (body) => {
        console.log("body",body)
        setLoading(true);
        await configParam.RUN_GQL_API(mutations.createAlarmNameAndDelivery,body) 
          .then((returnData) => {
          
            if ( returnData !== undefined && returnData.insert_neo_skeleton_alerts_v2.affected_rows > 0) {
                setData(returnData.insert_neo_skeleton_alerts_v2.affected_rows)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return { CreateAlarmLoading,  CreateAlarmData , CreateAlarmError,getCreateAlarm };
};

export default  useCreateAlarm;