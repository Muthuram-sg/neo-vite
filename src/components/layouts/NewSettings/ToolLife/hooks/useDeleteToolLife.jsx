// NOSONAR  -  working fine
import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteToolLife = () => {
    const [DeleteToolLifeLoading, setLoading] = useState(false); //NOSONAR
    const [DeleteToolLifeError, setError] = useState(null); //NOSONAR
    const [DeleteToolLifeData, setData] = useState(null); //NOSONAR

    const getDeleteToolLife = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.DeleteTool,{ id:id})
        
            .then((returnData) => {
                if (returnData.delete_neo_skeleton_tool_life) {
                    // console.log("returnData.delete_neo_skeleton_tool_life",returnData.delete_neo_skeleton_tool_life)
                    setData(returnData.delete_neo_skeleton_tool_life)
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
    return {  DeleteToolLifeLoading, DeleteToolLifeData, DeleteToolLifeError, getDeleteToolLife };
};

export default useDeleteToolLife;