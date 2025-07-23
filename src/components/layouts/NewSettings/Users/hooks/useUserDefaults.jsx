import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useUserDefaults = () => {
    const [UserDefaultsLoading, setLoading] = useState(false); 
    const [UserDefaultsError, setError] = useState(null); 
    const [UserDefaultsData, setData] = useState(null); 

    const getUserDefaults = async (user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetUserDefaults,{user_id: user_id})
        
            .then((returnData) => {
                
                if (returnData !== undefined && returnData.neo_skeleton_user && returnData.neo_skeleton_user.length > 0) {
                    setData(returnData.neo_skeleton_user)
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
    return {  UserDefaultsLoading, UserDefaultsData, UserDefaultsError, getUserDefaults };
};

export default useUserDefaults;