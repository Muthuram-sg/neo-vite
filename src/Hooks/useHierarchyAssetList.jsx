import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useHierarchyAssetList = () => {
    const [hierarchyAssetListLoading, setLoading] = useState(false);
    const [hierarchyAssetListData, setData] = useState(null);
    const [hierarchyAssetListError, setError] = useState(null); 
    const hierarchyAssetList = async (line_id) => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getHierarchyAssetList, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_entity) {
                    setData(response.neo_skeleton_entity)
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
    return { hierarchyAssetListLoading, hierarchyAssetListData, hierarchyAssetListError, hierarchyAssetList };
};

export default useHierarchyAssetList;