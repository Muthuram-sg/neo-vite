import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";
// NOSONAR  -  working fine
const useUpdateTool = () => {
    const [UpdateToolLoading, setLoading] = useState(false); //NOSONAR
    const [UpdateToolError, setError] = useState(null); //NOSONAR
    const [UpdateToolData, setData] = useState(null); //NOSONAR

    const getUpdateTool = async (id,name,asset_types,intruments,limit,updated_by,reset_ts,limit_ts) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.UpdateTool,{ id:id,name:name, intruments:intruments,asset_types:asset_types, limit: limit, updated_by: updated_by,reset_ts: reset_ts, limit_ts:limit_ts })
        
            .then((returnData) => {
                if (returnData.update_neo_skeleton_tool_life) {
                    // console.log("returnData.update_neo_skeleton_tool_life",returnData.update_neo_skeleton_tool_life)
                    setData(returnData.update_neo_skeleton_tool_life)
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
                console.log("NEW MODEL", "ERR", e, "ToolLife Setting", new Date())
            });

    };
    return {  UpdateToolLoading, UpdateToolData, UpdateToolError, getUpdateTool };
};

export default useUpdateTool;