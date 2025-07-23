import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMultiLineHierarchy = () => {
    const [MultiLineHierarchyListLoading, setLoading] = useState(false);
    const [MultiLineHierarchyListData, setData] = useState(null);
    const [MultiLineHierarchyListError, setError] = useState(null); 
    const getMultiLineHierarchyList = async (line_id) => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetMultiLineHierarchy, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_user_line_default_hierarchy) {
                    setData(response.neo_skeleton_user_line_default_hierarchy)
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
    return { MultiLineHierarchyListLoading, MultiLineHierarchyListData, MultiLineHierarchyListError, getMultiLineHierarchyList };
};

export default useMultiLineHierarchy;