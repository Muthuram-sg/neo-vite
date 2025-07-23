import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateAssetInstrumentsMapping = () => {
    const [UpdateAssetInstrumentsMappingLoading, setLoading] = useState(false);
    const [UpdateAssetInstrumentsMappingData, setData] = useState(null);
    const [UpdateAssetInstrumentsMappingError, setError] = useState(null);

    const getUpdateAssetInstrumentsMapping = async (entity_id, instrument_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteAssetInstrumentsMapping,{ entity_id: entity_id, instrument_id: instrument_id})
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_entity_instruments) {
                    setData(returnData.insert_neo_skeleton_entity_instruments)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Entity Setting - Update Asset Instruments Mapping", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { UpdateAssetInstrumentsMappingLoading, UpdateAssetInstrumentsMappingData, UpdateAssetInstrumentsMappingError, getUpdateAssetInstrumentsMapping };
};

export default useUpdateAssetInstrumentsMapping;