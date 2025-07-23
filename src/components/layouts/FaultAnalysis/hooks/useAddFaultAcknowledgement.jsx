import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddFaultAcknowledgement = () => {
    const [addFaultAcknowledgementLoading, setLoading] = useState(false);
    const [addFaultAcknowledgementData, setData] = useState(null);
    const [addFaultAcknowledgementError, setError] = useState(null);

    const getAddFaultAcknowledgement = async (name, line_id, created_by) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addFaultAcknowledgement, { name: name, line_id: line_id, created_by: created_by})
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_fault_acknowledgement) {
                    setData(response.insert_neo_skeleton_fault_acknowledgement);
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

    return { addFaultAcknowledgementLoading, addFaultAcknowledgementData, addFaultAcknowledgementError, getAddFaultAcknowledgement };
}


export default useAddFaultAcknowledgement;