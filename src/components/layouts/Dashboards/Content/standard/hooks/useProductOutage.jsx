import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useProductOutage = () => {
    const [productoutagelistLoading, setLoading] = useState(false);
    const [productoutagelistdata, setData] = useState(null);
    const [productoutagelisterror, setError] = useState(null);

    const getProductOutageList = async (start_dt,end_dt,line_id,product_id) => {
        
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getProductOutage, { start_dt : start_dt , end_dt : end_dt , line_id : line_id , product_id : product_id })
            .then(prodoutagelist => {
                if (prodoutagelist !== undefined && prodoutagelist.neo_skeleton_prod_outage) {
                    console.log("data",prodoutagelist.neo_skeleton_prod_outage.length)
                    setData(prodoutagelist.neo_skeleton_prod_outage)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }


                // console.log(alertsList, "alertsListalertsList")
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { productoutagelistLoading, productoutagelistdata, productoutagelisterror, getProductOutageList };
}

export default useProductOutage;
