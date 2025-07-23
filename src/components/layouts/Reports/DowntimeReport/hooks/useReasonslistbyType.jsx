import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseReasonslistbyType = () => {
    const [outlistbytypeLoading, setLoading] = useState(false);
    const [outlistbytypeData, setData] = useState(null);
    const [outlistbytypeError, setError] = useState(null);

    const getReasonListbyTypes = async (reasonType) => {
        if(reasonType){
            setLoading(true);
            await configParam.RUN_GQL_API(gqlQueries.getReasonsListbyTypeOnly, {reasonType})
                .then((productData) => {
                    if (productData.neo_skeleton_prod_reasons) {
                        setData(productData.neo_skeleton_prod_reasons)
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
                    console.log("NEW MODEL", e, "Getting Reasons Type Setting Screen", new Date())
                    setLoading(false);
                    setError(e);
                    setData([]);
                });
        }
        

    };
    return { outlistbytypeLoading, outlistbytypeData, outlistbytypeError, getReasonListbyTypes };
};

export default UseReasonslistbyType;