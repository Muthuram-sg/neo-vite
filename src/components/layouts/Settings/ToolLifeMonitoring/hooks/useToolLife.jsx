import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useToolLife = () => {
    const [ToolLifeLoading, setLoading] = useState(false); 
    const [ToolLifeError, setError] = useState(null); 
    const [ToolLifeData, setData] = useState(null); 

    const getToolLife = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.ToolLife,{ line_id: line_id})
        
            .then((returnData) => {
                if (returnData.neo_skeleton_tool_life) {
                    // console.log("returnData.neo_skeleton_tool_life",returnData.neo_skeleton_tool_life)
                    setData(returnData.neo_skeleton_tool_life)
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
    return {  ToolLifeLoading, ToolLifeData, ToolLifeError, getToolLife };
};

export default useToolLife;