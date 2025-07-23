import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useCreateHierarchy = () => {
    const [createHierarchyLoading, setLoading] = useState(false);
    const [createHierarchyData, setData] = useState(null);
    const [createHierarchyError, setError] = useState(null); 
    const createHierarchy = async (name, treeData,line_id,userid) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.CreateNewHierarchy, { name: name, hierarchy: treeData, line_id: line_id, user_id: userid })
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_hierarchy_one) {
                    setData(response.insert_neo_skeleton_hierarchy_one)
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
            });

    };
    return { createHierarchyLoading, createHierarchyData, createHierarchyError, createHierarchy };
};

export default useCreateHierarchy;