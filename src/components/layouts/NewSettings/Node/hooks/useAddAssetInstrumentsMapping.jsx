import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddAssetInstrumentsMapping = () => {
    const [AddAssetInstrumentsMappingLoading, setLoading] = useState(false);
    const [AddAssetInstrumentsMappingData, setData] = useState(null);
    const [AddAssetInstrumentsMappingError, setError] = useState(null);

    const getAddAssetInstrumentsMapping = async (entityInstruments) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.AddAssetInstrumentsMapping,{ objects: entityInstruments})
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
                console.log("NEW MODEL", e, "Entity Setting - Asset Instruments Mapping", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AddAssetInstrumentsMappingLoading, AddAssetInstrumentsMappingData, AddAssetInstrumentsMappingError, getAddAssetInstrumentsMapping };
};

export default useAddAssetInstrumentsMapping;