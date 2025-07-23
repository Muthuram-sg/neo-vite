import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddToolLife = () => {
    const [AddToolLifeLoading, setLoading] = useState(false); 
    const [AddToolLifeError, setError] = useState(null); 
    const [AddToolLifeData, setData] = useState(null); 

    const getAddToolLife = async (name,asset_types,intruments,limit,created_by,line_id,limit_ts) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.AddToolLife,{ name:name,asset_types:asset_types, intruments:intruments, limit:limit, created_by: created_by , line_id: line_id, limit_ts: limit_ts})
        
            .then((returnData) => {
                if (returnData.insert_neo_skeleton_tool_life) {
                    // console.log("returnData.insert_neo_skeleton_tool_life",returnData.insert_neo_skeleton_tool_life)
                    setData(returnData.insert_neo_skeleton_tool_life)
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
    return {  AddToolLifeLoading, AddToolLifeData, AddToolLifeError, getAddToolLife };
};

export default useAddToolLife;