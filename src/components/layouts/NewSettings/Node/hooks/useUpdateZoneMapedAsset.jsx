import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateZoneMapedAsset = () => {
    const [UpdateZoneMapedAssetLoading, setLoading] = useState(false); 
    const [UpdateZoneMapedAssetError, setError] = useState(null); 
    const [UpdateZoneMapedAssetData, setData] = useState(null); 

    const getUpdateZoneMapedAsset = async (body) => {
        setLoading(true);
              await configParam.RUN_GQL_API(Mutations.updateNodeMapedAsset,body)
            .then((returnData) => {
             
                if (returnData.update_neo_skeleton_node_zone_mapping) {
                    setData(returnData.update_neo_skeleton_node_zone_mapping)
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
    return {  UpdateZoneMapedAssetLoading, UpdateZoneMapedAssetData, UpdateZoneMapedAssetError, getUpdateZoneMapedAsset };
};

export default useUpdateZoneMapedAsset;