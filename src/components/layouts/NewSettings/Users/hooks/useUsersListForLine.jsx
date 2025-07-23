import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useUsersListForLine = () => {
    const [UsersListForLineLoading, setLoading] = useState(false); 
    const [UsersListForLineError, setError] = useState(null); 
    const [UsersListForLineData, setData] = useState(null); 

    const getUsersListForLine = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetUsersListForLine,{line_id: line_id})
        
            .then((returnData) => {
               
                if (returnData !== undefined && returnData.neo_skeleton_user_role_line && returnData.neo_skeleton_user_role_line.length > 0) {
                    setData(returnData.neo_skeleton_user_role_line)
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
    return {  UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine };
};

export default useUsersListForLine;