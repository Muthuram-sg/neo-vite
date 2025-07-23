import React, { useEffect, useState, useRef } from "react";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import useIncertMqttData from "../mqtthooks/useIncertMqttData";
import useUpdateMqttData from "../mqtthooks/useUpdateMqttData";
import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType } from "recoilStore/atoms";





const MqttConfiguration = (props) => {// NOSONAR 

    const MQTTDataBaseRef = useRef()
    const ProjectNameRef = useRef()
    const SchemaBaseRef = useRef()
    const DataBaseRef = useRef()
    const EdgeUIDRef = useRef()
    const MQTTHostRef = useRef()
    const MQTTPortRef = useRef()
    const MQTTUserRef = useRef()
    const MQTTPassRef = useRef()
    const MQTTWSPathRef = useRef()
    const MQTTAuthRef = useRef()
    const MQTTServerCARef = useRef()
    const MQTTUserCARef = useRef()
    const [mqttConnectionType, setmqttConnectionType] = useState('')
    const [mqttKeepAlive, setmqttKeepAlive] = useState('')
    const [MQTTTLS, setMQTTTLS] = useState("False")
    const [MQTTTLSVerifyDisable, setMQTTTLSVerifyDisable] = useState("False")
    const [qos, setqos] = useState("0")
    const [retainFlag, setretainFlag] = useState(false)

    const [isMQTTDataBase, setMQTTDataBase] = useState(false)// NOSONAR 
    const [isProjectName, setisProjectName] = useState(false)
    const [isSchemaBase, setisSchemaBase] = useState(false)
    const [isDataBase, setisDataBase] = useState(false)
    const [isEdgeUID, setisEdgeUID] = useState(false)
    const [isMQTTHost, setisMQTTHost] = useState(false)
    const [isMQTTPort, setisMQTTPort] = useState(false)
    const [isMQTTConnectionType, setisMQTTConnectionType] = useState(false)
    const [isMQTTKeepAlive, setisMQTTKeepAlive] = useState(false)
    const [isMQTTUser, setisMQTTUser] = useState(false)
    const [isMQTTPass, setisMQTTPass] = useState(false)
    const [isMQTTTLS, setisMQTTTLS] = useState(false)
    const [isMQTTTLSVerify, setisMQTTTLSVerify] = useState(false)
    const [isMQTTWSPath, setisMQTTWSPath] = useState(false)
    const [isMQTTAuth, setisMQTTAuth] = useState(false)
    const [isMQTTServer, setisMQTTServer] = useState(false)
    const [isMQTTUserCA, setisMQTTUserCA] = useState(false)
    const [isQOS, setisQOS] = useState(false)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const { IncertMqttDataLoading, IncertMqttDataData, IncertMqttDataError, IncertMqttData } = useIncertMqttData()
    const { UpdateMqttDataLoading, UpdateMqttDataData, UpdateMqttDataError, UpdateMqttData } = useUpdateMqttData()



    useEffect(() => {
        if (props.mqttDetails && props.mqttDetails.length > 0) {// NOSONAR 
            const mqttDetail = props.mqttDetails[0]// NOSONAR 

            setTimeout(() => {
                MQTTDataBaseRef.current.value = mqttDetail.mqttdatabase ? mqttDetail.mqttdatabase : ''// NOSONAR 
                ProjectNameRef.current.value = mqttDetail.project_name ? mqttDetail.project_name : ''// NOSONAR 
                SchemaBaseRef.current.value = mqttDetail.schema ? mqttDetail.schema : ""// NOSONAR 
                DataBaseRef.current.value = mqttDetail.data ? mqttDetail.data : ''// NOSONAR 
                EdgeUIDRef.current.value = mqttDetail.edgeUID ? mqttDetail.edgeUID : ''// NOSONAR 
                MQTTHostRef.current.value = mqttDetail.mqtt_host ? mqttDetail.mqtt_host : ''// NOSONAR 
                MQTTPortRef.current.value = mqttDetail.mqtt_port ? mqttDetail.mqtt_port : ''// NOSONAR 
                MQTTUserRef.current.value = mqttDetail.mqtt_user ? mqttDetail.mqtt_user : ''// NOSONAR 
                MQTTPassRef.current.value = mqttDetail.mqtt_pass ? mqttDetail.mqtt_pass : ''// NOSONAR 
                MQTTWSPathRef.current.value = mqttDetail.mqtt_ws_path ? mqttDetail.mqtt_ws_path : ''// NOSONAR 
                MQTTAuthRef.current.value = mqttDetail.mqtt_auth ? mqttDetail.mqtt_auth : ''// NOSONAR 
                MQTTServerCARef.current.value = mqttDetail.mqtt_sever_ca ? mqttDetail.mqtt_sever_ca : ''// NOSONAR 
                MQTTUserCARef.current.value = mqttDetail.mqtt_user_ca ? mqttDetail.mqtt_user_ca : ''// NOSONAR 
            }, 300)
            setmqttConnectionType(mqttDetail.mqtt_connection_type)// NOSONAR 
            setmqttKeepAlive(mqttDetail.mqtt_keepalive)// NOSONAR 
            setMQTTTLS(mqttDetail.mqtt_tls)// NOSONAR 
            setMQTTTLSVerifyDisable(mqttDetail.mqtt_tls_verify_disable)// NOSONAR 
            setretainFlag(mqttDetail.retain_flag)// NOSONAR 
            setqos(mqttDetail.qos.toString())// NOSONAR 

        }

    }, [props.mqttDetails])// NOSONAR 

    useEffect(() => {
        if (!IncertMqttDataLoading && IncertMqttDataData && !IncertMqttDataError) {
            console.log(IncertMqttDataData, "IncertMqttDataData")
            if (IncertMqttDataData&& IncertMqttDataData.data && IncertMqttDataData.data === "INCERTED") {
                setOpenSnack(true)
                SetType('success')
                SetMessage("MQTT Configuration  Successfull")
                props.MqttConfiguration()// NOSONAR 
                props.handleMQTTDialogClose()// NOSONAR 
            }

        }
    }, [IncertMqttDataLoading, IncertMqttDataData, IncertMqttDataError])

    useEffect(() => {
        if (!UpdateMqttDataLoading && UpdateMqttDataData && !UpdateMqttDataError) {
            // console.log(UpdateMqttDataData,"UpdateMqttDataData")
            if (UpdateMqttDataData.length > 0) {
                setOpenSnack(true)
                SetType('success')
                SetMessage("MQTT Configuration Updated Successfully")
                props.MqttConfiguration()// NOSONAR 
                props.handleMQTTDialogClose()// NOSONAR 
            }


        }
    }, [UpdateMqttDataLoading, UpdateMqttDataData, UpdateMqttDataError])


// NOSONAR - This function requires multiple parameters due to its specific use case.
    const handleSaveMQtt = () => {// NOSONAR 
        if (MQTTDataBaseRef.current.value === '') {
            setMQTTDataBase(true)
            return false
        } else {
            setMQTTDataBase(false)
        }

        if (ProjectNameRef.current.value === '') {
            setisProjectName(true)
            return false
        } else {
            setisProjectName(false)
        }

        if (SchemaBaseRef.current.value === '') {
            setisSchemaBase(true)
            return false
        } else {
            setisSchemaBase(false)
        }

        if (DataBaseRef.current.value === '') {
            setisDataBase(true)
            return false

        } else {
            setisDataBase(false)
        }

        if (EdgeUIDRef.current.value === '') {
            setisEdgeUID(true)
            return false

        } else {
            setisEdgeUID(false)
        }

        if (MQTTHostRef.current.value === '') {
            setisMQTTHost(true)
            return false

        } else {
            setisMQTTHost(false)
        }



        if (MQTTPortRef.current.value === '') {
            setisMQTTPort(true)
            return false

        } else {
            setisMQTTPort(false)
        }

        if(!mqttConnectionType){
            setisMQTTConnectionType(true)
            return false
        }else{
            setisMQTTConnectionType(false)
        }

        if (!mqttKeepAlive) {
            setisMQTTKeepAlive(true)
            return false

        } else {
            setisMQTTKeepAlive(false)
        }

        if (MQTTUserRef.current.value === '') {
            setisMQTTUser(true)
            return false

        } else {
            setisMQTTUser(false)
        }

        if (MQTTPassRef.current.value === '') {
            setisMQTTPass(true)
            return false

        } else {
            setisMQTTPass(false)
        }

        if (!MQTTTLS) {
            setisMQTTTLS(true)
            return false

        } else {
            setisMQTTTLS(false)
        }

        if (!MQTTTLSVerifyDisable) {
            setisMQTTTLSVerify(true)
            return false
        } else {
            setisMQTTTLSVerify(false)
        }

        if (MQTTWSPathRef.current.value === '') {
            setisMQTTWSPath(true)
            return false
        } else {
            setisMQTTWSPath(false)
        }

        if (MQTTAuthRef.current.value === '') {
            setisMQTTAuth(true)
            return false
        } else {
            setisMQTTAuth(false)
        }
        if (MQTTServerCARef.current.value === '') {
            setisMQTTServer(true)
            return false
        } else {
            setisMQTTServer(false)
        }


        if (MQTTUserCARef.current.value === '') {
            setisMQTTUserCA(true)
            return false
        } else {
            setisMQTTUserCA(false)
        }

        if (!qos) {
            setisQOS(true)
            return false
        } else {
            setisQOS(false)
        }


        let body = {
            data: {
                "id": 1,
                "mqttdatabase": MQTTDataBaseRef.current ? MQTTDataBaseRef.current.value : '',
                "schema": SchemaBaseRef.current ? SchemaBaseRef.current.value : '',
                "data": DataBaseRef.current ? DataBaseRef.current.value : "",
                "project_name": ProjectNameRef.current ? ProjectNameRef.current.value : '',
                "edgeUID": EdgeUIDRef.current ? EdgeUIDRef.current.value : '',
                "mqtt_connection_type": mqttConnectionType,
                "mqtt_host": MQTTHostRef.current ? MQTTHostRef.current.value : '',
                "mqtt_port": MQTTPortRef.current ? MQTTPortRef.current.value : '',
                "mqtt_keepalive": mqttKeepAlive,
                "mqtt_user": MQTTUserRef.current ? MQTTUserRef.current.value : '',
                "mqtt_pass": MQTTPassRef.current ? MQTTPassRef.current.value : '',
                "mqtt_tls": MQTTTLS,
                "mqtt_tls_verify_disable": MQTTTLSVerifyDisable,
                "mqtt_ws_path": MQTTWSPathRef.current ? MQTTWSPathRef.current.value : '',
                "mqtt_auth": MQTTAuthRef.current ? MQTTAuthRef.current.value : '',
                "mqtt_sever_ca": MQTTServerCARef.current ? MQTTServerCARef.current.value : '',
                "mqtt_user_ca": MQTTUserCARef.current ? MQTTUserCARef.current.value : '',
                "qos": Number(qos),
                "retain_flag": retainFlag

            },
            path: props.path,// NOSONAR 
            port:":5000/",
            endurl:"mqtt"
        }
        if (props.mqttDetails && props.mqttDetails.length > 0) {// NOSONAR 
            console.log(body, "body")
            body= {...body,selectionID:body.data.id.toString(),endurl:"mqtt/"}
            UpdateMqttData(body)
        } else {
            IncertMqttData(body)
        }

    }


    const handleRetainFlag = () => {
        setretainFlag(!retainFlag)
    }


    const handlemqttConnectionTypeChange = (e) => {
        setmqttConnectionType(e.target.value)
    }

    const handlemqttKeepAliveChange = (e) => {
        setmqttKeepAlive(e.target.value)
    }

    const handleMQTTTLSChange = (e) => {
        setMQTTTLS(e.target.value)
    }

    const handleMQTTTLSVerifyDisableChange = (e) => {
        setMQTTTLSVerifyDisable(e.target.value)
    }


    const handleqosChange = (e) => {
        setqos(e.target.value)
    }



    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value="MQTT Configuration" variant="heading-02-xs" />
            </ModalHeaderNDL>
            <ModalContentNDL>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={'MQTT Data Base '}
                        inputRef={MQTTDataBaseRef}
                        placeholder={"MQTT Data Base "}
                        error={isMQTTDataBase}
                        mandatory
                        helperText={isMQTTDataBase ? "Please enter the MQTT Data Base" : ''}
                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={'Project Name'}
                        inputRef={ProjectNameRef}
                        placeholder={'Project Name'}
                        error={isProjectName}
                        helperText={isProjectName ? "Please enter the Project Name" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"Schema"}
                        inputRef={SchemaBaseRef}
                        placeholder={"Schema"}
                        error={isSchemaBase}
                        helperText={isSchemaBase ? "Please enter the Schema" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"Data"}
                        inputRef={DataBaseRef}
                        placeholder={"Data"}
                        error={isDataBase}
                        helperText={isDataBase ? "Please enter the Data" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"Edge UID"}
                        inputRef={EdgeUIDRef}
                        placeholder={"Edge UID"}
                        error={isEdgeUID}
                        helperText={isEdgeUID ? "Please enter the Edge UID" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"MQTT Connection Type"}
                        value={mqttConnectionType}
                        options={[{ id: "tcp", name: "TCP" }, { id: "wss", name: "WSS" }]}
                        onChange={handlemqttConnectionTypeChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        error={isMQTTConnectionType}
                        msg={isMQTTConnectionType ? "Please Select MQTT Connection Type" : ''}
                      
                    />
                </div>

                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT Host"}
                        inputRef={MQTTHostRef}
                        placeholder={"MQTT Host"}
                        error={isMQTTHost}
                        helperText={isMQTTHost ? "Please enter the MQTT Host" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        type='number'
                        label={"MQTT Port"}
                        inputRef={MQTTPortRef}
                        placeholder={"MQTT Port"}
                        error={isMQTTPort}
                        helperText={isMQTTPort ? "Please enter the Mqtt Port" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"MQTT Keep Alive"}
                        value={mqttKeepAlive}
                        options={Array.from({ length: 120 }, (_, i) => ({ id: (i + 1).toString(), name: i + 1 }))}
                        onChange={handlemqttKeepAliveChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        noSorting
                        error={isMQTTKeepAlive}
                        msg={isMQTTKeepAlive ? "Please Select MQTT Keep Alive" : ''}
                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT User"}
                        inputRef={MQTTUserRef}
                        placeholder={"MQTT User"}
                        error={isMQTTUser}
                        helperText={isMQTTUser ? "Please enter the MQTT User" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT Pass"}
                        inputRef={MQTTPassRef}
                        placeholder={"MQTT Pass"}
                        error={isMQTTPass}
                        helperText={isMQTTPass ? 'Please enter the MQTT Pass' : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"MQTT TLS"}
                        value={MQTTTLS}
                        options={[{ id: "True", name: "True" }, { id: "False", name: "False" }]}
                        onChange={handleMQTTTLSChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        error={isMQTTTLS}
                        msg={isMQTTTLS ? "Please Select MQTT TLS" : ''}
                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"MQTT TLS Verify Disable"}
                        value={MQTTTLSVerifyDisable}
                        options={[{ id: "True", name: "True" }, { id: "False", name: "False" }]}
                        onChange={handleMQTTTLSVerifyDisableChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        error={isMQTTTLSVerify}
                        msg={isMQTTTLSVerify ? "Please Select MQTT TLS Verify Disable" : ''}
                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT WS Path"}
                        inputRef={MQTTWSPathRef}
                        placeholder={"MQTT WS Path"}
                        error={isMQTTWSPath}
                        helperText={isMQTTWSPath ? "Please enter the MQTT WS Path" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT Auth"}
                        inputRef={MQTTAuthRef}
                        placeholder={"MQTT Auth"}
                        error={isMQTTAuth}
                        helperText={isMQTTAuth ? "Please enter the MQTT Auth" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT Server CA"}
                        inputRef={MQTTServerCARef}
                        placeholder={"MQTT Server CA"}
                        error={isMQTTServer}
                        helperText={isMQTTServer ? "Please enter the MQTT Server CA" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="mqttDataBase"
                        label={"MQTT User CA"}
                        inputRef={MQTTUserCARef}
                        placeholder={"MQTT User CA"}
                        error={isMQTTUserCA}
                        helperText={isMQTTUserCA ? "Please enter the MQTT User CA" : ''}
                        mandatory

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Qos"}
                        value={qos}
                        options={Array.from({ length: 3 }, (_, i) => ({ id: i.toString(), name: i.toString() }))}
                        onChange={handleqosChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        error={isQOS}
                        noSorting
                        helperText={isQOS ? "Please Select Qos" : ''}
                    />
                </div>
                <div className="mb-3">
                    <CustomSwitch
                        onChange={handleRetainFlag}
                        checked={retainFlag}
                        primaryLabel="Retain Flag"
                        switch={false}
                    />
                </div>

            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" value="Cancel" onClick={() => props.handleMQTTDialogClose()} />
                <Button value="Update" onClick={handleSaveMQtt} />
            </ModalFooterNDL>
        </React.Fragment>


    )
}



export default MqttConfiguration;