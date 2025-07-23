import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateToolRule = () => {
    const [UpdateToolRuleLoading, setLoading] = useState(false); 
    const [UpdateToolRuleError, setError] = useState(null); 
    const [UpdateToolRuleData, setData] = useState(null); 

    const getUpdateToolRule = async (id,time) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateAlarmConfig,{ alert_id:id,check_aggregate_window_time_range:time,last_state:null,current_state:null})
        
            .then((returnData) => {
                if (returnData.update_neo_skeleton_alerts_v2) {
                    // console.log("returnData.update_neo_skeleton_alerts_v2",returnData.update_neo_skeleton_alerts_v2)
                    setData(returnData.update_neo_skeleton_alerts_v2)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "ToolLife Rule Update", new Date())
            });

    };
    return {  UpdateToolRuleLoading, UpdateToolRuleData, UpdateToolRuleError, getUpdateToolRule };
};

export default useUpdateToolRule;