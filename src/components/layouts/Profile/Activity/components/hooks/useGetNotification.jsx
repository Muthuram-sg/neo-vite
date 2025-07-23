import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetNotification = () => {
    const [NotificationLoading, setLoading] = useState(false);
    const [NotificationData, setData] = useState(null);
    const [NotificationError, setError] = useState(null);

    const getNotification = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getNotificationsDatewise, body)
        .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_notification_release) {
                    setData(returnData.neo_skeleton_notification_release)
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
    return { NotificationLoading, NotificationData, NotificationError, getNotification };
};

export default useGetNotification;