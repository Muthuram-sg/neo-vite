import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useCheckUserAccessForLine = () => {
    const [CheckUserAccessForLineLoading, setLoading] = useState(false); 
    const [CheckUserAccessForLineError, setError] = useState(null); 
    const [CheckUserAccessForLineData, setData] = useState(null); 

    const getCheckUserAccessForLine = async (line_id,user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.checkUserAccessForLine,{line_id: line_id, user_id: user_id})
        
            .then((returnData) => {
             
                if (returnData.neo_skeleton_user_role_line) {
                    let data = {user_id : user_id ,Data: returnData.neo_skeleton_user_role_line}; 
                    if(returnData.neo_skeleton_user_role_line.length === 0){
                        data = {user_id : user_id ,Data: returnData.neo_skeleton_user_role_line}
                    }
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
    return {  CheckUserAccessForLineLoading, CheckUserAccessForLineData, CheckUserAccessForLineError, getCheckUserAccessForLine };
};

export default useCheckUserAccessForLine;