import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useCreateUser = () => {
    const [CreateUserLoading, setLoading] = useState(false); 
    const [CreateUserError, setError] = useState(null); 
    const [CreateUserData, setData] = useState(null); 

    const getCreateUser = async (name,mobile,sgid,email,created_by,temp) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.CreateNewUser,{name: name, mobile: mobile, sgid: sgid, email: email, created_by: created_by, avatar: "https://www.saint-gobain.com/sites/saint-gobain.com/themes/custom/sg_radix/logo.svg",temp_password:temp})
        
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_user_one) {
                    setData(returnData.insert_neo_skeleton_user_one)
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
    return {  CreateUserLoading, CreateUserData, CreateUserError, getCreateUser };
};

export default useCreateUser;