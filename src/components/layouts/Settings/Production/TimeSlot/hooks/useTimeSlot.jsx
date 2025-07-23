import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useTimeSlot = () => {
    const [timeslotLoading, setLoading] = useState(false);
    const [timeslotData, setData] = useState(null);
    const [timeslotError, setError] = useState(null);

    const getTimeSlots = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetTimeSlotData, { line_id: line_id })
            .then((timeslotdata) => { 
                if (timeslotdata.neo_skeleton_lines[0]) {
                    setData(timeslotdata.neo_skeleton_lines[0])
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
                console.log("NEW MODEL", e, "Timeslot fetching api", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { timeslotLoading, timeslotData, timeslotError, getTimeSlots };
};

export default useTimeSlot;