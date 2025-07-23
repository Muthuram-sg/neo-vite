import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseShifts = () => {
    const [outshiftLoading, setLoading] = useState(false);
    const [outshiftData, setData] = useState(null);
    const [outshiftError, setError] = useState(null);

    const getshifts = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetShiftDate, { line_id: line_id })
            .then((shiftdata) => { 
                if (shiftdata.neo_skeleton_lines[0]) {
                    setData(shiftdata.neo_skeleton_lines[0])
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
                console.log("NEW MODEL", e, "Getting calandar Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outshiftLoading, outshiftData, outshiftError, getshifts };
};

export default UseShifts;