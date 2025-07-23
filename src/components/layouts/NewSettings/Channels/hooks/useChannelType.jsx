import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useChannelType = () => {
    const [ChannelTypeLoading , setLoading] = useState(false);
    const [ChannelTypeData, setData] = useState(null);
    const [ChannelTypeError , setError] = useState(null);

    const getChannelType = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.channelType)
            .then((res) => {
                if (res !== undefined) {
                    setData(res.neo_skeleton_notification_channel_type)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return {  ChannelTypeLoading, ChannelTypeData ,ChannelTypeError, getChannelType };
};

export default useChannelType;