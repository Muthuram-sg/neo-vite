import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";
// NOSONAR  start -  skip next line
const useUserData = () => {
    const [UserLoading, setLoading] = useState(false); 
    const [UserError, setError] = useState(null); 
    const [UserData, setData] = useState(null); 
// NOSONAR  end -  skip 

    const getUserData = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getUsers,{id: id})
        
            .then((returnData) => {
                if (returnData.neo_skeleton_user) {
                    let data = returnData.neo_skeleton_user[0]
                    console.log(data,"data")
                    setData(data)
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
    return {  UserLoading, UserError, UserData, getUserData };
};

export default useUserData;