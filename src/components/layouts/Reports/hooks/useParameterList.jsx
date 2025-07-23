import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useParameterList = () => {
    const [ParameterListLoading, setLoading] = useState(false); 
    const [ParameterListError, setError] = useState(null); 
    const [ParameterListData, setData] = useState(null); 

    const getParameterList = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getParameterList,{})
        
            .then((returnData) => {
                if (returnData !== undefined) {
                    setData(returnData.neo_skeleton_metrics)
                    setError(false)
                    setLoading(false)
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
    return {  ParameterListLoading, ParameterListData, ParameterListError, getParameterList };
};

export default useParameterList;