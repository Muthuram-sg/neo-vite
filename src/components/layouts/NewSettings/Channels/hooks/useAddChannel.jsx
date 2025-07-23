import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useAddChannel = () => {
    const [AddChannelLoading, setLoading] = useState(false); 
    const [AddChannelError, setError] = useState(null); 
    const [AddChannelData, setData] = useState(null); 

    const getAddChannel = async (ChannelType,line_id,Name,parameter,created_by) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.CreateNewChannel,{type: ChannelType, line_id: line_id, name: Name, parameter: parameter, created_by: created_by})
        
            .then((returnData) => {
               
                if (returnData.insert_neo_skeleton_notification_channels_one.name) {
                    setData(returnData.insert_neo_skeleton_notification_channels_one.name)
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
    return {  AddChannelLoading, AddChannelData, AddChannelError, getAddChannel };
};

export default useAddChannel;