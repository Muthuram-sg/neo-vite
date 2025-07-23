import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useRemoveUser = () => {
    const [RemoveUserLoading, setLoading] = useState(false); 
    const [RemoveUserError, setError] = useState(null); 
    const [RemoveUserData, setData] = useState(null); 

    const getRemoveUser = async (user_id,line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.DeleteUserLineAccess,{user_id: user_id, line_id: line_id})
        
            .then((returnData) => {
              
                if (returnData.delete_neo_skeleton_user_role_line) {
                    setData(returnData.delete_neo_skeleton_user_role_line)
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
    return {  RemoveUserLoading, RemoveUserData, RemoveUserError, getRemoveUser };
};

export default useRemoveUser;