import React, { useEffect, useRef, useState } from "react";
import EnhancedTable from "components/Table/Table";
import RTUModel from "./components/RTUModel/RtuModel";
import useGetRTUList from 'components/layouts/NewSettings/Gateway/components/GateWaySubComponent/components/RTUhooks/useGetRTUList.jsx'
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import useupdateRTUConfig from '../GateWaySubComponent/components/RTUhooks/useUpdateRTUConfig'
import StatusNDL from 'components/Core/Status/StatusNDL'
import useTestConnection from '../../hooks/useTestConnection'
import { useRecoilState } from "recoil";
import {  snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';





const RTU =(props)=>{

    const RTuRef= useRef()
    const {RTUConfigurationLoading, RTUConfigurationData, RTUConfigurationError, getRTUConfiguration} = useGetRTUList()
    const [RTUList,setRTUList] = useState([])
    const [TableData,setTableData] = useState([])
    const [removedCom,setremovedCom] = useState([])
    const { UpdateRTUDataLoading, UpdateRTUDataData, UpdateRTUDataError, UpdateRTUData } = useupdateRTUConfig()
    const {TestConnectionLoading, TestConnectionData, TestConnectionError, getTestConnection} =useTestConnection()
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [clickedId,setclickedId]  = useState(null)





const headCells=[
    {
        id: 'S.No',
        numeric: false,
        disablePadding: true,
        label: 'S.No',
    },
    {
        id: 'Hardware Name',
        numeric: false,
        disablePadding: true,
        label: 'Hardware Name',
    },
    {
        id: 'COM 1',
        numeric: false,
        disablePadding: true,
        label: 'COM 1',
    },
    {
        id: 'Stop Bit',
        numeric: false,
        disablePadding: true,
        label: 'Stop Bit',
    },
    {
        id: 'Byte Size',
        numeric: false,
        disablePadding: true,
        label: 'Byte Size',
    },
    {
        id: 'Parity',
        numeric: false,
        disablePadding: true,
        label: 'Parity',
    },
    {
        id: 'Baudrate',
        numeric: false,
        disablePadding: true,
        label: 'Baudrate',
    },
    {
        id: 'Timeout',
        numeric: false,
        disablePadding: true,
        label: 'Timeout',
    },
    {
        id: 'Polling Time',
        numeric: false,
        disablePadding: true,
        label: 'Polling Time',
    },
    {
        id: 'Polling Methods',
        numeric: false,
        disablePadding: true,
        label: 'Polling Methods',
    },
    {
        id: 'Status',
        numeric: false,
        disablePadding: true,
        label: 'Status',
    },
     {
        id: ' ',
        numeric: false,
        disablePadding: true,
        label: ' ',
    },
]


useEffect(()=>{
    getRTUConfiguration({path:props.path,port:":5000/",endurl:"rtu/connections/" })
    console.log(props.path,"props.path")
},[props.path])



useEffect(()=>{
    if(!RTUConfigurationLoading && RTUConfigurationData &&  !RTUConfigurationError){
     console.log(RTUConfigurationData,"RTUConfigurationData")
     if(RTUConfigurationData.length > 0){
        
        const finalData = RTUConfigurationData.map(x=>{
            return {...x,id:x.COM_setting}
        })
        setremovedCom(finalData.map(x=>x.COM_setting))
        console.log(props.RTUStatus,'props.RTUStatus')
        let combinedData = finalData.map(x=>{
            if(Object.keys(props.RTUStatus).length > 0){
                return {...x,Status:props.RTUStatus[x.COM_setting] && props.RTUStatus[x.COM_setting] === "True" ? "Active" : "Inactive",status:props.RTUStatus[x.COM_setting] }
            }else{
                return {...x,Status:"Inactive",status:false }
            }
        })
        // console.log(combinedData,'combinedData')
        setRTUList(combinedData)
     }
    }

},[RTUConfigurationLoading, RTUConfigurationData, RTUConfigurationError,props.RTUStatus])

useEffect(()=>{

    if(!UpdateRTUDataLoading &&  UpdateRTUDataData &&  !UpdateRTUDataError){
        if(UpdateRTUDataData && UpdateRTUDataData.data &&  UpdateRTUDataData.data === "Updated"  ){
           TriggerRTU()
        }

    }

},[ UpdateRTUDataLoading, UpdateRTUDataData, UpdateRTUDataError])

useEffect(()=>{
    if(!TestConnectionLoading && TestConnectionData &&  !TestConnectionError){
        console.log(TestConnectionData,"TestConnectionData")
        if(TestConnectionData && TestConnectionData.data){
            
            let TcpData =[...RTUList]
            TcpData = TcpData.map((x)=>{
                if(TestConnectionData.data && Object.keys(TestConnectionData.data).length > 0 && TestConnectionData.data.port === x.COM_setting){
                    return {
                        ...x,Status:TestConnectionData.data.status === "True" ? "Active" : "Inactive",status:TestConnectionData.data.status 
                    }
                }else{
                    return x
                }
            })
            setOpenSnack(true)
            SetType('success')
            SetMessage(`Test connection for ${TestConnectionData.data.port} Successful`)
            setRTUList(TcpData)
            setclickedId(null)
            
        }

    }
},[TestConnectionLoading, TestConnectionData, TestConnectionError])

useEffect(()=>{
    if(RTUList.length > 0){
        processedrows()
    }

},[RTUList])

const processedrows = () => {
    let temptabledata = []
   
        temptabledata = temptabledata.concat(RTUList.map((val, index) => {
            return [
          index + 1,val.Hardware_name ? val.Hardware_name : '-',val.COM_setting ?  val.COM_setting : "--",val.Stop_bits ? val.Stop_bits : "-",val.Data_Bits ? val.Data_Bits : "-",val.Parity ? val.Parity : "-",val.Baud_rate ? val.Baud_rate : '-',val.Timeout ? val.Timeout :"-",val.Polling_Time ? val.Polling_Time : '-' ,
          val.Polling_method ? val.Polling_method : "-",
          <StatusNDL
                        lessHeight
                            colorbg={val.Status === "Inactive" ? "error-alt" : "success-alt"}
                            name={val.Status}
                        />,
          <CustomSwitch
          onChange={()=>handleEnableDisable(val.COM_setting,val.En_Dis)}
          checked={val.En_Dis}
          switch={true}
          small
      />
            ]
        })
    )
    setTableData(temptabledata)

    }


    const handleEnableDisable=(id,checked)=>{
        UpdateRTUData({path:props.path,data:{COM_setting:id,En_Dis:!checked},port:":5000/",endurl:"rtu/connections/",selectionID:id},)
    }
const CreateRTUConnection=()=>{
    RTuRef.current.handleRTUDialogAdd()

}

const handleDialogEdit=(id,value)=>{
    RTuRef.current.handleRTUDialogEdit(id,value)
}
const handleDelete=(id,value)=>{
    RTuRef.current.handleRTUDialogDelete(id,value)
}

const TriggerRTU =()=>{
    getRTUConfiguration({path:props.path,port:":5000/",endurl:"rtu/connections/" })
}


const handleTestConnection=(id,value)=>{
    setclickedId(id)
    getTestConnection({type:'rtu',selectedID:value.COM_setting,path:props.path})
}


    return(
        <div className="p-4">
  <EnhancedTable
                                heading={'RTU'}
                                headCells={headCells}
                                data={TableData}
                                buttonpresent={"Add Connection"}
                                actionenabled={true}
                                onClickbutton={CreateRTUConnection}
                                rawdata={RTUList}
                                enableDelete={true}
                                enableEdit={true}
                                search={true}
                                download={true}
                                testConnection={true}
                                handleEdit={(id, value) => handleDialogEdit(id, value)}
                                handleDelete={(id, value) => handleDelete(id, value)} 
                                handleTestConnection={(id,value)=>handleTestConnection(id,value)}
                            Buttonicon={Plus}
                            tagKey={["Status"]} 
                            clickedIndex={{id:clickedId,loader:TestConnectionLoading}}


                                // Buttonicon={RightArrow}
                                
                                />
                                <RTUModel ref={RTuRef} path ={props.path} TriggerRTU={TriggerRTU} removedCom={removedCom} />
        </div>

      
    )
    

}


export default RTU