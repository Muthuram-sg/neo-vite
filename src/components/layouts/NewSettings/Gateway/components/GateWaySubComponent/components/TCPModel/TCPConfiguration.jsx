import React, { useEffect, useRef, useState,useImperativeHandle,forwardRef } from "react";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import useIncertTCPData from "../TCPhooks/useIncertTCPConfig";
import useUpdateTCPData from "../TCPhooks/useUpdateTCPConfig";
import useDeleteTCpConfig from '../TCPhooks/useDeleteTCPConfig'
import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType } from "recoilStore/atoms";




const RTUConfiguration = forwardRef((props,ref) => {


    const HardwareName = useRef()
    const IPAddress = useRef()
    const Port = useRef()
    const [status,setstatus] = useState(true)
    const [PublishMethods,setPublishMethods] = useState('')
    const [timeOute, settimeOute] = useState('')
    
   const [isHardwareName,setisHardwareName] = useState(false)
   const [isIPAddress,setisIPAddress] = useState(false)
   const [isPort,setisPort] = useState(false)
   const [isPollingTime,setisPollingTime] = useState(false)
   const [isTimeOut,setisTimeOut] = useState(false)
   const [isPublishMethods,setisPublishMethods] = useState(false)
   const [selectedId,setselectedId] = useState('')
   const {IncertTCPDataLoading, IncertTCPDataData, IncertTCPDataError, IncertTCPData} = useIncertTCPData()
   const {UpdateTCPDataLoading, UpdateTCPDataData, UpdateTCPDataError, UpdateTCPData} = useUpdateTCPData()
   const {DeleteTCPDataLoading, DeleteTCPDataData, DeleteTCPDataError, DeleteTCPData} =useDeleteTCpConfig()
   const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [poolingTime, setpoolingTime] = useState('')


   useImperativeHandle(ref, () =>
    (
        {
           
            handleTCPDialogEdit:(id,value)=>{
               handleEditOpen(id,value)
            },
            handleTCPDialogDelete:(id,value)=>setselectedId(value.id),

        }
    )
    )

    useEffect(() => {
        if (!IncertTCPDataLoading && IncertTCPDataData && !IncertTCPDataError) {
            console.log(IncertTCPDataData, "IncertTCPDataData")
            if(IncertTCPDataData && IncertTCPDataData.data &&  IncertTCPDataData.data === "INCERTED"  ){
                setOpenSnack(true)
                SetMessage("TCP Connection Incerted Successfully")
                SetType('success')
                props.TriggerTCP()//NOSONAR
                props.handleTCPDialogClose()//NOSONAR

            }
           

        }
    }, [IncertTCPDataLoading, IncertTCPDataData, IncertTCPDataError])

    useEffect(()=>{
        if(!DeleteTCPDataLoading &&  DeleteTCPDataData &&  !DeleteTCPDataError){
            if(DeleteTCPDataData && DeleteTCPDataData.data &&  DeleteTCPDataData.data === "Deleted"  ){
                setOpenSnack(true)
                SetMessage("TCP Connection Deleted Successfully")
                SetType('success')
                props.TriggerTCP()//NOSONAR
                props.handleTCPDialogClose()//NOSONAR

            }
        }
    },[DeleteTCPDataLoading, DeleteTCPDataData, DeleteTCPDataError])


    useEffect(() => {
        if (!UpdateTCPDataLoading &&  UpdateTCPDataData &&  !UpdateTCPDataError) {
            console.log(UpdateTCPDataData, "UpdateTCPDataData")
            if(UpdateTCPDataData && UpdateTCPDataData.data &&  UpdateTCPDataData.data === "Updated"  ){
                setOpenSnack(true)
                SetMessage("TCP Connection Updated Successfully")
                SetType('success')
                props.TriggerTCP()
                props.handleTCPDialogClose()

            }
           

        }
    }, [UpdateTCPDataLoading, UpdateTCPDataData, UpdateTCPDataError])



    const handlePublishMethod=(e)=>{
        setPublishMethods(e.target.value)
    }
// NOSONAR - This function requires multiple parameters due to its specific use case.
    const handleSaveTcp=()=>{//NOSONAR
        if (props.openDialogMode === "delete") {//NOSONAR
            DeleteTCPData({selectionID:selectedId,path:props.path,port:":5000/",endurl:"tcp/connections/"})//NOSONAR
            return false
        }
        if(HardwareName.current.value === ''){
            setisHardwareName(true)
            return false
        }else{
            setisHardwareName(false)
        }
        if(IPAddress.current.value === ''){
            setisIPAddress(true)
            return false
        }else{
            setisIPAddress(false)
        }
        if(Port.current.value === ''){
            setisPort(true)
            return false
        }else{
            setisPort(false)
        }
        if(!poolingTime){
            setisPollingTime(true)
            return false
        }else{
            setisPollingTime(false)
        }
        if(!timeOute){
            setisTimeOut(true)
            return false
        }else{
            setisTimeOut(false)
        }

        if(!PublishMethods){
            setisPublishMethods(true)
            return false
        }else{
            setisPublishMethods(false)
        }
    let body={data:[{
        "Host": IPAddress.current ? IPAddress.current.value : '' ,
        "Hardware_name": HardwareName.current ? HardwareName.current.value : '',
        "Port":Port.current ? Number(Port.current.value) : '' ,
        "Polling_Time":Number(poolingTime),
        "Timeout": timeOute ? Number(timeOute) :'' ,
        "En_Dis": status,
        "Polling_method": PublishMethods
    }],
path:props.path,//NOSONAR
port:":5000/",
            endurl:"tcp/connections/"

}

    if (props.openDialogMode === "create") {//NOSONAR
        IncertTCPData(body)
    } else if (props.openDialogMode === "edit") {//NOSONAR
        body={...body,data:{...body.data[0],id:selectedId},selectionID:selectedId}
        UpdateTCPData(body)
    }
        




    }
    const handleEnableDisable=()=>{
        setstatus(!status)
    }

    const handleEditOpen=(id,value)=>{
        console.log(value.Polling_Time,"value.Polling_Time")
        setselectedId(value.id)
        setTimeout(()=>{
            HardwareName.current.value = value.Hardware_name
            IPAddress.current.value = value.Host
            Port.current.value = value.Port
            // PollingTime.current.value = value.Polling_Time
            // TimeOut.current.value = value.Timeout
        },300)
        settimeOute(value.Timeout)
        setpoolingTime(value.Polling_Time)
        setstatus(value.En_Dis)
        setPublishMethods(value.Polling_method)
    }

    const renderHeading=()=>{
        if(props.openDialogMode === 'delete'){//NOSONAR
            return "Delete Connection"
        }else if(props.openDialogMode === 'edit'){//NOSONAR
            return "Edit Connection"
        }else{
            return "New Connection"
        }
    }

    const renderButtonValue =()=>{
        if(props.openDialogMode === 'delete'){//NOSONAR
            return "Delete"
        }else if(props.openDialogMode === 'edit'){//NOSONAR
            return "Update"
        }else{
            return "Save"
        }
    }


    const handlePoolingTimeChange = (e) => {
        setpoolingTime(e.target.value)
    }

    const handleTimeOutChange=(e)=>{
        settimeOute(e.target.value)

    }
    
    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value={renderHeading()} variant="heading-02-xs" />
            </ModalHeaderNDL>
            <ModalContentNDL>
                {
                    props.openDialogMode === 'delete' ?
                    <TypographyNDL color="secondary" value='Are you sure you want to delete the connection? This action cannot be undone and will remove all associated data.' variant="paragraph-s" />
                    :
                    <React.Fragment>
<div className="mb-3">
                    <InputFieldNDL
                        id="RTUDataBase"
                        label={'Hardware Name'}
                        inputRef={HardwareName}
                        placeholder={"Hardware Name"}
                        error={isHardwareName}
                        mandatory
                    helperText={isHardwareName ? 'Please Enter Hardware Name' : ''}
                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="RTUDataBase"
                        label={'IP Address'}
                        inputRef={IPAddress}
                        placeholder={"IP Address"}
                        error={isIPAddress}
                        mandatory
                    helperText={isIPAddress ? 'Please Enter Ip Address' :''}
                    />
                </div>
                <div className="mb-3">
                    <InputFieldNDL
                        id="RTUDataBase"
                        label={'Port'}
                        inputRef={Port}
                        placeholder={"Port"}
                        error={isPort}
                        type={"number"}
                        mandatory
                    helperText={isPort ? "Please Enter Port" :''}
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
                        error={isPollingTime}
                        msg={isPollingTime ? "Please Select Polling Time " : ''}

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
                        error={isTimeOut}
                        msg={isTimeOut ? "Please Select Timeout" : ''}

                    />
                </div>

               
                <div className="mb-3">
                    <SelectBox
                        labelId="FilterAlarmName"
                        id="Filter-AlarmName"
                        label={"Publish Methods"}
                          value={PublishMethods}
                        options={[{ id: "polling", name: "polling" }, { id: "ondatachange", name: "ondatachange" }]}
                          onChange={handlePublishMethod}
                        multiple={false}
                        isMArray={true}
                        auto={false}
                        keyValue="name"
                        keyId="id"
                        mandatory
                        error={isPublishMethods}
                        msg={isPublishMethods ? "Please Select Publish Methods" : ''}

                    />
                </div>
                <div className="mb-3">
                    <CustomSwitch
                        onChange={handleEnableDisable}
                        checked={status}
                        primaryLabel="Enable/Disable"
                        switch={false}
                    />
                </div>
                    </React.Fragment>

                }
                
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" value="Cancel" onClick={() => props.handleTCPDialogClose()} />
                <Button value={renderButtonValue()} loading ={IncertTCPDataLoading || UpdateTCPDataLoading || DeleteTCPDataLoading } danger={props.openDialogMode === 'delete'} onClick={handleSaveTcp} />
            </ModalFooterNDL>
        </React.Fragment>


    )



})


export default RTUConfiguration