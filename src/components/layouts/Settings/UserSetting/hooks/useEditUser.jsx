import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useEditUser = () => {
    const [EditUserLoading, setLoading] = useState(false); 
    const [EditUserError, setError] = useState(null); 
    const [EditUserData, setData] = useState(null); 

    const getEditUser = async (user_id,Lineid,role_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.EditUserLineAccess,{user_id: user_id, line_id: Lineid, role_id: role_id})
        
            .then((returnData) => {
                
                if (returnData.update_neo_skeleton_user_role_line.affected_rows >= 1) {
                    setData(returnData.update_neo_skeleton_user_role_line.affected_rows)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData([])
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData([]);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            });

    };
    return {  EditUserLoading, EditUserData, EditUserError, getEditUser };
};

export default useEditUser;