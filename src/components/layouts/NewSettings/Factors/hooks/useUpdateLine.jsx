import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateLine = () => {
    const [outLineLoading, setLoading] = useState(false);// NOSONAR -  skip this line
    const [outLineData, setData] = useState(null);// NOSONAR -  skip this line
    const [outLineError, setError] = useState(null);// NOSONAR -  skip this line
// NOSONAR - This function requires multiple parameters due to its specific use case.
    const getUpdateLineDetails = async ( line_id,location,name,energy_asset,dash_aggregation,mic_stop_duration,shift,node ) => {// NOSONAR -  skip this line
        setLoading(true);
        configParam.RUN_GQL_API(mutations.SaveLineDetails,{line_id,location,name,energy_asset,dash_aggregation,mic_stop_duration,shift,node })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            })
    }

    return { outLineLoading, outLineData, outLineError, getUpdateLineDetails };
}


export default useUpdateLine;