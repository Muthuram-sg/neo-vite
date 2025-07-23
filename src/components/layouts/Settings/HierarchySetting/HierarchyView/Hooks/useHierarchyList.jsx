import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useHierarchyList = () => {
    const [hierarchyListLoading, setLoading] = useState(false);
    const [hierarchyListData, setData] = useState(null);
    const [hierarchyListError, setError] = useState(null); 
    const hierarchyList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetLineHierarchy, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_hierarchy) {
                    setData(response.neo_skeleton_hierarchy)
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
    return { hierarchyListLoading, hierarchyListData, hierarchyListError, hierarchyList };
};

export default useHierarchyList;