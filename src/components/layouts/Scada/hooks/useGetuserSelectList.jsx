import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useSelectedUser = () => {
    const [SelectedUserLoading, setLoading] = useState(false); 
    const [SelectedUserError, setError] = useState(null); 
    const [SelectedUserData, setData] = useState(null); 

    const getSelectedUser = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetUsersListForLine,{"line_id": lineID,"disable": false})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                   
                    if(returnData.neo_skeleton_user_role_line){
                        setData(returnData.neo_skeleton_user_role_line)
                        setError(false)
                        setLoading(false)
                        
                    }
                    
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  SelectedUserLoading, SelectedUserError, SelectedUserData, getSelectedUser};
};

export default useSelectedUser;