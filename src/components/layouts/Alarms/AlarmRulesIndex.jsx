import React, { useState, useRef, useEffect } from "react"
import { useRecoilState } from "recoil";
import { selectedPlant, user } from "recoilStore/atoms";
import AlarmRules from "./components/AlarmRules";
import DataAlert from "./components/DataAlert";
import ConnectivityAlert from "./components/ConnectivityAlert";
import TimeSlot from "./components/TimeSlot"
import DowntimeAlarm from "./components/DowntimeAlarm"
import ToolAlarm from "./components/ToolAlarm"
import { Outlet } from "react-router-dom";  
import UseEntity from 'components/layouts/Settings/Entity/hooks/useEntity';
import useGetInstrumentList from "components/layouts/Alarms/hooks/useGetInstrumentList";
import useGetGateWay from "components/layouts/Settings/Gateway/hooks/useGetGateWay";
import useToolLife from "components/layouts/Settings/ToolLifeMonitoring/hooks/useToolLife.jsx"
import useUsersListForLine from 'components/layouts/Settings/UserSetting/hooks/useUsersListForLine';


export default function Alarms(props) {
  const [headPlant] = useRecoilState(selectedPlant)
  const [section, setSection] = useState('Alarm Rules');
  const [currUser] = useRecoilState(user);
  const [alarmsList, setAlarmsList] = useState([]);
  const formAlertRef = useRef()
  const fromConnectivityRef = useRef()
  const timeSlotRef = useRef()
  const fromDowntimeRef = useRef()
  const fromToolRef = useRef()
  const[entityData,setEntityData]=useState([])
  const [InstrumentList, setInstrumentList] = useState([]);
  const [GateWayList, setGateWayList] = useState([]);
  const [paramModule,setParamModule] = useState(props.params)
  const [ToolOption, setToolOption] = useState([])
  const [UserOption, setUserOption] = useState([]);

  const [,setPage]=useState('Alarm Rules') 
  const [listArr,setListArr]=useState([{ index: 'Alarm Rules', name: 'Alarm Rules' }])
  const { InstrumentListLoading, InstrumentListData, InstrumentListError, getInstrumentList } = useGetInstrumentList();
  const { GateWayLoading, GateWayData, GateWayError, getGateWay } = useGetGateWay();
  const { EntityLoading, EntityData, EntityError, getEntity } = UseEntity(); 
  const { ToolLifeLoading, ToolLifeData, ToolLifeError, getToolLife } = useToolLife(); 
  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  

  useEffect(() => {
    if(!props.module){
      setSection('Alarm Rules');
    }
   
    getInstrumentList(headPlant.id)
    getGateWay(headPlant.id)
    getEntity(headPlant.id)
    getToolLife(headPlant.id)
    getUsersListForLine(headPlant.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])



  useEffect(() => {
    if(EntityData && !EntityLoading && !EntityError) 
      setEntityData(EntityData)
        
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[EntityData,EntityLoading ,EntityError])
  useEffect(() => {
    if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
      let userOption = []
      userOption = UsersListForLineData.map(x => {
        let id = x.user_id
        let format = x.userByUserId.name + " (" + x.userByUserId.sgid + ")"
        return Object.assign(x, { "id": id, "name": format });
      })
      setUserOption(userOption)
    }
  }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError])

  useEffect(() => {
    if (!InstrumentListLoading && InstrumentListData && !InstrumentListError) {
      setInstrumentList(InstrumentListData)
    }
  }, [InstrumentListLoading, InstrumentListData, InstrumentListError])

  useEffect(() => {
    if (!GateWayLoading && GateWayData && !GateWayError) {
      setGateWayList(GateWayData)
    }
  }, [GateWayLoading, GateWayData, GateWayError])

  useEffect(() => {
    if (!ToolLifeLoading && !ToolLifeError && ToolLifeData) {
      if (ToolLifeData.length > 0) {
        setToolOption(ToolLifeData)
      }else{
        setToolOption([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ToolLifeLoading, ToolLifeData, ToolLifeError])  


  const changeSection = (val, value) => {
    console.log('cancel',val, value)
    props.changeSec(val)
    if(value==='Cancel'){
      setParamModule('')
      setSection('Alarm Rules')
    }
    else{
      setSection(val)
    }

    setPage(val)
    if (value) {
      setTimeout(() => {
        if (val === "AlertEdit") {
          formAlertRef.current.alertEdit(value)
        }
        if (val === "connectivityEdit") {
          fromConnectivityRef.current.connectivityEdit(value)
        }
        if (val === "TimeSlotEdit") {
          timeSlotRef.current.timeSlotEdit(value)
        }
        if (val === "downtimeEdit") {
          fromDowntimeRef.current.downtimeEdit(value)
        }
        if (val === "toolEdit") {
          fromToolRef.current.ToolEdit(value)
        }
      }, [1000])

    }
  }
  const breadCrumbHandler = (val) => { 
    let Listarray = [...listArr]
    if(Listarray.length === 1){
       Listarray.push({index:val,name:val});
    }
    else{
       Listarray.pop()
       Listarray.push({index:val,name:val});
    }
    setListArr(Listarray)  
}
const handleActiveIndex = (index) => {
  if (index === 0) { 
      props.changeSec('')
      setSection('Alarm Rules')
      localStorage.setItem("createDownTimeAlarm",'')
  }
}

  function componentToRender(){

    if (section !== 'Alarm Rules') {
      if (section === 'alert' || section === 'AlertEdit') {
        return (
          <DataAlert headPlant={headPlant} section={section} ref={formAlertRef} changeSection={changeSection} currUser={currUser} listArr={listArr} handleActiveIndex={handleActiveIndex} alertList={alarmsList}/>
        );
      } else if (section === 'connectivity' || section === 'connectivityEdit') {
        return (
          <ConnectivityAlert InstrumentList={InstrumentList} headPlant={headPlant} section={section} ref={fromConnectivityRef} changeSection={changeSection} currUser={currUser} alertList={alarmsList} listArr={listArr} handleActiveIndex={handleActiveIndex} GateWayList={GateWayList} />
        );
      } else if (section === 'timeslot' || section === 'TimeSlotEdit') {
        return (
          <TimeSlot headPlant={headPlant} section={section} changeSection={changeSection} ref={timeSlotRef} currUser={currUser} alertList={alarmsList} listArr={listArr} handleActiveIndex={handleActiveIndex}/>
        );
      }
      else if ((section === 'downtime' || section === 'downtimeEdit')) {
        return (
          <DowntimeAlarm InstrumentList={InstrumentList} headPlant={headPlant} section={section} ref={fromDowntimeRef} changeSection={changeSection} currUser={currUser} alertList={alarmsList} listArr={listArr} 
          entityData={entityData}
          handleActiveIndex={handleActiveIndex}/>
        );
      }else if ((section === 'tool' || section === 'toolEdit')) {
        return (
          <ToolAlarm ToolOption={ToolOption} headPlant={headPlant} section={section} ref={fromToolRef} changeSection={changeSection} currUser={currUser} alertList={alarmsList} listArr={listArr} 
          entityData={entityData}
          UserOption={UserOption}
          handleActiveIndex={handleActiveIndex}/>
        );
      } else {
        return <Outlet />;
      }
    } else {
      return <Outlet />;
    }
  }

  return (


      <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
        {section === 'Alarm Rules' && (
          <React.Fragment>
            <AlarmRules headPlant={headPlant} section={section} changeSection={changeSection} alarmsList={(e) => setAlarmsList(e)} breadCrumbHandler={breadCrumbHandler} module={props.module} params={paramModule}/>
            
          </React.Fragment>
        )
        } 
        {componentToRender()}
    </div>

  )

}
