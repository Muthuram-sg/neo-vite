
import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateTimeSlot = () => {
    const [updatetimeslotLoading, setLoading] = useState(false);
    const [updatetimeslotData, setData] = useState(null);
    const [updatetimeslotError, setError] = useState(null);

    const getupdatetimeslot = async (variables) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.UpdateTimeSlotTimings, variables)
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Update Calendar Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { updatetimeslotLoading, updatetimeslotData, updatetimeslotError, getupdatetimeslot };
}


export default useUpdateTimeSlot;