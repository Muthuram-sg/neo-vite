import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useEntityAssetList = () => {
    const [EntityAssetListLoading, setLoading] = useState(false); 
    const [EntityAsseListError, setError] = useState(null); 
    const [EntityAssetListData, setData] = useState(null); 

    const getEntityAssetList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAssetListOeeBasedOnly,{ line_id: lineID })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_entity && returnData.neo_skeleton_entity.length > 0) { 
                    
                    setData(returnData.neo_skeleton_entity)
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
    return {  EntityAssetListLoading, EntityAssetListData, EntityAsseListError, getEntityAssetList };
};

export default useEntityAssetList;