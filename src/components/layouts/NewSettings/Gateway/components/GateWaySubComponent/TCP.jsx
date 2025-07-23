import React, { useEffect, useRef, useState } from "react";
import EnhancedTable from "components/Table/Table";
import TCPModel from "./components/TCPModel/TCPModel";
import useGetTCPConfiguration from "./components/TCPhooks/useGetTCPConfig";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import StatusNDL from 'components/Core/Status/StatusNDL'
import useTestConnection from '../../hooks/useTestConnection'
import { useRecoilState } from "recoil";
import {  snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import useUpdateTCPConfig from 'components/layouts/NewSettings/Gateway/components/GateWaySubComponent/components/TCPhooks/useUpdateTCPconfig'
import Plus from 'assets/neo_icons/Menu/plus.svg?react';



const TCP =(props)=>{

    const TCPRef= useRef()
    const [TCPList,setTCPList] = useState([])
    const [TableData,setTableData] = useState([])
    const {TCPConfigurationLoading, TCPConfigurationData, TCPConfigurationError, getTCPConfiguration }=useGetTCPConfiguration()
    const {TestConnectionLoading, TestConnectionData, TestConnectionError, getTestConnection} =useTestConnection()
    const {UpdateTCPDataLoading, UpdateTCPDataData, UpdateTCPDataError, UpdateTCPData} = useUpdateTCPConfig()
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
        id: 'IP',
        numeric: false,
        disablePadding: true,
        label: 'IP',
    },
    {
        id: 'Port',
        numeric: false,
        disablePadding: true,
        label: 'Port',
    },
    {
        id: 'Polling Time',
        numeric: false,
        disablePadding: true,
        label: 'Polling Time',
    },
    {
        id: 'Timeout',
        numeric: false,
        disablePadding: true,
        label: 'Timeout',
    },
    {
        id: 'Pooling Methods',
        numeric: false,
        disablePadding: true,
        label: 'Pooling Methods',
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
    getTCPConfiguration({path:props.path,port:":5000/",endurl:"tcp/connections/" })
},[props.path])

useEffect(()=>{
    if(!UpdateTCPDataLoading &&  UpdateTCPDataData &&  !UpdateTCPDataError){
      if(UpdateTCPDataData && UpdateTCPDataData.data && UpdateTCPDataData.data === 'Updated'){
        TriggerTCP()

      }
    }
},[UpdateTCPDataLoading, UpdateTCPDataData, UpdateTCPDataError])




useEffect(()=>{
    if(!TestConnectionLoading && TestConnectionData &&  !TestConnectionError){
        console.log(TestConnectionData,"TestConnectionData",TCPConfigurationData)
        if(TestConnectionData && TestConnectionData.data){

            let TcpData =[...TCPList]
            TcpData = TcpData.map((x)=>{
                if(TestConnectionData.data && Object.keys(TestConnectionData.data).length > 0 && TestConnectionData.data.IP === x.Host){
                    return {
                        ...x,Status:TestConnectionData.data.status === "True" ? "Active" : "Inactive",status:TestConnectionData.data.status 
                    }
                }else{
                    return x
                }
            })
            setOpenSnack(true)
            SetType('success')
            SetMessage(`Test connection for ${TestConnectionData.data.IP} Successful`)
        setTCPList(TcpData)
        setclickedId(null)
            
        }

    }
},[TestConnectionLoading, TestConnectionData, TestConnectionError])


useEffect(()=>{
    if(!TCPConfigurationLoading && TCPConfigurationData &&  !TCPConfigurationError){
     if(TCPConfigurationData.length > 0){
        // setremovedCom(TCPConfigurationData.map(x=>x.COM_setting))
        let combinedData = TCPConfigurationData.map((x)=>{
            if(props.TCPStatus && Object.keys(props.TCPStatus).length > 0){
                return {...x,Status:props.TCPStatus[x.Host + ' ' +  x.Port.toString()] &&  props.TCPStatus[x.Host] === "True" ? "Active" : "Inactive",status:props.TCPStatus[x.Host + ' ' +  x.Port.toString()] ? props.TCPStatus[x.Host + ' ' +  x.Port.toString()] : "false" }
            }else{
                return {...x,Status:"Inactive",status:false }
            }
        })
     console.log(combinedData,"TCPConfigurationData")
        setTCPList(combinedData)
     }
    }

},[TCPConfigurationLoading, TCPConfigurationData, TCPConfigurationError,props.TCPStatus])


useEffect(()=>{
    if(TCPList.length > 0){
        processedrows()
    }

},[TCPList])



const processedrows = () => {
    let temptabledata = []
   
        temptabledata = temptabledata.concat(TCPList.map((val, index) => {
            // console.log(val,"val")
            return [
          index + 1,val.Hardware_name ? val.Hardware_name : '-',val.Host ?  val.Host : "--",val.Port ? val.Port : "-",val.Polling_Time ? val.Polling_Time : "-",val.Timeout ? val.Timeout : "-",val.Polling_method ? val.Polling_method : '-',
          <StatusNDL
                            lessHeight
                            colorbg={val.Status === "Inactive" ? "error-alt" : "success-alt"}
                            name={val.Status}
                        />,
          <CustomSwitch
          onChange={()=>handleEnableDisable(val.id,val.En_Dis)}
          checked={val.En_Dis}
          switch={true}
          small
      />,
            ]
        })
    )
    setTableData(temptabledata)

    }

    const handleEnableDisable=(id,checked)=>{
        UpdateTCPData({path:props.path,data:{id:id,En_Dis:!checked,},port:":5000/",endurl:"tcp/connections/",selectionID:id})
    }


const CreateTCPConnection=()=>{
    TCPRef.current.handleTCPDialogAdd()

}


const handleDialogEdit=(id,value)=>{
    TCPRef.current.handleTCPDialogEdit(id,value)
}
const handleDelete=(id,value)=>{
    TCPRef.current.handleTCPDialogDelete(id,value)
}

const TriggerTCP = ()=>{
    getTCPConfiguration({path:props.path,port:":5000/",endurl:"tcp/connections/" })
}

const handleTestConnection=(id,value)=>{
    setclickedId(id)
    getTestConnection({type:'tcp',selectedID:value.Host,path:props.path})

}

    return(
        <div className="p-4">
  <EnhancedTable
                                heading={'TCP'}
                                headCells={headCells}
                                data={TableData}
                                buttonpresent={"Add Connection"}
                                actionenabled={true}
                                onClickbutton={CreateTCPConnection}
                                rawdata={TCPList}
                                enableDelete={true}
                                enableEdit={true}
                                search={true}
                                download={true}
                                testConnection={true}
                                handleTestConnection={(id,value)=>handleTestConnection(id,value)}
                                handleEdit={(id, value) => handleDialogEdit(id, value)}
                                handleDelete={(id, value) => handleDelete(id, value)} 
                                // Buttonicon={RightArrow}
                                tagKey={["Status"]} 
                                clickedIndex={{id:clickedId,loader:TestConnectionLoading}}
                                 Buttonicon={Plus}

                                
                                />
                                <TCPModel ref={TCPRef} path={props.path} TriggerTCP={TriggerTCP}  />
        </div>

      
    )
    

}


export default TCP