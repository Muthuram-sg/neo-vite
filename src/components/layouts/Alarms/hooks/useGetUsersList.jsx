import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetUsersList= () => {
    const [ UserListLoading , setLoading] = useState(false);
    const [ UserListData, setData] = useState(null);
    const [ UserListError , setError] = useState(null);

    const getUsersList = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getUsersList, {}) 
          .then((userData) => {
          
            if (userData !== undefined && userData.neo_skeleton_user) {
               
                setData(userData.neo_skeleton_user)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   UserListLoading,  UserListData , UserListError,getUsersList };
};

export default useGetUsersList;