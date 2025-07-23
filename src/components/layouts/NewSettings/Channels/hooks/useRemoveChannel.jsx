import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useRemoveChannel = () => {
    const [RemoveChannelLoading, setLoading] = useState(false); 
    const [RemoveChannelError, setError] = useState(null); 
    const [RemoveChannelData, setData] = useState(null); 

    const getRemoveChannel = async (id,line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.DeleteChanellLineAccess,{id: id, line_id: line_id})
        
            .then((returnData) => {
               
                if (returnData.delete_neo_skeleton_notification_channels.affected_rows >= 1) {
                    setData(returnData.delete_neo_skeleton_notification_channels.affected_rows)
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
                console.log("NEW MODEL", "ERR", e, "Notification Setting", new Date())
            });

    };
    return {  RemoveChannelLoading, RemoveChannelData, RemoveChannelError, getRemoveChannel };
};

export default useRemoveChannel;