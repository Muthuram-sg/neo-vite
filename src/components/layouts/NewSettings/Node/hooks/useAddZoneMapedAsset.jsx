import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddZoneMapedAsset = () => {
    const [AddZoneMapedAssetLoading, setLoading] = useState(false); 
    const [AddZoneMapedAssetError, setError] = useState(null); 
    const [AddZoneMapedAssetData, setData] = useState(null); 

    const getAddZoneMapedAsset = async (entity_id,asset_id) => {
        let assetId = asset_id.length > 0 ? asset_id : []
        setLoading(true);
              await configParam.RUN_GQL_API(Mutations.insertNodeMapedAsset,{asset_id:assetId,entity_id:entity_id})
            .then((returnData) => {
             
                if (returnData.insert_neo_skeleton_node_zone_mapping) {
                    setData(returnData.insert_neo_skeleton_node_zone_mapping)
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  AddZoneMapedAssetLoading, AddZoneMapedAssetData, AddZoneMapedAssetError, getAddZoneMapedAsset };
};

export default useAddZoneMapedAsset;