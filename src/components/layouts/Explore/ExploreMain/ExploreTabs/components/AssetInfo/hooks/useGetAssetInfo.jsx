import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries";
const useGetAssetInfo= () => {
    const [ AssetInfoLoading , setLoading] = useState(false);
    const [ AssetInfoData, setData] = useState(null);
    const [ AssetInfoError , setError] = useState(null);
    const getAssetInfo = async (selectedAsset) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssetInfo, { "entity_id":selectedAsset}) 
          .then((tempAssetInfo) => {
            if ( tempAssetInfo !== undefined && tempAssetInfo.neo_skeleton_entity_info && tempAssetInfo.neo_skeleton_entity_info.length > 0) {
                
                setData(tempAssetInfo.neo_skeleton_entity_info[0].info)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   AssetInfoLoading,  AssetInfoData , AssetInfoError, getAssetInfo };
};

export default useGetAssetInfo;
