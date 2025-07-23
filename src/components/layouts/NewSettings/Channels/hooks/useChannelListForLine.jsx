import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useChannelListForLine = () => {
    const [ChannelListLoading, setLoading] = useState(false); 
    const [ChannelListError, setError] = useState(null); 
    const [ChannelListForLineData, setData] = useState(null); 

    const getChannelListForLine = async (lineId) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getChannelListForLine,{line_id: lineId})
        
            .then((userLineData) => {
            
                if (userLineData&& userLineData.neo_skeleton_notification_channels && userLineData.neo_skeleton_notification_channels.length > 0) {
                    setData(userLineData.neo_skeleton_notification_channels)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData([])
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return {  ChannelListLoading, ChannelListForLineData, ChannelListError, getChannelListForLine };
};

export default useChannelListForLine;