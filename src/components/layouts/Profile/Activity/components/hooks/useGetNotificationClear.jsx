import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetNotificationClear = () => {
    const [NotificationClearLoading, setLoading] = useState(false);
    const [NotificationClearData, setData] = useState(null);
    const [NotificationClearError, setError] = useState(null);

    const getNotificationClear = async (timestamptz) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getNotificationsGtClear, { cnc:timestamptz })
        .then((returnData) => {
                if (returnData["neo_skeleton_notification_release"]) {
                    setData(returnData["neo_skeleton_notification_release"])
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
                console.log("NEW MODEL", e, "Getting Activity Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { NotificationClearLoading, NotificationClearData, NotificationClearError, getNotificationClear };
};

export default useGetNotificationClear;