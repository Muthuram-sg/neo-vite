import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateLine = () => {
    const [outLineUpdateLoading, setLoading] = useState(false);
    const [outLineUpdateData, setData] = useState(null);
    const [outLineUpdateError, setError] = useState(null);

     // eslint-disable-next-line react-hooks/exhaustive-deps
    const getSaveLineDetails = async ( line_id,location,name,energy_asset,dash_aggregation,mic_stop_duration,shift,node, custom_name ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.SaveLineDetails,{ line_id,location,name,energy_asset,dash_aggregation,mic_stop_duration,shift,node, custom_name })
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { outLineUpdateLoading, outLineUpdateData, outLineUpdateError, getSaveLineDetails };
}


export default useUpdateLine;