import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateHierarchy = () => {
    const [updateHierarchyLoading, setLoading] = useState(false);
    const [updateHierarchyData, setData] = useState(null);
    const [updateHierarchyError, setError] = useState(null); 
    const updateHierarchy = async (name, treeData,line_id,userid,hierarchyId) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.UpdateHierarchy, { name: name, hierarchy: treeData, line_id: line_id, user_id: userid, hier_id: hierarchyId })
            .then((response) => {
                if (response !== undefined && response.update_neo_skeleton_hierarchy) {
                    setData(response.update_neo_skeleton_hierarchy)
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
    return { updateHierarchyLoading, updateHierarchyData, updateHierarchyError, updateHierarchy };
};

export default useUpdateHierarchy;