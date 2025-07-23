import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useToolAlarmRules = () => {
    const [ToolAlarmRulesLoading, setLoading] = useState(false); 
    const [ToolAlarmRulesError, setError] = useState(null); 
    const [ToolAlarmRulesData, setData] = useState(null); 

    const getToolAlarmRules = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.toolAlertRules,{ entity_type:"tool",line_id:line_id})
        
            .then((returnData) => {
                if (returnData.neo_skeleton_alerts_v2) {
                    setData(returnData.neo_skeleton_alerts_v2)
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
                console.log("NEW MODEL", "ERR", e, "ToolLife Rules List", new Date())
            });

    };
    return {  ToolAlarmRulesLoading, ToolAlarmRulesData, ToolAlarmRulesError, getToolAlarmRules };
};

export default useToolAlarmRules;