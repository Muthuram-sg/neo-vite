import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseQualitydata = () => {
    const [outQualityLoading, setLoading] = useState(false);
    const [outQualityData, setData] = useState(null);
    const [outQualityError, setError] = useState(null);

    const getdowntimedata = async (entity_id,from,to) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getQualityReports, {entity_id:entity_id,from: from, to: to})
            .then((productData) => {
                if (productData.neo_skeleton_prod_quality_defects) {
                    setData(productData.neo_skeleton_prod_quality_defects)
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
                console.log("NEW MODEL", e, "Quality report screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outQualityLoading, outQualityData, outQualityError, getdowntimedata };
};

export default UseQualitydata;