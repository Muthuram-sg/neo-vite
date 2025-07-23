import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetUserEmail = () => {
    const [UserMailLoading, setLoading] = useState(false); 
    const [UserMailError, setError] = useState(null); 
    const [UserMailData, setData] = useState(null); 

    const searchUserById = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.searchUserById,{id: id})
        
            .then((returnData) => {
                if (returnData.neo_skeleton_user) {
                    let data = returnData.neo_skeleton_user[0]
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
    return {  UserMailLoading, UserMailData, UserMailError, searchUserById };
};

export default useGetUserEmail;