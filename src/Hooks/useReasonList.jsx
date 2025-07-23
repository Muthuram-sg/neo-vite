import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useReasonList = () => {
    const [reasonLoading, setLoading] = useState(false);
    const [reasonData, setData] = useState(null);
    const [reasonError, setError] = useState(null);

    const getReasonList = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getReasons, {})
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_reasons) {
                    setData(oeeData.neo_skeleton_prod_reasons)
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
    return { reasonLoading, reasonData, reasonError, getReasonList };
};

export default useReasonList;