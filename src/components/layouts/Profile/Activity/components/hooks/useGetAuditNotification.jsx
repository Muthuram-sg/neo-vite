import { useState } from "react";
import configParam from "config";


const useGetAuditNotification = () => {
    const [AuditNotificationLoading, setLoading] = useState(false);
    const [AuditNotificationData, setData] = useState(null);
    const [AuditNotificationError, setError] = useState(null);

    const getAuditNotification = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/alerts/getAudit', body, 0)
        .then((returnData) => {
                if (returnData !== undefined && Array.isArray(returnData.data) && returnData.data.length > 0) {
                    setData(returnData)
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
                console.log("NEW MODEL", e, "Getting Product Activity Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AuditNotificationLoading, AuditNotificationData, AuditNotificationError, getAuditNotification };
};

export default useGetAuditNotification;