import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
// NOSONAR  start -  skip next line
const useLineData = () => {
    const [LineDataLoading, setLoading] = useState(false);
    const [LineDataData, setData] = useState(null);
    const [LineDataError, setError] = useState(null);
// NOSONAR  end -  skip

    const getLineData = async ( line_id ) => {
       
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.getLines,{ line_id })
            .then((response) => {
                setData(response.neo_skeleton_lines);
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

    return { LineDataLoading, LineDataData, LineDataError, getLineData };
}


export default useLineData;