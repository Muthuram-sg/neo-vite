import { useState } from "react";
import configParam from "config";  
import mutations from "components/layouts/Mutations";
const useUpdateAlarm= () => {
    const [ UpdateAlarmLoading , setLoading] = useState(false);
    const [ UpdateAlarmData, setData] = useState(null);
    const [ UpdateAlarmError , setError] = useState(null);

    const getUpdateAlarm = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutations.updateAlarmNameAndDelivery,body) 
          .then((returnData) => {
            if ( returnData !== undefined && returnData.update_neo_skeleton_alerts_v2) {
                setData([returnData.update_neo_skeleton_alerts_v2.affected_rows])
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
    return { UpdateAlarmLoading,  UpdateAlarmData , UpdateAlarmError,getUpdateAlarm };
};

export default  useUpdateAlarm;