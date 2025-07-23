import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetChannelListForLine= () => {
    const [ ChannelListForLineLoading , setLoading] = useState(false);
    const [ ChannelListForLineData, setData] = useState(null);
    const [ ChannelListForLineError , setError] = useState(null);

    const getChannelListForLine = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getChannelListForLine, { line_id: line_id }) 
          .then((userLineData) => {
           
            if ( userLineData !== undefined && userLineData.neo_skeleton_notification_channels && userLineData.neo_skeleton_notification_channels.length > 0) {
                setData(userLineData.neo_skeleton_notification_channels)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   ChannelListForLineLoading,  ChannelListForLineData , ChannelListForLineError,getChannelListForLine };
};

export default useGetChannelListForLine;