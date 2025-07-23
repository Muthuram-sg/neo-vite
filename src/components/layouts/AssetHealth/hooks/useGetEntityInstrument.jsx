import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetEntityInstrument = () => {
    const [entityInstrumentLoading, setLoading] = useState(false);
    const [entityInstrumentData, setData] = useState(null);
    const [entityInstrumentError, setError] = useState(null);

    const getEntityInstrument = async (entity_id, insType) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getEntityInstrumentsListWithEntityID, {entity_id: entity_id, instrument_type: insType})
            .then((returnData) => {
                if (returnData.neo_skeleton_entity_instruments) {
                    setData(returnData.neo_skeleton_entity_instruments)
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { entityInstrumentLoading, entityInstrumentData, entityInstrumentError, getEntityInstrument };
};

export default useGetEntityInstrument;