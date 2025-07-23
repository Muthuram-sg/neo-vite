import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useHierarchy = () => {
    const [HierarchyLoading, setLoading] = useState(false); 
    const [HierarchyError, setError] = useState(null); 
    const [HierarchyData, setData] = useState(null); 

    const getHierarchy = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getHierarchy,{id: id})
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_hierarchy && returnData.neo_skeleton_hierarchy) {
                    setData(returnData.neo_skeleton_hierarchy)
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
    return {  HierarchyLoading, HierarchyData, HierarchyError, getHierarchy };
};

export default useHierarchy;