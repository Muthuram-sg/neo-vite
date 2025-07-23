import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateCalculations = () => {
    const [UpdateCalculationsLoading, setLoading] = useState(false);
    const [UpdateCalculationsError, setError] = useState(null);
    const [UpdateCalculationsData, setData] = useState(null);

    const getUpdateCalculations = async (id, calculations) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateSteelAssetConfigCalculation, { id: id, calculations: calculations })

            .then((returnData) => {
                if (returnData.update_neo_skeleton_steel_asset_config) {
                    setData(returnData.update_neo_skeleton_steel_asset_config)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Steel Data Setting", new Date())
            });

    };
    return { UpdateCalculationsLoading, UpdateCalculationsData, UpdateCalculationsError, getUpdateCalculations };
};

export default useUpdateCalculations;