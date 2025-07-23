import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useAssetEnergyList = () => {
    const [assetenergylistLoading, setLoading] = useState(false);
    const [assetenergylistdata, setData] = useState(null);
    const [assetenergylisterror, setError] = useState(null);

    const getAssetEnergyList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getAssetEnergy, { line_id: line_id })
            .then(assetlist => {
                if (assetlist !== undefined && assetlist.neo_skeleton_instruments_metrics && assetlist.neo_skeleton_instruments_metrics.length > 0) {
                    setData(assetlist.neo_skeleton_instruments_metrics)
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
    return { assetenergylistLoading, assetenergylistdata, assetenergylisterror, getAssetEnergyList };
}

export default useAssetEnergyList;
