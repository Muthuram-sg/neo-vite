import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseRealInstrumentList = () => {
    const [outreallistLoading, setLoading] = useState(false);
    const [outreallistData, setData] = useState(null);
    const [outreallistError, setError] = useState(null);

    const getInstrumentFormulaList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getRealInstrumentList, {line_id:line_id})
            .then((productData) => {
              
                if (productData.neo_skeleton_instruments) {
                    setData(productData.neo_skeleton_instruments)
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
                console.log("NEW MODEL", e, "Asset OEE config in downtime report screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outreallistLoading, outreallistData, outreallistError, getInstrumentFormulaList };
};

export default UseRealInstrumentList;