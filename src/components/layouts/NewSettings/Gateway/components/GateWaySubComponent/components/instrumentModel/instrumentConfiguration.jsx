import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useCreateGateWayinstrumentConfig from "../instrumenthooks/useCreateInstrumentConfig";
import useUpdateGateWayinstrumentConfig from "../instrumenthooks/useUpdateIntruConfig";
import { useRecoilState } from "recoil";
import {  snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import useGetDeviceMake from "../instrumenthooks/useGetDropDownList";
import useGetRTUList from 'components/layouts/NewSettings/Gateway/components/GateWaySubComponent/components/RTUhooks/useGetRTUList.jsx'
import useGetTCPConfig from 'components/layouts/NewSettings/Gateway/components/GateWaySubComponent/components/TCPhooks/useGetTCPConfig'
import useIncertDeviceRunning from '../instrumenthooks/instrumentHooks/useIncertDeviceRunning'
import useUpdateDeviceRunning from '../instrumenthooks/instrumentHooks/useUpdateDeviceRunning'
import useDeleteDeviceRunning from '../instrumenthooks/instrumentHooks/useDeleteDeviceRunning'
const InstrumentConfiguration = forwardRef((props, ref) => {


  const instrumentName = useRef()
  const instrumentID = useRef()
  const slaveId = useRef()
  const make = useRef()
  const sensorName = useRef()
  const [enDis, setenDis] = useState("1")
  const [COMSettingID, setCOMSettingID] = useState(null)
  const [HostID, setHostID] = useState(null)
  const [ModelNumberID, setModelNumberID] = useState(null)
  const [isSlaveId, setisSlaveId] = useState(false)
  const [ismake, setismake] = useState(false)
  const [isHostId, setisHostId] = useState(false)
  const [isSensorName, setisSensorName] = useState(false)
  const [isCOMSettingID, setisCOMSettingID] = useState(false)
  const [isModelNumberID, setisModelNumberID] = useState(false)
  const [RTUList, setRTUList] = useState([])
  const [TCPList, setTCPList] = useState([])

  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [Editistrument, setEditistrument] = useState({ id: null, name: "" })
  const [isCreateOrEdit, setisCreateOrEdit] = useState(false)
  const [deviceMakeOption, setdeviceMakeOption] = useState([])
  const [protocol, setprotocol] = useState('tcp')
  const { CreateGateWayinstrumentConfigLoading, CreateGateWayinstrumentConfigData, CreateGateWayinstrumentConfigError, getCreateGaeWayinstrumentConfig } = useCreateGateWayinstrumentConfig()// NOSONAR 
  const { updateGateWayinstrumentConfigLoading, updateGateWayinstrumentConfigData, updateGateWayinstrumentConfigError, getUpdateGateWayinstrumentConfig } = useUpdateGateWayinstrumentConfig()// NOSONAR 
  const { RTUConfigurationLoading, RTUConfigurationData, RTUConfigurationError, getRTUConfiguration } = useGetRTUList()
  const { DeviceMakeLoading, DeviceMakeData, DeviceMakeError, getDeviceMake } = useGetDeviceMake()
  const { TCPConfigurationLoading, TCPConfigurationData, TCPConfigurationError, getTCPConfiguration } = useGetTCPConfig()
  const { IncertDeviceRunningLoading, IncertDeviceRunningData, IncertDeviceRunningError, IncertDeviceRunning } = useIncertDeviceRunning()
  const { UpdateDeviceRunningLoading, UpdateDeviceRunningData, UpdateDeviceRunningError, UpdateDeviceRunning } = useUpdateDeviceRunning()
  const { DeleteDeviceRunningLoading, DeleteDeviceRunningData, DeleteDeviceRunningError, DeleteDeviceRunning } = useDeleteDeviceRunning()


  useImperativeHandle(ref, () =>
  (
    {
      handleFormulaCrudDialogEdit: (id, data) => {
        handleOpenEditDialogue(id, data)
      },
      handleFormulaCrudDialogDelete: (id, data) => {
        handleOpenDeleteDialogue(data)
      },
    }
  )
  )


  useEffect(() => {
    getRTUConfiguration({ path: props.path,port:":5000/",endurl:"rtu/connections/" })// NOSONAR 
    getTCPConfiguration({ path: props.path,port:":5000/",endurl:"tcp/connections/"  })// NOSONAR 
    // getDeviceMake({ path: props.path, protocol: protocol })
  }, [props.path])// NOSONAR 

  useEffect(() => {
    getDeviceMake({ path: props.path, protocol: protocol,port:":5000/",endurl:"/device_makes" })// NOSONAR 
  }, [protocol])



  useEffect(() => {
    if (!updateGateWayinstrumentConfigLoading && updateGateWayinstrumentConfigData && !updateGateWayinstrumentConfigError) {
      console.log(updateGateWayinstrumentConfigData, "updateGateWayinstrumentConfigData")
      if (updateGateWayinstrumentConfigData.affected_rows > 0) {
        setOpenSnack(true)
        SetType('success')
        SetMessage("Gateway Instrument Configuration Updated Successfully")
        props.getGateWayInstrumentConfig()// NOSONAR 
        props.handleInstrumentDialogClose()// NOSONAR 
      }
    }

  }, [updateGateWayinstrumentConfigLoading, updateGateWayinstrumentConfigData, updateGateWayinstrumentConfigError])


  useEffect(() => {
    if (!CreateGateWayinstrumentConfigLoading && CreateGateWayinstrumentConfigData && !CreateGateWayinstrumentConfigError) {
      if (CreateGateWayinstrumentConfigData.affected_rows > 0) {
        setOpenSnack(true)
        SetType('success')
        SetMessage("Gateway Instrument Configuration Updated Successfully")
        props.getGateWayInstrumentConfig()// NOSONAR 
        props.handleInstrumentDialogClose()// NOSONAR 
      }
    }

  }, [CreateGateWayinstrumentConfigLoading, CreateGateWayinstrumentConfigData, CreateGateWayinstrumentConfigError])


  useEffect(() => {
    if (!RTUConfigurationLoading && RTUConfigurationData && !RTUConfigurationError) {
      console.log(RTUConfigurationData, "RTUConfigurationData")
      if (RTUConfigurationData.length > 0) {
        setRTUList(RTUConfigurationData.map((x) => {
          return { id: x.COM_setting, name: x.COM_setting }

        }))
      }
    }

  }, [RTUConfigurationLoading, RTUConfigurationData, RTUConfigurationError])

  useEffect(() => {
    if (!TCPConfigurationLoading && TCPConfigurationData && !TCPConfigurationError) {
      console.log(TCPConfigurationData, "TCPConfigurationData")
      if (TCPConfigurationData.length > 0) {
        setTCPList(TCPConfigurationData.map((x) => {
          return { id: x.id, name: x.Host }
        }))
      }
    }
  }, [TCPConfigurationLoading, TCPConfigurationData, TCPConfigurationError])

  useEffect(() => {
    if (!DeviceMakeLoading && DeviceMakeData && !DeviceMakeError) {
      console.log(DeviceMakeData, "DeviceMakeData")
      if (DeviceMakeData && Array.isArray(DeviceMakeData) && DeviceMakeData.length > 0) {
        setdeviceMakeOption(DeviceMakeData.map(x => { return { id: x.Model_number, name: x.Model_number } }))
      }
    }
  }, [DeviceMakeLoading, DeviceMakeData, DeviceMakeError])

  useEffect(() => {
    if (!IncertDeviceRunningLoading && IncertDeviceRunningData && !IncertDeviceRunningError) {
      console.log(IncertDeviceRunningData, 'IncertDeviceRunningData')
      // console.log(IncertRTUDataData, "IncertRTUDataData")
      if (IncertDeviceRunningData && IncertDeviceRunningData.data && IncertDeviceRunningData.data === "INCERTED") {
        setOpenSnack(true)
        SetMessage("Connection Created Successfully")
        SetType('success')
        props.getGateWayInstrumentConfig()// NOSONAR 
        props.handleInstrumentDialogClose()// NOSONAR 

      }

    }
  }, [IncertDeviceRunningLoading, IncertDeviceRunningData, IncertDeviceRunningError])

  useEffect(() => {
    if (!UpdateDeviceRunningLoading && UpdateDeviceRunningData && !UpdateDeviceRunningError) {
      console.log(UpdateDeviceRunningData, "UpdateDeviceRunningData")
      if (UpdateDeviceRunningData && UpdateDeviceRunningData.data && UpdateDeviceRunningData.data === "Updated") {
        setOpenSnack(true)
        SetMessage("Connection Updated Successfully")
        SetType('success')
        props.getGateWayInstrumentConfig()// NOSONAR 
        props.handleInstrumentDialogClose()// NOSONAR 

      }

    }
  }, [UpdateDeviceRunningLoading, UpdateDeviceRunningData, UpdateDeviceRunningError])

  useEffect(() => {
    if (!DeleteDeviceRunningLoading && DeleteDeviceRunningData && !DeleteDeviceRunningError) {
      console.log(DeleteDeviceRunningData, "DeleteDeviceRunningData")
      if (DeleteDeviceRunningData && DeleteDeviceRunningData.data && DeleteDeviceRunningData.data === "Deleted") {
        setOpenSnack(true)
        SetMessage("Connection Deleted Successfully")
        SetType('success')
        props.getGateWayInstrumentConfig()// NOSONAR 
        props.handleInstrumentDialogClose()// NOSONAR 

      }

    }
  }, [DeleteDeviceRunningLoading, DeleteDeviceRunningData, DeleteDeviceRunningError])



  const handleOpenDeleteDialogue = (data) => {
    setEditistrument({ id:data.id, name: data.name })
    if (data.protocol) {
      setprotocol(data.protocol)
    }

  }

  const handleEndis = (e) => {
    setenDis(e.target.value)
  }

  const handleOpenEditDialogue = (id, data) => {
    console.log(data, "data.id")
    setEditistrument({ id: data.id, name: data.name })
    if (data.protocol) {
      setprotocol(data.protocol)
    }

    

    setTimeout(() => {
      instrumentID.current.value = data.id
      instrumentName.current.value = data.name
    }, 300)

   
    if (data.config && Object.keys(data.config).length > 0) {
      const result = data.config.En_dis != null 
      ? (data.config.En_dis === true ? "1" : "0") // NOSONAR 
      : undefined;
      setisCreateOrEdit(true)
      setTimeout(() => {
        slaveId.current.value = data.config.Slave_ID
        make.current.value = data.config.Make
        sensorName.current.value = data.config.Sensor_name
      }, 300)
     
      setenDis(result)
      if (data.protocol === 'rtu') {
        setCOMSettingID(data.config.COM_setting)
      } else {
        setHostID(data.config.Host)
      }
      setModelNumberID(data.config.Model_number)

    }


  }


  const handleMobileId = (e) => {
    setModelNumberID(e.target.value)
    const MakeName = DeviceMakeData.find(x => x.Model_number === e.target.value)
    setTimeout(() => {
      make.current.value = MakeName.Make
    }, 300)
  }

  const handleComSettings = (e) => {
    setCOMSettingID(e.target.value)
  }
// NOSONAR - This function requires multiple parameters due to its specific use case.
  const handleUpdateInstrument = () => {// NOSONAR 

    if (props.dialogMode === 'delete') {// NOSONAR 
      DeleteDeviceRunning({ path: props.path, protocol: protocol, selectionID: Editistrument.id,   port:":5000/",endurl:"/devices_running/" })// NOSONAR 
      return
    }

    if (slaveId.current.value === "") {
      setisSlaveId(true)
      return false
    } else {
      setisSlaveId(false)

    }
    if(sensorName.current.value === ''){
      setisSensorName(true)
      return false
    }else{
      setisSensorName(false)
    }
    
   

    if (!COMSettingID && protocol === 'rtu') {
      setisCOMSettingID(true)
      return false
    } else {
      setisCOMSettingID(false)

    }

    if (!HostID && protocol === 'tcp') {
      setisHostId(true)
      return false
    } else {
      setisHostId(false)
    }

    if (!ModelNumberID) {
      setisModelNumberID(true)
      return false
    } else {
      setisModelNumberID(false)
    }

    if (make.current.value === "") {
      setismake(true)
      return false
    } else {
      setismake(false)
    }

    let body
    if (isCreateOrEdit) {
      body = {
        // com_setting_id:COMSettingID,
        // updated_by:currUser.id,
        En_dis: enDis === "1" ? true : false,// NOSONAR 
        // gateway_id: props.GateWayId,
        MQTT_IID: Editistrument.id,
        Make: make.current ? make.current.value : '',
        Model_number: ModelNumberID,
        Sensor_name: sensorName.current ? sensorName.current.value : '',
        Slave_ID: slaveId.current ? Number(slaveId.current.value) : ''
      }
      if (protocol === 'tcp') {
        body = { ...body, Host: HostID }
      } else {
        body = { ...body, COM_setting: COMSettingID }
      }
      UpdateDeviceRunning({ protocol: protocol, data: body, path: props.path,selectionID:Editistrument.id,port:":5000/",endurl: "/devices_running/" })// NOSONAR 
      // getUpdateGateWayinstrumentConfig(body)
    } else {
      body = {
        // com_setting_id:COMSettingID,
        // created_by:currUser.id,
        En_dis:  enDis === "1" ? true : false,// NOSONAR 
        // mqtt_id:MQTTID.current ? MQTTID.current.value :"", 
        // gateway_id: props.GateWayId,
        MQTT_IID: Editistrument.id,
        Make: make.current ? make.current.value : '',
        Sensor_name: sensorName.current ? sensorName.current.value : '',
        Model_number: ModelNumberID,
        Slave_ID: slaveId.current ? Number(slaveId.current.value) : ''
      }
      if (protocol === 'tcp') {
        body = { ...body, Host: HostID }
      } else {
        body = { ...body, COM_setting: COMSettingID }
      }
      IncertDeviceRunning({ protocol: protocol, data: body, path: props.path,port:":5000/",endurl:"/devices_running/"})// NOSONAR 
    }






  }

  const handleProtocol = (e) => {
    setprotocol(e.target.value)
    setTimeout(()=>{
      make.current.value = ''
    })

  }

  const handleHost = (e) => {
    setHostID(e.target.value)
  }

  return (
    <React.Fragment>
      <ModalHeaderNDL>
        <TypographyNDL value={props.dialogMode === 'delete' ? "Delete Connection" : "Instrument Configuration"} variant="heading-02-xs" />
      </ModalHeaderNDL>
      <ModalContentNDL>
        {
          props.dialogMode === 'delete' ?
            <TypographyNDL color='secondary' value={'Are you sure you want to delete this protocol? This action cannot be undone and will remove all associated data.'} variant="paragraph-s" />
            :
            <React.Fragment>
              <div className="mb-3">
                <InputFieldNDL
                  id="InstrumentDataBase"
                  label={'Instrument Name'}
                  inputRef={instrumentName}
                  placeholder={"Instrument Name"}
                  error={false}
                  disabled
                  mandatory
                />
              </div>
              <div className="mb-3">
                <InputFieldNDL
                  id="InstrumentDataBase"
                  label={"MQTT ID"}
                  inputRef={instrumentID}
                  disabled
                  placeholder={"MQTT ID"}
                  mandatory

                />
              </div>
              <div className="mb-3">
                <SelectBox
                  labelId="FilterAlarmName"
                  id="Filter-AlarmName"
                  label={"Protocol"}
                  value={protocol}
                  options={[{ id: "tcp", name: "TCP" }, { id: "rtu", name: "RTU" }]}
                  onChange={(e) => handleProtocol(e)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  disabled={isCreateOrEdit}
                  keyValue="name"
                  keyId="id"

                />
              </div>
              <div className="mb-3">
                <InputFieldNDL
                  id="InstrumentDataBase"
                  label={"Slave ID"}
                  inputRef={slaveId}
                  type='number'
                  placeholder={"Slave ID"}
                  error={isSlaveId}
                  helperText={isSlaveId ? 'Please Enter Slave ID' : ''}
                  mandatory

                />
              </div>

              <div className="mb-3">
                <InputFieldNDL
                  id="InstrumentDataBase"
                  label={"Sensor Name"}
                  inputRef={sensorName}
                  placeholder={"Sensor Name"}
                  error={isSensorName}
                  helperText={isSensorName ? 'Please Enter Sensor Name' : ''}
                  mandatory

                />
              </div>
              
              <div className="mb-3">
                <SelectBox
                  labelId="FilterAlarmName"
                  id="Filter-AlarmName"
                  label={"En Dis"}
                  value={enDis}
                  options={[{ id: "0", name: "0" }, { id: '1', name: "1" }]}
                  onChange={(e) => handleEndis(e)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  keyValue="name"
                  keyId="id"

                />
              </div>
              {
                protocol === 'tcp' ?
                  <div className="mb-3">
                    <SelectBox
                      labelId="FilterAlarmName"
                      id="Filter-AlarmName"
                      label={"Host ID"}
                      value={HostID}
                      options={TCPList}
                      onChange={(e) => handleHost(e)}
                      multiple={false}
                      isMArray={true}
                      auto={false}
                      keyValue="name"
                      keyId="id"
                      error={isHostId}
                      msg={"Please Select Host ID"}
                    />
                  </div>
                  :
                  <div className="mb-3">
                    <SelectBox
                      labelId="FilterAlarmName"
                      id="Filter-AlarmName"
                      label={"COM Setting ID"}
                      value={COMSettingID}
                      options={RTUList}
                      onChange={(e) => handleComSettings(e)}
                      multiple={false}
                      isMArray={true}
                      auto={false}
                      keyValue="name"
                      keyId="id"
                      error={isCOMSettingID}
                      msg={"Please Select COM Setting ID"}
                    />
                  </div>

              }


              <div className="mb-3">
                <SelectBox
                  labelId="FilterAlarmName"
                  id="Filter-AlarmName"
                  label={"Model Number ID"}
                  value={ModelNumberID}
                  options={deviceMakeOption}
                  onChange={(e) => handleMobileId(e)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  keyValue="name"
                  keyId="id"
                  error={isModelNumberID}
                  msg={"Please Select Model Number ID"}
                />
              </div>
              <div className="mb-3">
                <InputFieldNDL
                  id="InstrumentDataBase"
                  label={"Make"}
                  inputRef={make}
                  disabled
                  placeholder={"Make"}
                  error={ismake}
                  helperText={ismake ? 'Please Enter Make' : ''}
                  mandatory
                />
              </div>
            </React.Fragment>

        }




      </ModalContentNDL>
      <ModalFooterNDL>
        <Button type="secondary" value="Cancel" onClick={() => props.handleInstrumentDialogClose()} />
        <Button value={props.dialogMode === 'delete' ? 'Delete' : "Update"} loading={IncertDeviceRunningLoading || UpdateDeviceRunningLoading || DeleteDeviceRunningLoading } danger={props.dialogMode === 'delete'}  onClick={handleUpdateInstrument} />
      </ModalFooterNDL>

    </React.Fragment>


  )
})



export default InstrumentConfiguration;