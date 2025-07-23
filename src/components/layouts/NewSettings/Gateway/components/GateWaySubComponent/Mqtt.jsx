import React from "react";
import Grid from 'components/Core/GridNDL'
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import LoadingScreenNDL from "LoadingScreenNDL";


// NOSONAR - This function requires multiple parameters due to its specific use case.
export default function Mqtt(props) {// NOSONAR 

    // console.log(props.mqttDetails, 'mqttDetails')
    const mqttDetails = props.mqttDetails.length > 0 ? props.mqttDetails[0] : {}// NOSONAR 
    return (
        <React.Fragment>
            {
                props.MQttConfigurationLoading  && <LoadingScreenNDL />// NOSONAR 
            }

            <div className="p-4">
                <Grid container >
                    <Grid item xs={4}>

                    </Grid>
                    <Grid item xs={3}>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Details" variant="heading-02-xs" />
                            {/* <TypographyNDL value="MQTT Details" variant="paragraph-xs" /> */}

                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Data Base" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqttdatabase ? mqttDetails.mqttdatabase : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="Project Name" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.project_name ? mqttDetails.project_name : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="Data" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.data ? mqttDetails.data : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="Edge UID" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.edgeUID ? mqttDetails.edgeUID : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Connection Type" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_connection_type ? mqttDetails.mqtt_connection_type : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Host" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_host ? mqttDetails.mqtt_host : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Port" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_port ? mqttDetails.mqtt_port : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Keep Alive" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_keepalive ? mqttDetails.mqtt_keepalive : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT User" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_user ? mqttDetails.mqtt_user : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Pass" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_pass ? mqttDetails.mqtt_pass : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT TLS" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_tls ? mqttDetails.mqtt_tls : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT TLS Verify Disable" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_tls_verify_disable ? mqttDetails.mqtt_tls_verify_disable : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT WS Path" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_ws_path ? mqttDetails.mqtt_ws_path : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Auth" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_auth ? mqttDetails.mqtt_auth : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="MQTT Server CA" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_sever_ca ? mqttDetails.mqtt_sever_ca : "--"} variant="label-01-s" style={{
                            overflow: 'visible',
                            whiteSpace: 'normal',
                            textOverflow: 'clip', 
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word' 
                            }} />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5 break-words">
                            <TypographyNDL value="MQTT User CA" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.mqtt_user_ca ? mqttDetails.mqtt_user_ca : "--"} variant="label-01-s" 
                             />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="QOS" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails && (mqttDetails.qos || mqttDetails.qos === 0) ? mqttDetails.qos.toString() : "--"} variant="label-01-s" />
                        </div>
                        <div className="flex  mb-4 flex-col gap-0.5">
                            <TypographyNDL value="Retain Flag" variant="paragraph-xs" color='secondary' />
                            <TypographyNDL value={mqttDetails.retain_flag ? "True" : "False"} variant="label-01-s" />
                        </div>
                    </Grid>
                    <Grid item xs={5}>

                    </Grid>
                </Grid>
            </div>



        </React.Fragment>
    )

}