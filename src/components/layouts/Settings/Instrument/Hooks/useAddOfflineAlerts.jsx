
import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const UseAddOfflineAlerts = () => {
    const [addOflineLoading, setLoading] = useState(false); 
    const [AddOfflineError, setError] = useState(null); 
    const [AddOfflineData, setData] = useState(null); 

    const getAddOfflineAlerts = async (InstrumentID,frequency_seconds,escalation_times,escalation_users,last_check_time,created_by,line_id,frequency_count) => {
        setLoading(true);
      
        await configParam.RUN_GQL_API(mutation.AddOfflineAlerts,{iid: InstrumentID, frequency_seconds:frequency_seconds,escalation_times:escalation_times,escalation_users:escalation_users,last_check_time:last_check_time, created_by: created_by,line_id: line_id, frequency_count:frequency_count})
            .then((returnData) => {
                if (returnData!== undefined && returnData.insert_neo_skeleton_alerts_offline) {
                   
                    setData(returnData.insert_neo_skeleton_alerts_offline)
                    setError(false)
                    setLoading(false)
                }
                else{
                    console.error("Unexpected Response Structure:", returnData);
                setData([])
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData([]);
                console.log("NEW MODEL", "ERR", e, "Notification Setting", new Date())
            });

    };
    return {  addOflineLoading, AddOfflineData, AddOfflineError, getAddOfflineAlerts };
};

export default UseAddOfflineAlerts;
