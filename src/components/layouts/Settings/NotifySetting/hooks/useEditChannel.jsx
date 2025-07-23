import { useState } from "react";
import configParam from "config";
import mutation from "components/layouts/Mutations";

const useEditChannel = () => {
    const [EditChannelLoading, setLoading] = useState(false); 
    const [EditChannelError, setError] = useState(null); 
    const [EditChannelData, setData] = useState(null); 

    const getEditChannel = async (id,updated_by,ChannelType,parameter,Name) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutation.EditChannelLineAccess,{id: id, updated_by: updated_by, type: ChannelType, parameter: parameter ,  name: Name})
        
            .then((returnData) => {
             
                if (returnData.update_neo_skeleton_notification_channels.affected_rows >= 1) {
                    setData(returnData.update_neo_skeleton_notification_channels.affected_rows)
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
    return {  EditChannelLoading, EditChannelData, EditChannelError, getEditChannel };
};

export default useEditChannel;