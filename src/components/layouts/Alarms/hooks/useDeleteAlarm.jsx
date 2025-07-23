import { useState } from "react";
import configParam from "config";  
import mutations from "components/layouts/Mutations";
const useDeleteAlarm= () => {
    const [ DeleteAlarmLoading , setLoading] = useState(false);
    const [ DeleteAlarmData, setData] = useState(null);
    const [ DeleteAlarmError , setError] = useState(null);

    const getDeleteAlarm = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutations.deleteAlarmRule,{id:id}) 
          .then((returnData) => {
            if ( returnData !== undefined && returnData.delete_neo_skeleton_alerts_v2) {
                setData([returnData.delete_neo_skeleton_alerts_v2])
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
    return { DeleteAlarmLoading,  DeleteAlarmData , DeleteAlarmError,getDeleteAlarm };
};

export default  useDeleteAlarm;