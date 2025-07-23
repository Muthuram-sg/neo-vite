import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddNewEntity = () => {
    const [AddNewEntityLoading, setLoading] = useState(false); 
    const [AddNewEntityError, setError] = useState(null); 
    const [AddNewEntityData, setData] = useState(null); 


   

    const getAddNewEntity = async (id,name,entity_type,asset_types,line_id,info,zone) => {
        setLoading(true);
              await configParam.RUN_GQL_API(Mutations.AddNewEntity,{ user_id: id, name: name, entity_type: entity_type, asset_types: asset_types, line_id: line_id,
                info: info ? {
                    fault_Analysis: info?.isFaultAnalysis ?? false,
                    contractInstrument: info?.contractInstrument ?? "",
                    target: info?.target ?? "",
                    tenure: info?.tenure ?? "",
                    ImageURL: info?.ImageURL ?? "-",
                    target_per_year: info?.target_per_year ?? "",
                    AgreeCostYearly: info?.AgreeCostYearly ?? "",
                    MGQ: info?.MGQ ?? "",
                    targetPerMonth: info?.targetPerMonth ?? "",
                    isYearly: info?.isYearly ?? "monthly"
                  } : null,
                is_zone:zone})
        
            .then((returnData) => {
             
                if (returnData.insert_neo_skeleton_entity) {
                    setData(returnData.insert_neo_skeleton_entity)
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
    return {  AddNewEntityLoading, AddNewEntityData, AddNewEntityError, getAddNewEntity };
};

export default useAddNewEntity;