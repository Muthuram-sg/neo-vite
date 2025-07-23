import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetAlarmSMSUser= () => {
    const [ AlarmSMSUserLoading , setLoading] = useState(false);
    const [ AlarmSMSUserData, setData] = useState(null);
    const [ AlarmSMSUserError , setError] = useState(null);

    const getAlarmSMSUser = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.smsAlertUsers, {}) 
          .then((response) => {
            
            if (response && response.neo_skeleton_alarm_sms_access.length > 0) {
         
                setData(response.neo_skeleton_alarm_sms_access)
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
    return {   AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError,getAlarmSMSUser };
};

export default  useGetAlarmSMSUser;