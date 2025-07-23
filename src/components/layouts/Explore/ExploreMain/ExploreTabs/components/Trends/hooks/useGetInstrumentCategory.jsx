/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetInstrumentCategory = () => {
    const [categoriesLoading, setLoading] = useState(false);
    const [categoriesData, setData] = useState(null);
    const [categoriesError, setError] = useState(null);

    const getInstrumentCategory = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentCategory, {})
            .then((categoriesListData) => {
                if (categoriesListData !== undefined && categoriesListData.neo_skeleton_instrument_category && categoriesListData.neo_skeleton_instrument_category.length > 0) {
                    setData(categoriesListData.neo_skeleton_instrument_category)
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
                console.log("NEW MODEL", e, "Trends", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { categoriesLoading, categoriesData, categoriesError, getInstrumentCategory };
};

export default useGetInstrumentCategory;
