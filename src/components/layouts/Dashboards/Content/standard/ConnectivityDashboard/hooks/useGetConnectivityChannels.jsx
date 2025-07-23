import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetConnectivityChannels = () => {
    const [connectivityChannelsLoading, setLoading] = useState(false); 
    const [connectivityChannelsError, setError] = useState(null); 
    const [connectivityChannelsData, setData] = useState(null); 

    const getConnectivityChannels = async (type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetConnectivityChannel,{type: type })
        
            .then((returnData) => {
                // console.log(returnData,"getConnectivityChannels")
                if (returnData !== undefined && returnData.neo_skeleton_notification_channels) {
                    setData(returnData.neo_skeleton_notification_channels)
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  connectivityChannelsLoading, connectivityChannelsData, connectivityChannelsError, getConnectivityChannels };
};

export default useGetConnectivityChannels;