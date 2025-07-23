import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useEditProductExec = () => {
    const [EditProductExecLoading, setLoading] = useState(false); 
    const [EditProductExecError, setError] = useState(null); 
    const [EditProductExecData, setData] = useState(null); 

    const getEditProductExec = async (id,info) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.UpdateProductExec,{ id:id,info:info })
        
            .then((returnData) => {
                if (returnData.update_neo_skeleton_prod_exec) {
                    console.log("returnData.update_neo_skeleton_prod_exec",returnData.update_neo_skeleton_prod_exec)
                    setData(returnData.update_neo_skeleton_prod_exec.affected_rows)
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  EditProductExecLoading, EditProductExecData, EditProductExecError, getEditProductExec };
};

export default useEditProductExec;