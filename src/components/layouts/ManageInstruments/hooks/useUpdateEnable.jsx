import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const UpdateSensorEnabled = () => {
    const [EditSensorEnableLoading, setLoading] = useState(false);
    const [EditSensorEnableData, setData] = useState(null);
    const [EditSensorEnableError, setError] = useState(null);

    const getEditSensorEnable = async ( body ) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.UpdateSensorEnabled,body)
            .then((response) => {
                if (response!== undefined && response.update_neo_skeleton_sensors) {
                    setData(response.update_neo_skeleton_sensors);
            
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
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { EditSensorEnableLoading, EditSensorEnableData, EditSensorEnableError, getEditSensorEnable };
}


export default UpdateSensorEnabled;