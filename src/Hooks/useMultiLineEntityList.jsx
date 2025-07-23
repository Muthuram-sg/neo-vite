import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMultiLineEntityList = () => {
    const [MultiLineEntityListLoading, setLoading] = useState(false);
    const [MultiLineEntityListData, setData] = useState(null);
    const [MultiLineEntityListError, setError] = useState(null); 
    const getMultiLineEntityList = async (line_id) => {
        // console.log('entity triggering')
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetMultilineEntityList, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_entity) {
                    setData(response.neo_skeleton_entity)
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
    return { MultiLineEntityListLoading, MultiLineEntityListData, MultiLineEntityListError, getMultiLineEntityList };
};

export default useMultiLineEntityList;