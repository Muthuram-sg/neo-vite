import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useCheckExternalUser = () => {
    const [checkExternalUserLoading, setLoading] = useState(false); 
    const [checkExternalUserError, setError] = useState(null); 
    const [checkExternalUserData, setData] = useState(null); 

    const getcheckExternalUser = async (email) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.searchUserByEmailName,{"email": email})
        
            .then((userData) => {
                
                if (userData.neo_skeleton_user) {
                    setData(userData.neo_skeleton_user)
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
    return {  checkExternalUserLoading, checkExternalUserData, checkExternalUserError, getcheckExternalUser };
};

export default useCheckExternalUser;