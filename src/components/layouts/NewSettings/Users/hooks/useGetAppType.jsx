import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAppType = () => {
    const [UserAppTypeLoading, setLoading] = useState(false); 
    const [UserAppTypeError, setError] = useState(null); 
    const [UserAppTypeData, setData] = useState(null); 

    const getAppType = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAppType,{id: id})
        
            .then((returnData) => {
                if (returnData.neo_skeleton_lines) {
                    let data = returnData.neo_skeleton_lines[0].appTypeByAppType
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
    return {  UserAppTypeLoading, UserAppTypeData, UserAppTypeError, getAppType };
};

export default useGetAppType;