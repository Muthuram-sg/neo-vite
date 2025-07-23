import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAssetList = () => {
    const [assetListLoading, setLoading] = useState(false);
    const [assetListData, setData] = useState(null);
    const [assetListError, setError] = useState(null); 
    const assetList = async (line_id) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssertList, {line_id: line_id})
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
    return { assetListLoading, assetListData, assetListError, assetList };
};

export default useAssetList;