import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useDownTime = () => {
    const [outDTLoading, setLoading] = useState(false);
    const [outDTData, setData] = useState(null);
    const [outDTError, setError] = useState(null);

    const getDownTimeReason = async (asset_id, start_date, end_date) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getDowntimeWithReasons, { asset_id: asset_id, from: start_date, to: end_date })
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_outage) {
                    setData(oeeData.neo_skeleton_prod_outage)
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
            });

    };
    return { outDTLoading, outDTData, outDTError, getDownTimeReason };
};

export default useDownTime;