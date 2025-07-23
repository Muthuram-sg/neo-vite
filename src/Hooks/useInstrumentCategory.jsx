import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentCategory = () => {
    const [InstrumentCategoryListLoading, setLoading] = useState(false);
    const [InstrumentCategoryListData, setData] = useState(null);
    const [InstrumentCategoryListError, setError] = useState(null);

        const getInstrumentCategory = async () => {        
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentCategory, {})
            .then((categoryList) => {
                if (categoryList !== undefined && categoryList.neo_skeleton_instrument_category && categoryList.neo_skeleton_instrument_category.length > 0) {
                    setData(categoryList.neo_skeleton_instrument_category);
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                   
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory };
}


export default useInstrumentCategory;