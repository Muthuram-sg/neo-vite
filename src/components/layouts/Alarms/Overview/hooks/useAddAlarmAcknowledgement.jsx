import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddAlarmAcknowledgement = () => {
    const [addAlarmAcknowledgementLoading, setLoading] = useState(false);
    const [addAlarmAcknowledgementData, setData] = useState(null);
    const [addAlarmAcknowledgementError, setError] = useState(null);

    const getAddAlarmAcknowledgement = async (name, type, line_id, created_by) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.addAlarmAcknowledgement, { name: name, type: type, line_id: line_id, created_by: created_by})
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_alarm_acknowledgement) {
                    setData(response.insert_neo_skeleton_alarm_acknowledgement);
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { addAlarmAcknowledgementLoading, addAlarmAcknowledgementData, addAlarmAcknowledgementError, getAddAlarmAcknowledgement };
}


export default useAddAlarmAcknowledgement;