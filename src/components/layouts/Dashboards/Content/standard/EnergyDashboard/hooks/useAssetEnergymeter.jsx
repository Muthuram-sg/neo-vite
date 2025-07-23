import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAssetEnergymeter = () => {
    const [AssetEnergymeterLoading, setLoading] = useState(false);
    const [AssetEnergymeterData, setData] = useState(null);
    const [AssetEnergymeterError, setError] = useState(null);

    const getAssetEnergymeter = async (id,itype) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssertEnergy, { line_id: id ,instrument_type:itype})
            .then(result => { 
                if (result && result.neo_skeleton_entity && result.neo_skeleton_entity.length>0) {
                    setData(result.neo_skeleton_entity)
                    setError(false)
                    setLoading(false)
                } else {
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



    }
    return { AssetEnergymeterLoading, AssetEnergymeterData, AssetEnergymeterError, getAssetEnergymeter };
}

export default useAssetEnergymeter;
