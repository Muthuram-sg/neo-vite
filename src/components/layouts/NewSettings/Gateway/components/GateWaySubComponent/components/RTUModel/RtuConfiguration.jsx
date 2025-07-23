import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, } from "react";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import useIncertRTUConfig from '../RTUhooks/useIncertRTUConfig'
import useupdateRTUConfig from '../RTUhooks/useUpdateRTUConfig'
import useDeleteRTUConfig from '../RTUhooks/useDeleteRTUList'
import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType } from "recoilStore/atoms";




// NOSONAR - This function requires multiple parameters due to its specific use case.
const RTUConfiguration = forwardRef((props, ref) => {//NOSONAR
    const HardwareNameRef = useRef()
    const [com1, setcom1] = useState('')
    const [StopBite, setStopBite] = useState('')
    const [ByteSize, setByteSize] = useState('')
    const [parity, setparity] = useState('')
    const [Baudrate, setBaudrate] = useState('')
    const [timeOute, settimeOute] = useState('')
    const [poolingTime, setpoolingTime] = useState('')
    const [PublishMethod, setPublishMethod] = useState('')
    const [EnableOrDisable, setEnableOrDisable] = useState(true)

    const [iscom1, setiscom1] = useState(false)
    const [isStopBite, setisStopBite] = useState(false)
    const [isByteSize, setisByteSize] = useState(false)
    const [isparity, setisparity] = useState(false)
    const [isBaudrate, setisBaudrate] = useState(false)
    const [istimeOute, setistimeOute] = useState(false)
    const [ispoolingTime, setispoolingTime] = useState(false)
    const [isPublishMethod, setisPublishMethod] = useState(false)
    const [isHardwareName, setisHardwareName] = useState(false)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [selectedid,setSelectedID] = useState('')//NOSONAR

    const { IncertRTUDataLoading, IncertRTUDataData, IncertRTUDataError, IncertRTUData } = useIncertRTUConfig()
    const { UpdateRTUDataLoading, UpdateRTUDataData, UpdateRTUDataError, UpdateRTUData } = useupdateRTUConfig()
    const { DeleteRTUDataLoading, DeleteRTUDataData, DeleteRTUDataError, DeleteRTUData } = useDeleteRTUConfig()







    useImperativeHandle(ref, () =>
    (
        {
            handleRTUDialogEdit: (id, value) => handleEditOpen(id, value),
            handleRTUDialogDelete:(id,value)=>setSelectedID(value.COM_setting)
        }
    )
    )

    useEffect(() => {
        if (!IncertRTUDataLoading && IncertRTUDataData && !IncertRTUDataError) {
            console.log(IncertRTUDataData, "IncertRTUDataData")
            if(IncertRTUDataData && IncertRTUDataData.data &&  IncertRTUDataData.data === "INCERTED"  ){
                setOpenSnack(true)
                SetMessage("RTU Connection Incerted Successfully")
                SetType('success')
                props.TriggerRTU()//NOSONAR
                props.handleRTUDialogClose()//NOSONAR

            }
           

        }
    }, [IncertRTUDataLoading, IncertRTUDataData, IncertRTUDataError])


    useEffect(() => {
        if (!UpdateRTUDataLoading &&  UpdateRTUDataData &&  !UpdateRTUDataError) {
            console.log(UpdateRTUDataData, "UpdateRTUDataData")
            if(UpdateRTUDataData && UpdateRTUDataData.data &&  UpdateRTUDataData.data === "Updated"  ){
                setOpenSnack(true)
                SetMessage("RTU Connection Updated Successfully")
                SetType('success')
                props.TriggerRTU()//NOSONAR
                props.handleRTUDialogClose()//NOSONAR

            }
           

        }
    }, [UpdateRTUDataLoading, UpdateRTUDataData, UpdateRTUDataError])


    useEffect(()=>{
        if (!DeleteRTUDataLoading&&  DeleteRTUDataData && !DeleteRTUDataError) {
            console.log(DeleteRTUDataData, "UpdateRTUDataData")
            if(DeleteRTUDataData && DeleteRTUDataData.data &&  DeleteRTUDataData.data === "Deleted"  ){
                setOpenSnack(true)
                SetMessage("RTU Connection Deleted Successfully")
                SetType('success')
                props.TriggerRTU()//NOSONAR
                props.handleRTUDialogClose()//NOSONAR

            }
           

        }
    },[DeleteRTUDataLoading, DeleteRTUDataData, DeleteRTUDataError])

    const comArray = Array.from({ length: 22 }, (_, i) => `Com${i + 1}`);
    let  usbList = [
        "/dev/ttyUSB0",
        "/dev/ttyUSB1",
        "/dev/ttyUSB2",
        "/dev/ttyUSB3",
        "/dev/ttyUSB4",
        "/dev/ttyUSB5",
        "/dev/ttyUSB6",
        "/dev/ttyUSB_DEVICE1",
        "/dev/ttyUSB_DEVICE2",
        "/dev/ttyUSB_DEVICE3",
        "/dev/ttyUSB_DEVICE4",
        "/dev/ttyUSB_DEVICE5",
        "/dev/ttyUSB_DEVICE6",
        ...comArray,
    ]
    if(props.openDialogMode !== 'edit'){//NOSONAR
        usbList = usbList.filter(x=>!props.removedCom.includes(x))//NOSONAR
    }

    const Com1Option = usbList.map(item => ({
        id: item,
        name: item
    }));


    const BaudrateOption = [
        { id: 2400, name: 2400 },
        { id: 4800, name: 4800 },
        { id: 9600, name: 9600 },
        { id: 19200, name: 19200 },
        { id: 38400, name: 38400 },
        { id: 57600, name: 57600 },
        { id: 115200, name: 115200 },
        { id: 128000, name: 128000 },
        { id: 256000, name: 256000 }
    ]

    const handleCOM1Change = (e) => {
        setcom1(e.target.value)
    }
    const handleStopBitChange = (e) => {
        setStopBite(e.target.value)
    }
    const handleByteSizeChange = (e) => {
        setByteSize(e.target.value)
    }
    const handleParityChange = (e) => {
        setparity(e.target.value)
    }
    const handleBaudrateChange = (e) => {
        setBaudrate(e.target.value)
    }
    const handleTimeOutChange = (e) => {
        settimeOute(e.target.value)
    }
    const handlePoolingTimeChange = (e) => {
        setpoolingTime(e.target.value)
    }
    const handlePublishMethodChange = (e) => {
        setPublishMethod(e.target.value)

    }

    const handleEditOpen = (id, data) => {
        console.log(data, "data")
        setTimeout(() => {
            HardwareNameRef.current.value = data.Hardware_name

        }, 300)
        setcom1(data.COM_setting)
        setStopBite(data.Stop_bits)
        setByteSize(data.Data_Bits)
        setparity(data.Parity)
        setBaudrate(data.Baud_rate)
        settimeOute(data.Timeout)
        setpoolingTime(data.Polling_Time)
        setPublishMethod(data.Polling_method)
        setEnableOrDisable(data.En_Dis)
    }
// NOSONAR - This function requires multiple parameters due to its specific use case.
    const handleSaveRtu = () => {//NOSONAR
       
       if(props.openDialogMode === "delete"){//NOSONAR
        DeleteRTUData({
            selectionID:selectedid,
            path:props.path,//NOSONAR
            port:":5000/",endurl:"rtu/connections/"
        } )
        return false
       } 

        if (HardwareNameRef.current.value === '') {
            setisHardwareName(true)
            return false
        } else {
            setisHardwareName(false)
        }
        if (!com1) {
            setiscom1(true)
            return false
        } else {
            setiscom1(false)
        }
        if (!StopBite) {
            setisStopBite(true)
            return false
        } else {
            setisStopBite(false)
        }
        if (!ByteSize) {
            setisByteSize(true)
            return false
        } else {
            setisByteSize(false)
        }
        if (!parity) {
            setisparity(true)
            return false
        } else {
            setisparity(false)
        }
        if (!Baudrate) {
            setisBaudrate(true)
            return false
        } else {
            setisBaudrate(false)
        }
        if (!timeOute) {
            setistimeOute(true)
            return false
        } else {
            setistimeOute(false)
        }
        if (!poolingTime) {
            setispoolingTime(true)
            return false
        } else {
            setispoolingTime(false)
        }
        if (!PublishMethod) {
            setisPublishMethod(true)
            return false
        } else {
            setisPublishMethod(false)

        }

        let body = {
            data: [{
                "COM_setting": com1,
                "Hardware_name": HardwareNameRef.current ? HardwareNameRef.current.value : '',
                "Stop_bits": StopBite,
                "Data_Bits": ByteSize,
                "Parity": parity,
                "Baud_rate": Baudrate,
                "Polling_Time": poolingTime,
                "Timeout": timeOute,
                "En_Dis": EnableOrDisable,
                "Polling_method": PublishMethod
            }],
            path: props.path,//NOSONAR
            port:":5000/",
            endurl:"rtu/connections/"

        }
        if (props.openDialogMode === "create") {//NOSONAR
            body = body//NOSONAR
            IncertRTUData(body)
        } else if (props.openDialogMode === "edit") {//NOSONAR
            body = {...body,data:body.data[0],port:":5000/",endurl:"rtu/connections/",selectionID:body.data[0].COM_setting}
            UpdateRTUData(body)
        }
            

        }
    




    const handleEnableDisable = () => {
        setEnableOrDisable(!EnableOrDisable)
    }


const renderModelHeader =()=>{

    if (props.openDialogMode === "create") {//NOSONAR
        return "New Connection"
       
    } else if (props.openDialogMode === "edit") {//NOSONAR
        return "Edit Connection"
    } else {
        return "Delete Connection"
    }
}


const renderButtonText =()=>{
    if (props.openDialogMode === "create") {//NOSONAR
        return "Save"
       
    } else if (props.openDialogMode === "edit") {//NOSONAR
        return "Update"
    } else {
        return "Delete"
    }
}


const renderButtonType=()=>{
    // NOSONAR - This function requires multiple parameters due to its specific use case.

    if (props.openDialogMode === "delete") {//NOSONAR
        return true
    } else{
        return false
    } 
}




    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value={renderModelHeader()} variant="heading-02-xs" />
            </ModalHeaderNDL>
            <ModalContentNDL>

                {
                    props.openDialogMode === "delete" ? 
                    <TypographyNDL color="secondary" value='Are you sure you want to delete the connection? This action cannot be undone and will remove all associated data.' variant="paragraph-s" />


                    :
                    <React.Fragment>

                      <div className="mb-3">
                    <InputFieldNDL
                        id="RTUDataBase"
                        label={'Hardware Name'}
                        inputRef={HardwareNameRef}
                        placeholder={"Hardware Name"}
                        error={isHardwareName}
                        mandatory
                        helperText={isHardwareName ? "Please Enter Hardware Name" : ''}
                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Port"}
                        value={com1}
                        options={Com1Option}
                        onChange={handleCOM1Change}
                        noSorting
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        disabled={props.openDialogMode === 'edit'  ? true : false}//NOSONAR
                        error={iscom1}
                        msg={iscom1 ? "Please Select Port" : ''}
                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Stop Bit"}
                        value={StopBite}
                        options={[{ id: 1, name: 1 }, { id: 2, name: 2 }]}
                        onChange={handleStopBitChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={isStopBite}
                        msg={isStopBite ? "Please Select Stop Bit" : ''}

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Byte Size"}
                        value={ByteSize}
                        options={[{ id: 7, name: 7 }, { id: 8, name: 8 }]}
                        onChange={handleByteSizeChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={isByteSize}
                        msg={isByteSize ? "Please Select Byte Size" : ''}

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Parity"}
                        value={parity}
                        options={[{ id: "O", name: "O" }, { id: "E", name: "E" }, { id: "N", name: "N" }]}
                        onChange={handleParityChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={isparity}
                        msg={isparity ? "Please Select Parity" : ''}

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Baudrate"}
                        value={Baudrate}
                        options={BaudrateOption}
                        onChange={handleBaudrateChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={isBaudrate}
                        noSorting
                        msg={isBaudrate ? "Please Select Baudrate" : ''}

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Timeout"}
                        value={timeOute}
                        options={Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: i + 1 }))}
                        onChange={handleTimeOutChange}
                        noSorting
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={istimeOute}
                        msg={istimeOute ? "Please Select Timeout" : ''}

                    />
                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={'Polling Time'}
                        value={poolingTime}
                        options={Array.from({ length: 120 }, (_, i) => ({ id: i + 1, name: i + 1 }))}
                        onChange={handlePoolingTimeChange}
                        noSorting
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={ispoolingTime}
                        msg={ispoolingTime ? "Please Select Polling Time " : ''}

                    />

                </div>
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Publish Methods"}
                        value={PublishMethod}
                        options={[{ id: "polling", name: "polling" }, { id: "ondatachange", name: "ondatachange" }]}
                        onChange={handlePublishMethodChange}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={isPublishMethod}
                        msg={isPublishMethod ? "Please Select Publish Methods" : ''}

                    />
                </div>
                <div className="mb-3">
                    <CustomSwitch
                        onChange={handleEnableDisable}
                        checked={EnableOrDisable}
                        primaryLabel="Enable/Disable"
                        switch={false}
                    />
                </div>
                </React.Fragment>

                }
              
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" value="Cancel" onClick={() => props.handleRTUDialogClose()} />
                <Button value={renderButtonText()} loading={IncertRTUDataLoading || UpdateRTUDataLoading || DeleteRTUDataLoading } danger={renderButtonType()} onClick={() => handleSaveRtu()} />
            </ModalFooterNDL>
        </React.Fragment>


    )



})


export default RTUConfiguration