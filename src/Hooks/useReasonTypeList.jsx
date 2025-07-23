import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useReasonTypeList = () => {
    const [reasonTypeLoading, setLoading] = useState(false);
    const [reasonTypeData, setData] = useState(null);
    const [reasonTypeError, setError] = useState(null);

    const getReasonTypeList = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getReasonTypes, {})
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_reason_types) {
                    setData(oeeData.neo_skeleton_prod_reason_types)
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
    return { reasonTypeLoading, reasonTypeData, reasonTypeError, getReasonTypeList };
};

export default useReasonTypeList;