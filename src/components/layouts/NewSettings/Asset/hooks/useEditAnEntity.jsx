import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useEditAnEntity = () => {
    const [EditAnEntityLoading, setLoading] = useState(false); 
    const [EditAnEntityError, setError] = useState(null); 
    const [EditAnEntityData, setData] = useState(null); 

    const getEditAnEntity = async (entity_id,id,name,entity_type,asset_types,info,zone, spindleSpeedThreshold = null, feedRateThreshold = null) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.EditAnEntity,{ entity_id: entity_id,user_id: id, name: name, entity_type: entity_type, asset_types: asset_types,info:{fault_Analysis:info.isFaultAnalysis,contractInstrument:info.contractInstrument,target:info.target,tenure:info.tenure,ImageURL:info.ImageURL},is_zone:zone, spindle_speed_threshold: spindleSpeedThreshold, feed_rate_threshold: feedRateThreshold})
        
            .then((returnData) => {
              
                if (returnData.update_neo_skeleton_entity) {
                    setData(returnData.update_neo_skeleton_entity)
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
    return {  EditAnEntityLoading, EditAnEntityData, EditAnEntityError, getEditAnEntity };
};

export default useEditAnEntity;