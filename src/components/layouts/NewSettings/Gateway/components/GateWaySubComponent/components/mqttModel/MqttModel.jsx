import React, {  useState, useImperativeHandle,forwardRef } from "react";
import ModalNDL from "components/Core/ModalNDL";
import MqttConfiguration from "./MqttConfiguration";




const MqttModel = forwardRef((props,ref) => {
    const [MqttDialog, setMqttDialog] = useState(false);
    useImperativeHandle(ref, () =>
    (
        {
            handleGatewayDialogAdd: () => {
                setMqttDialog(true)
            },

        }
    )
    )

    function handleMQTTDialogClose(){
        setMqttDialog(false)
    }
    return (
        <ModalNDL open={MqttDialog}>

            <MqttConfiguration mqttDetails ={props.mqttDetails} MqttConfiguration={props.MqttConfiguration} path={props.path} handleMQTTDialogClose={handleMQTTDialogClose} />

        </ModalNDL>

    )
}
)


export default MqttModel;