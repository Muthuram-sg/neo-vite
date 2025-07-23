import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetFaultAcknowledgement = () => {
    const [getFaultAcknowledgementLoading, setLoading] = useState(false);
    const [getFaultAcknowledgementData, setData] = useState(null);
    const [getFaultAcknowledgementError, setError] = useState(null);

    const getFaultAcknowledgement = async (line_id, type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getFaultAcknowledgementByType, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_fault_acknowledgement) {
                    setData(returnData.neo_skeleton_fault_acknowledgement)
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { getFaultAcknowledgementLoading, getFaultAcknowledgementData, getFaultAcknowledgementError, getFaultAcknowledgement };
};

export default useGetFaultAcknowledgement;