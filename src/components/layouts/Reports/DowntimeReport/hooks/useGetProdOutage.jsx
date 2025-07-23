import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetProdOutage = () => {
    const [productoutagelistLoading, setLoading] = useState(false);
    const [productoutagelistdata, setData] = useState(null);
    const [productoutagelisterror, setError] = useState(null);

    const getProductOutageList = async (Start,End,entity_id,e) => {
        
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getProdOutageData, { start_dt : Start , end_dt : End , entity_id : entity_id})
            .then(prodoutagelist => {
                if (prodoutagelist !== undefined) {
                   
                    setData({Data:prodoutagelist.neo_skeleton_prod_outage,value:e})
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
    return { productoutagelistLoading, productoutagelistdata, productoutagelisterror, getProductOutageList };
}

export default useGetProdOutage;
