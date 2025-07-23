import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddorUpdateUserDefaultHierarchy = () => {
    const [addOrUpdateUserDefaultHierarchyLoading, setLoading] = useState(false); 
    const [addOrUpdateUserDefaultHierarchyError, setError] = useState(null); 
    const [addOrUpdateUserDefaultHierarchyData, setData] = useState(null); 

    const getAddorUpdateUserDefaultHierarchy = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.AddOrUpdateUserDefaultHierarchy,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.insert_neo_skeleton_user_line_default_hierarchy_one) {  
                    setData(returnData.insert_neo_skeleton_user_line_default_hierarchy_one)
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
                console.log("NEW MODEL", "ERR", e, "Explore", new Date())
            });

    };
    return {  addOrUpdateUserDefaultHierarchyLoading, addOrUpdateUserDefaultHierarchyData, addOrUpdateUserDefaultHierarchyError, getAddorUpdateUserDefaultHierarchy };
};

export default useAddorUpdateUserDefaultHierarchy;