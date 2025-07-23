import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useCreateUserRole = () => {
    const [CreateUserRoleLoading, setLoading] = useState(false); 
    const [CreateUserRoleError, setError] = useState(null); 
    const [CreateUserRoleData, setData] = useState(null); 

    const getCreateUserRole = async (user_id,line_id,role_id,created_by) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.CreateUserRoleLineAccess,{user_id: user_id, line_id: line_id, role_id: role_id, created_by: created_by})
        
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_user_role_line_one) {
                    setData(returnData.insert_neo_skeleton_user_role_line_one)
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
    return {  CreateUserRoleLoading, CreateUserRoleData, CreateUserRoleError, getCreateUserRole };
};

export default useCreateUserRole;