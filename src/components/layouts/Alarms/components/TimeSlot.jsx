import React, { useEffect, useState, useRef,useImperativeHandle,forwardRef } from "react";
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import useTheme from "TailwindTheme"
import { themeMode, snackToggle, snackMessage, snackType,user } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL' 
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import TextField from "components/Core/InputFieldNDL";
import useTimeSlots  from "components/layouts/Settings/Production/TimeSlot/hooks/useTimeSlot"
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import useGetChannelListForLine from "../hooks/useGetChannelListForLine";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx"; 
import useVirtualInstrumentList from 'Hooks/useVirtualInstrument.jsx';
import useGetInsrumentMetricsList from "../hooks/useGetInstrumentMetricsList";
import useCreateAlarm from "../hooks/useCreateAlarm";
import useUpdateAlarm from "../hooks/useUpdateAlarm";
import moment from 'moment';
import useGetAlarmSMSUser from "../hooks/useGetAlarmSMSUser";
import Information from 'assets/neo_icons/Menu/Information.svg?react';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";


const TimeSlot=forwardRef((props,ref)=>{
  const useThemes = useTheme();
const [curTheme] = useRecoilState(themeMode);
const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
const { t } = useTranslation();
const alarmName = useRef();
const alarmRemarks = useRef()
const [timeSlotOption,settimeSlotOption] = useState([]);
const [entityOption,setentityOption]= useState([]);
const [entityValue,setentityValue] = useState('');
const [selectedTimeSlot,setselectedTimeSlot] = useState('');
const [warningCheck, setWarningCheck] = useState("");
const [warningMin, setWarningMin] = useState('');
const [warningMax, setWarningMax] = useState('');
const [warningValue, setWarningValue] = useState('');
const [criticalCheck, setCriticalCheck] = useState("");
const [criticalMin, setCriticalMin] = useState('');
const [criticalMax, setCriticalMax] = useState('');
const [criticalValue, setCriticalValue] = useState('');
const [CheckmeEmail, setCheckmeEmail] = useState(false);
const [CheckmeSMS, setCheckmeSMS] = useState(false);
const [UserFields, setUserFields] = useState([{ field: 1 ,user_id: "", user_name: "", alert_SMS: false, alert_email: false   }]);
const [channelFields, setChannelFields] = useState([{ field: 1,channel_id: "", channel_namess: ""}]);
const [ChannelList, setChannelList] = useState([]);
const [UserOption, setUserOption] = useState([]); 
const [virtualInstrumentId,setvirtualInstrumentId] = useState('')
const [alertid,setalertid] = useState('')
const [instrumentMetrics, setInstrumentMetrics] = useState('');
const [MetricID, setMetricID] = useState('');
const [checkUpdateName, setcheckUpdateName ] =useState('')
const [checkUpdateEntityId, setcheckUpdateEntityId ] =useState('')
const [checkUpdateTimeSlotId, setcheckUpdateTimeSlotId ] =useState('')
const [energyAssetOption,setenergyAssetOption] = useState([])
const [finalEntityOption,setfinalEntityOption] = useState([])
const { timeslotLoading, timeslotData, timeslotError, getTimeSlots } = useTimeSlots();
const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();
const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine(); 
const { virtualInstrumentListLoading, virtualInstrumentListData, virtualInstrumentListError, virtualInstrumentList } = useVirtualInstrumentList();
const { InstrumentMetricsListLoading, InstrumentMetricsListData, InstrumentMetricsListError, getInsrumentMetricsList } = useGetInsrumentMetricsList();
const { CreateAlarmLoading, CreateAlarmData, CreateAlarmError, getCreateAlarm } = useCreateAlarm()
const { UpdateAlarmLoading, UpdateAlarmData, UpdateAlarmError, getUpdateAlarm } = useUpdateAlarm()
const [currUser] = useRecoilState(user);
  const [isAlerAccess,setisAlerAccess] = useState(false)
   const { AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError,getAlarmSMSUser} = useGetAlarmSMSUser()

let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
useEffect(()=>{
  getTimeSlots(props.headPlant.id)
  getChannelListForLine(props.headPlant.id)
  getUsersListForLine(props.headPlant.id) 
  virtualInstrumentList(props.headPlant.id)
  getAlarmSMSUser()

// eslint-disable-next-line react-hooks/exhaustive-deps
},[props.headPlant])

useImperativeHandle(ref,()=>({
  timeSlotEdit : (value)=>timeSlotEdit(value)
}))

useEffect(() => {
  if ((!CreateAlarmLoading && CreateAlarmData && !CreateAlarmError) ) {
    setSnackMessage(t("New Alarm rules created"))
    setSnackType("success")
    setOpenSnack(true)
    props.changeSection('','Cancel')
  }
  if ((CreateAlarmLoading && !CreateAlarmData && CreateAlarmError) ) {
    setSnackMessage(t("New Alarm rules creation failed"))
    setSnackType("error")
    setOpenSnack(true)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [CreateAlarmData])

useEffect(()=>{
  if(!AlarmSMSUserLoading &&   AlarmSMSUserData  && !AlarmSMSUserError){
      let isHaveAccess = AlarmSMSUserData.filter(x=>x.user_id === currUser.id && x.is_enable) 
      console.log(AlarmSMSUserData,"AlarmSMSUserData",isHaveAccess,currUser.id)

      // setAlertUser(AlarmSMSUserData)
      if(isHaveAccess.length > 0){
          setisAlerAccess(true)
      }else{
          setisAlerAccess(false)

      }
      
  } 
// eslint-disable-next-line react-hooks/exhaustive-deps
},[AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError])

useEffect(() => {
  if ((!UpdateAlarmLoading && UpdateAlarmData && !UpdateAlarmError) ) {
    setSnackMessage(alertid ? t('Alarm Updated Successfully') : t('Alarm Created'));
    setOpenSnack(true); setSnackType('success');
    props.changeSection('','Cancel')
  }
  if ((UpdateAlarmLoading && !UpdateAlarmData && UpdateAlarmError) ) {
    setSnackMessage(t("Alarm Creating has failed"));
    setOpenSnack(true); setSnackType('warning');
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [UpdateAlarmData])



useEffect(()=>{
  if(!virtualInstrumentListLoading && virtualInstrumentListData && !virtualInstrumentListError){
    if(timeslotData && timeslotData.timeslot && timeslotData.timeslot.energy_asset){
      let instrumentList = []
      let InstruName =  virtualInstrumentListData.length > 0 ? virtualInstrumentListData.filter(item=> item.id === timeslotData.timeslot.energy_asset) : []
     
      if(InstruName.length > 0){
        instrumentList.push({name:InstruName[0].name,vi:true,id:timeslotData.timeslot.energy_asset})
        setenergyAssetOption(instrumentList)
      }
     
       
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[virtualInstrumentListLoading, virtualInstrumentListData, virtualInstrumentListError])
useEffect(()=>{ 
  if(entityOption.length > 0 && energyAssetOption.length > 0 ){
    let finalEntityOption1 = [...entityOption,...energyAssetOption]
    setfinalEntityOption(finalEntityOption1)  
  }
},[entityOption,energyAssetOption])
useEffect(()=>{
if(!timeslotLoading && timeslotData && !timeslotError  ){
  let instrumentList = []
  if(timeslotData.timeslot && timeslotData.timeslot.timeslots && timeslotData.timeslot.timeslots.length > 0 ){
    
    let modifiedArray = timeslotData.timeslot.timeslots.map(alert=>{
      return Object.assign({}, alert, { "value":`${alert.name + " ("+moment(alert.startTime).utcOffset(stdOffset).format("HH:mm")+" "}-${" " + moment(alert.endTime).utcOffset(stdOffset).format("HH:mm")})` })
    })
    settimeSlotOption(modifiedArray);
  }
  if(timeslotData.timeslot && timeslotData.timeslot.nodes && timeslotData.timeslot.nodes.length > 0 ){
    instrumentList=[...timeslotData.timeslot.nodes]
  }
  setentityOption(instrumentList)

}
// eslint-disable-next-line react-hooks/exhaustive-deps
},[timeslotLoading , timeslotData ,timeslotError])




useEffect(() => {
  if (!InstrumentMetricsListLoading && InstrumentMetricsListData && !InstrumentMetricsListError) {
    
    let InstruMetricList = []
    InstruMetricList = InstrumentMetricsListData.map((x) => {
      return Object.assign(x, { "title": x.metric.title }, { "name": x.metric.name })
    })
    
     let metricDetail = InstruMetricList.filter(x=>x.name.toString().toLowerCase() === MetricID.toString().toLowerCase() )
     if(metricDetail.length > 0 ){
        setInstrumentMetrics(metricDetail[0].id)
      }else if(metricDetail.length === 0){
        setOpenSnack(true);
        setSnackType('warning');
        setSnackMessage(t('Selected entity does not having Consumption Reading'))
        setInstrumentMetrics([])
      }
   
   
  }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [InstrumentMetricsListLoading, InstrumentMetricsListData, InstrumentMetricsListError])

 
useEffect(() => {
  if (!ChannelListForLineLoading && ChannelListForLineData && !ChannelListForLineError) {
  
    setChannelList(ChannelListForLineData)

  }
}, [ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError])
useEffect(() => {
  if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
    let userOption = []
    userOption = UsersListForLineData.map(x => {
      let id = x.user_id
      let format = x.userByUserId.name + " (" + x.userByUserId.sgid + ")"
      return Object.assign(x, { "id": id, "value": format });
    })
    setUserOption(userOption)
  }

}, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError])


const handleEntity=(e)=>{

     setentityValue(e.target.value);
     let checkId = e.target.value.toString().split("-")
     setvirtualInstrumentId('')
    if(checkId.length >= 4 ){
      setvirtualInstrumentId(e.target.value)
      let virtualInstrumentFormula = virtualInstrumentListData.filter(x=>x.id === e.target.value )
      // eslint-disable-next-line no-useless-escape
      let instruments = virtualInstrumentFormula.length > 0 ? virtualInstrumentFormula[0].formula.split(/([-+*\/()\n])/g) : []
     
      instruments = instruments.filter(word => word.trim().length > 0);
      let re = '-+*\\/()';
      instruments = instruments.filter(val => !re.includes(val));
      let metrics = 'kwh';
      instruments = instruments.map(val => val.split('.')[0]);
      getInsrumentMetricsList(instruments[0])
      // setInstrumentID(instruments)
      setMetricID(metrics)
    }else{
      let metrics = 'kwh';
      getInsrumentMetricsList(e.target.value)
      // setInstrumentID(e.target.value)
      setMetricID(metrics)
    }
  
}
const handleTimeSlot = (e)=>{
  setselectedTimeSlot(e.target.value);
}
const checkOption = [
  { id: "above", value: t("Above") },
  { id: "below", value: t("Below") },
 
]

const updateCheck = (e, field) => {
  if (field === 1) {
    setWarningCheck(e.target.value)
  }
  if (field === 2) {
    setCriticalCheck(e.target.value)
  }
}

const updateValue = (e, field) => {

  if (field === 1) {
    setWarningValue(e.target.value); 
  } else if (field === 2) {
    setCriticalValue(e.target.value);
  } 
}

const handleCheckme = (e, p) => {
  if (p === 1) {
    setCheckmeSMS(!CheckmeSMS);
  } else {
    setCheckmeEmail(!CheckmeEmail);
  }

}
// NOSONAR
const timeSlotEdit=(value)=>{
try{
  setalertid(value.id)
  alarmName.current.value = value.name
  setInstrumentMetrics(value.insrument_metrics_id)
  setvirtualInstrumentId(value.viid)
  setcheckUpdateName(value.name)
  setcheckUpdateTimeSlotId(value.time_slot_id)
  if(value.viid){
    setentityValue(value.viid)
  setcheckUpdateEntityId(value.viid)

  }else{
    setentityValue(value.instrument_id)
  setcheckUpdateEntityId(value.instrument_id)

  }

  setselectedTimeSlot(value.time_slot_id)
  if(alarmRemarks){
  alarmRemarks.current.value = value.message
}
if(value.warn_type){
  setWarningCheck(value.warn_type)
}
  if(value.warn_value){
    setWarningValue(value.warn_value)
    }
    if(value.warn_min_value){
  setWarningMin(value.warn_min_value)
}
if(value.warn_max_value){
  setWarningMax(value.warn_max_value)
}
  setCriticalCheck(value.critical_type)
  if(value.critical_value){
    setCriticalValue(value.critical_value)
  }
  if(value.critical_min_value){
    setCriticalMin(value.critical_min_value)
  }
  if(value.critical_max_value){
  setCriticalMax(value.critical_max_value)
}

  let newarr =[]
  if(value.alert_channels){
    if(value.alert_channels.length > 0){
  value.alert_channels.map((val,i)=>
  newarr.push({
    field : i + 1,
    channel_id : val
  }
  )
 
  )
    }
    else{
      newarr.push({ field: 1, channel_id: "", channel_name: "" })
    }
  }
  setChannelFields(newarr)
  if(value.alert_users.length > 0){
    // eslint-disable-next-line array-callback-return
    value.alert_users.map(val=>{
      if(props.currUser.id === val.user_id){
     
        setCheckmeEmail(val.email)
        setCheckmeSMS(val.sms)
      }
    }) 
    let others = value.alert_users ?value.alert_users.filter(x=> x.user_id !== props.currUser.id):[]
    if(others&&others.length> 0 ){
      let userArr3 = []
      // eslint-disable-next-line array-callback-return
      others.map((val,i)=>{
        
        let user =UserOption.filter(e=>e.id === val.user_id)
          userArr3.push({
            field : i + 1,
            user_id: val.user_id,
            user_name: user.length > 0 && user[0].userByUserId.name,
            alert_SMS:val.sms,
            alert_email:val.email
          })
           
          
      }) 
      setUserFields(userArr3);
    }
  }

 
}
catch(err){
  console.log('Error on alert form',err);
}
}

const Channelnamelist=(c)=>
{
  let chObj1 = {};
  let listChanel = [];
  if(c.channel_id !== ""){
    
    let channelname = '';
    let channelsValue = ''
    const channelid = c.channel_id;
   
 
    // eslint-disable-next-line array-callback-return
    ChannelListForLineData.map(val => {
      if (channelid === val.id) {
        listChanel.push(val.id)
        if (val.notificationChannelType.id === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') { // SMS
          channelname = "sms"
        } else if (val.notificationChannelType.id === 'aee76d9f-843a-4041-badc-707d54ffcb3e') { // Email
          channelname = "email"
        } else if (val.notificationChannelType.id === '013d0b10-b4f2-4ef1-8804-a2b756684ad2') { // Teams
          channelname = "teams"
        }
        channelsValue = val.parameter;
      }
    })
    if (chObj1.hasOwnProperty(channelname)) {
      let arr1 = [...chObj1[channelname]];
      arr1.push(channelsValue);
      chObj1[channelname] = arr1;
    } else {
      let arr1 = [];
      arr1.push(channelsValue);
      chObj1[channelname] = arr1;
    }
  }
  return {chObj1,listChanel}
}
function processUserFields(fields) {
  const alertUser = [];

  if (fields.length > 0) {
    // eslint-disable-next-line array-callback-return
    fields.forEach(val => {
      alertUser.push({
        "user_id": val.user_id,
        "email": val.alert_email,
        "sms": val.alert_SMS
      });
    });
  }

  return alertUser;
}
const processChannelFields = (fields,listChanel1) => {
  const channelsArr = [];

  if (fields.length > 0) {
    fields.forEach((x) => {
      const { chObj: channelObj, listChanel: channelList } = Channelnamelist(x);
      channelsArr.push(channelObj);
      listChanel1.push(...channelList);
    });
  }

  return channelsArr;
};
// NOSONAR
const editAlertForm=()=>{
console.log('hii')
  let alertUser = []
  if (CheckmeSMS || CheckmeEmail) {
    alertUser.push({
      "user_id": props.currUser.id,
      "email": CheckmeEmail,
      "sms": CheckmeSMS
    })
  }
  alertUser = alertUser.concat(processUserFields(UserFields));
  if (alarmName.current.value === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a alarm name'))
    return false;
  } 
  else if(entityValue === ''){
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('PlsSelEntity'))
    return false;
  } 
  else if(instrumentMetrics.length === 0){
    setOpenSnack(true);
    setSnackType('warning');
    setSnackMessage(t('Selected entity does not having Consumption Reading'))
    return false
  } 
  else if (selectedTimeSlot === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Time Slot'))
    return false;
  } else if (warningCheck === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select warning check'))
    return false;
  } else if (criticalCheck === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select critical check'))
    return false;
  } 

  let criticaltype = ''
  let criticalvalue = ''
  let criticalmaxvalue = ''
  let criticalminvalue = ''
  let warntype = ''
  let warnvalue = ''
  let warnmaxvalue = ''
  let warnminvalue = ''
  let channelsarr = [];
  let listChanel = []
  if (warningCheck === 'above' || warningCheck === 'below') {
    warntype = warningCheck
    warnvalue = warningValue
    if(warnvalue === ''){
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter warning value'))
      return false;
    }
  } else {
   
    warntype = criticalCheck
    warnmaxvalue = warningMax
    warnminvalue = warningMin
  }
  if (criticalCheck === 'above' || criticalCheck === 'below') {
    criticaltype = criticalCheck
    criticalvalue = criticalValue
    if(criticalvalue === ''){
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter critical value'))
      return false;
    }
  } else {
    
    criticaltype = criticalCheck
    criticalmaxvalue = criticalMax
    criticalminvalue = criticalMin
  }
  if(Number(warningValue) >= Number(criticalValue)){
  
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Warning value should be less than critical value'))
    return false;
  }
  
  if (channelFields.length > 0) {
    channelsarr = processChannelFields(channelFields,listChanel);
  }
  let selectedTimeSlotObject = timeSlotOption.find(slot => slot.id === selectedTimeSlot);
        let duration = "";

        if (selectedTimeSlotObject) {
          let startTime = selectedTimeSlotObject.startDate.split(':').map(Number);
          let endTime = selectedTimeSlotObject.endDate.split(':').map(Number);
        
          let durationHours = (endTime[0] - startTime[0] + 24) % 24; 
        
          duration ="(" + durationHours + "h)";
        }
  let data = {
    alert_id:alertid,
    alert_channels: "{" + listChanel.toString() + "}",
    alert_multi_channels: [],
    entity_type:"time_slot",
    alert_users: alertUser,
    insrument_metrics_id: instrumentMetrics ? Number(instrumentMetrics) : 0,
    time_slot_id: selectedTimeSlot,
    delivery: channelsarr.length > 0 ? channelsarr[0] : {},
    check_aggregate_window_function:"cons",
    check_aggregate_window_time_range:selectedTimeSlotObject?.name + " " + duration,
    critical_type: criticaltype,
    critical_value: criticalvalue,
    warn_type: warntype,
    warn_value: warnvalue,
    critical_max_value: criticalmaxvalue.toString(),
    critical_min_value: criticalminvalue.toString(),
    warn_max_value: warnmaxvalue.toString(),
    warn_min_value: warnminvalue.toString(),
    name: alarmName.current.value,
    updated_by: props.currUser.id,
    // created_by: props.currUser.id,
    message: alarmRemarks.current.value,
    viid:virtualInstrumentId ? virtualInstrumentId : null

  };
 console.log(data,"data timeslot")
  updateUniqueAlarm(data,alarmName.current.value,entityValue,selectedTimeSlot,virtualInstrumentId)

}
const updateUniqueAlarm =(data,alarmname,entity,timeslot,viid)=>{
  let name =[]
  let checkTimeSlot = []
  let checkVirtTimeSlot = []
  if(checkUpdateName !== alarmname ){
     name = props.alertList.filter(x => x.name === alarmname)
  }else if(checkUpdateEntityId !== entity || checkUpdateTimeSlotId !==timeslot){
    checkTimeSlot = props.alertList.filter(x=>(x.time_slot_id === timeslot) && (x.instrument_id === entity) && (x.viid === null))

  }// NOSONAR
  else if(viid && (checkUpdateTimeSlotId !==timeslot || checkUpdateEntityId !== entity) ){
    checkVirtTimeSlot =props.alertList.filter(x=>(x.time_slot_id === timeslot) && (x.viid === viid ))
    
  }
 
  if (name.length > 0) {
    setSnackMessage(t('Alarm Name Already Exist'));
    setOpenSnack(true); setSnackType('warning');
    return false;
  }
  if(checkTimeSlot.length > 0  || checkVirtTimeSlot.length > 0){
    setSnackMessage(t('Alarm Entity and Timeslot Already Exist'));
    setOpenSnack(true); setSnackType('warning');
    return false;
  }
  getUpdateAlarm(data)
}
const addUsers = (e, data, field) => {
  let row = data.filter(x=> x.id === e.target.value)[0]
  let setelement = [...UserFields];
  let Exist = e ? setelement.filter(x => x.user_id === row.id) : []
 
  if (Exist.length > 0) {
    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['user_id'] = '';
    fieldObj['user_name'] = '';
    setelement[fieldIndex] = fieldObj;
    setUserFields(setelement);
   
    setSnackMessage(t("User Already selected"))
    setSnackType("warning")
    setOpenSnack(true)
  } else {
    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['user_id'] = row ? row.id : '';
    fieldObj['user_name'] = row ? row.userByUserId.name : '';
    fieldObj['alert_SMS'] = false;
    fieldObj['alert_email'] = false;
    setelement[fieldIndex] = fieldObj;
    setUserFields(setelement);

  }
}

const addUserValuesms = (e, field) => {
 
  let setelement = [...UserFields];
  
  const fieldIndex = setelement.findIndex(x => x.field === field);
  let fieldObj = { ...setelement[fieldIndex] };
  fieldObj['alert_SMS'] = e.target.checked;
  setelement[fieldIndex] = fieldObj;
  setUserFields(setelement)

}
const removeOtherUser = (val) => {
  let setelement = [...UserFields];
  let removed = setelement.filter(x => x.field !== val);
  setUserFields(removed);
}
const addOtherUser = (val) => {
  let setelement = [...UserFields];
  const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
  setelement.push({ field: lastfield, user_id: '', user_name: '' });
  setUserFields(setelement);
}
const addUserValueEmail = (e, field) => {
  let setelement = [...UserFields];
  const fieldIndex = setelement.findIndex(x => x.field === field);
  let fieldObj = { ...setelement[fieldIndex] };
  fieldObj['alert_email'] = e.target.checked;
  setelement[fieldIndex] = fieldObj;


  setUserFields(setelement);
}
const addChannelName = (e, field) => {
  let setelement = [...channelFields];
  let Exist = e ? setelement.filter(x => x.channel_id === e.target.value) : []
 
  if (Exist.length > 0) {
    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['channel_id'] = '';
    fieldObj['channel_namess'] = '';
    setelement[fieldIndex] = fieldObj;
    setChannelFields(setelement);
    setSnackMessage(t("Channel Already selected"))
    setSnackType("warning")
    setOpenSnack(true)
  } else {
    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['channel_id'] = e.target.value ? e.target.value : '';
    fieldObj['channel_namess'] = e.target.value? e.target.value :'';
    setelement[fieldIndex] = fieldObj;
   
    setChannelFields(setelement);

  }
 
}

const addChannel = (val) => {
  let setelement = [...channelFields];
  const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
  setelement.push({ field: lastfield, channel_id: '', channel_namess: '' });
  setChannelFields(setelement);
}
const removeChannel = (val) => {
  let setelement = [...channelFields];
  let removed = setelement.filter(x => x.field !== val);
 
  setChannelFields(removed);
}
// NOSONAR
const saveAlarm = () => {
 
  let alertUser = []
  if (CheckmeSMS || CheckmeEmail) {
    alertUser.push({
      "user_id": props.currUser.id,
      "email": CheckmeEmail,
      "sms": CheckmeSMS
    })
  }
  alertUser = alertUser.concat(processUserFields(UserFields));

  if (alarmName.current.value  === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a alarm name'))
    return false;
  }else if(entityValue === ''){
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Entity'))
    return;
  } 
  else if(instrumentMetrics.length === 0){
    setOpenSnack(true);
    setSnackType('warning');
    setSnackMessage(t('Selected entity does not having Consumption Reading'))
    return false
  } 
  else if(selectedTimeSlot === ''){
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Time Slot '))
    return;
  } 
  else if (warningCheck === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select warning check'))
    return false;
  } else if (criticalCheck === '') {
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select critical check'))
    return false;
  } 

  let criticaltype = ''
  let criticalvalue = ''
  let criticalmaxvalue = ''
  let criticalminvalue = ''
  let warntype = ''
  let warnvalue = ''
  let warnmaxvalue = ''
  let warnminvalue = ''
  let channelsarr = [];
  let listChanel = []
  if (warningCheck === 'above' || warningCheck === 'below') {
    warntype = warningCheck
    warnvalue = warningValue
    if(warnvalue === ''){
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter warning value'))
      return false;
    }
  }
 
      
   
  
  if (criticalCheck === 'above' || criticalCheck === 'below') {
    criticaltype = criticalCheck
    criticalvalue = criticalValue
    if(criticalvalue === ''){
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter critical value'))
      return false;
    }
  }
   else {
    criticaltype = criticalCheck
    criticalmaxvalue = criticalMax
    criticalminvalue = criticalMin
  }
  if(Number(warningValue) >= Number(criticalValue)){
   
    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Warning value should be less than critical value'))
    return false;
  }
  if (channelFields.length > 0) {
    channelsarr = processChannelFields(channelFields,listChanel);
  }
  let selectedTimeSlotObject = timeSlotOption.find(slot => slot.id === selectedTimeSlot);
  let duration = "";

  if (selectedTimeSlotObject) {
    let startTime = selectedTimeSlotObject.startDate.split(':').map(Number);
    let endTime = selectedTimeSlotObject.endDate.split(':').map(Number);
    
    let durationHours = (endTime[0] - startTime[0] + 24) % 24; 
  
    duration ="(" + durationHours + "h)";
  }
  let data = {
    alert_channels: "{" + listChanel.toString() + "}",
    alert_multi_channels: [],
    alert_users: alertUser,
    entity_type:"time_slot",
    insrument_metrics_id: instrumentMetrics ? Number(instrumentMetrics) : 0,
    time_slot_id: selectedTimeSlot ,
    delivery: channelsarr.length > 0 ? channelsarr[0] : {},
    check_aggregate_window_function:"cons",
    check_aggregate_window_time_range:selectedTimeSlotObject?.name + " " + duration,
    check_time: '1m',
    check_time_offset: "0s",
    check_start_time: "-1h",
    line_id: props.headPlant.id,
    critical_type: criticaltype,
    critical_value: criticalvalue,
    warn_type: warntype,
    warn_value: warnvalue,
    critical_max_value: criticalmaxvalue.toString(),
    critical_min_value: criticalminvalue.toString(),
    warn_max_value: warnmaxvalue.toString(),
    warn_min_value: warnminvalue.toString(),
    name: alarmName.current.value,
    status: "active",
    updated_by: props.currUser.id,
    created_by: props.currUser.id,
    message: alarmRemarks.current.value,
    viid:virtualInstrumentId ? virtualInstrumentId : null
  };
  CheckUniqueAlarmForTimeSlot(data,alarmName.current.value,entityValue,selectedTimeSlot,virtualInstrumentId,"time_slot")
  // CheckUniqueAlarm(alarmName.current.value, data)
}

const CheckUniqueAlarmForTimeSlot=(data,alarmname,entity,timeslot,viid,entityType)=>{
  let name = props.alertList.filter(x => x.name === alarmname)
  let checkTimeSlot = props.alertList.filter(x=>(x.time_slot_id === timeslot) && (x.instrument_id === entity) && (x.viid === null) && (x.entity_type === entityType))
  let checkVirtTimeSlot =props.alertList.filter(x=>(x.time_slot_id === timeslot) && (x.viid === viid ) && (x.entity_type === entityType))
  // let sameTimeSlotAlarm = alarmsList.filter(x=>())
  if (name.length > 0) {
    setSnackMessage(t('Alarm Name Already Exist'));
    setOpenSnack(true); setSnackType('warning');
    return false;
  }
  if(checkTimeSlot.length > 0  || checkVirtTimeSlot.length > 0){
    setSnackMessage(t('Alarm Entity and Timeslot Already Exist'));
    setOpenSnack(true); setSnackType('warning');
    return false;
  }
  getCreateAlarm(data)

}
    return(
        <React.Fragment>
       <div  className=" py-2 px-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark flex items-center justify-between h-[48px]">
              <Breadcrumbs breadcrump={props.listArr} onActive={props.handleActiveIndex} />  
            <div>
            <Button type='secondary' style={{ marginRight: 10}} value={t('Cancel')} onClick={() => { props.changeSection('','Cancel') }} />
              {
                props.section === 'timeslot' && (

                  <Button type="primary"  value={CreateAlarmLoading ? "...Loading" : t('create') } onClick={saveAlarm} disabled={CreateAlarmLoading ? true : false} />
                ) }
                {props.section !== 'timeslot' && (

                  <Button type="primary"  value={UpdateAlarmLoading ? "...Loading" :t('Update')} onClick={editAlertForm} disabled={UpdateAlarmLoading ? true : false}/>
                )
              }
            </div>
</div>
          <HorizontalLine variant='divider1' />
      <div className="p-4">
      <Grid container spacing={4} >
        <Grid item xs={12} sm={12}>
          <TextField
            id="title"
            label={t("alarmName")}
            inputRef={alarmName}
            placeholder={t("typeTitle")}
           
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <SelectBox
            labelId=""
            id="combo-box-demo"
            auto={false}
            label={t('Entity')}
            options={finalEntityOption}
            keyValue="name"
            keyId="id"
            value={entityValue}
            isMArray={true}
            onChange={handleEntity}
          />
          </Grid>
          <Grid item xs={4} sm={4}>
          <SelectBox
            labelId=""
            id="combo-box-demo"
            auto={false}
            label={t('Timeslot')}
            options={timeSlotOption}
            keyValue="value"
            keyId="id"
            value={selectedTimeSlot}
            isMArray={true}
            onChange={handleTimeSlot}
          />
          </Grid>
              
      </Grid>
      <div className="flex justify-around mt-4 mb-0.5" >
          <Typography value='Level' variant='label-02-s' />
          <Typography value='Check' variant='label-02-s' />
          <Typography value='Value' variant='label-02-s' />
         </div>
          <Grid container spacing={4} >
          <Grid item xs={4} sm={4}>
          <TextField
            id="title"
            value={t("Warning")}
            NoMinus
            placeholder={t("enterValue")}
            disabled
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <SelectBox
            labelId=""
            id="combo-box-demo"
            auto={false}
            options={checkOption}
            keyValue="value"
            keyId="id"
            value={warningCheck}
            placeholder={t("selectCheck")}
            onChange={(e) => updateCheck(e, 1)}
            isMArray={true}
          
          />
          </Grid>
          <Grid item xs={4} sm={4}> 
                <TextField
                  id="title"
                  type="number"
                  NoMinus
                  value={warningValue}
                  placeholder={t("enterValue")}
                  onChange={(e) => updateValue(e, 1)}
                /> 
            </Grid>       
          </Grid>
          <div className="mb-4" />
          <Grid container spacing={4} >
          <Grid item xs={4} sm={4}>
          <TextField
            id="title"
            value={t("Critical")}
            disabled
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <SelectBox
            labelId=""
            id="combo-box-demo"
            auto={false}
            options={checkOption}
            value={criticalCheck}
            placeholder={t("selectCheck")}
            isMArray={true}
            checkbox={false}
            onChange={(e) => updateCheck(e, 2)}
            keyValue="value"
            keyId="id"
          />
          </Grid>
          <Grid item xs={4} sm={4}>
                <TextField
                  id="title"
                  type="number"
                  NoMinus
                  placeholder={t("enterValue")}
                  value={criticalValue}
                  onChange={(e) => updateValue(e, 2)}
                />
        </Grid>        
          </Grid>
          <div className="mb-4" />
          <Grid item xs={12} sm={12}>
          <TextField
            id="remarks"
            label={t("remarks")}
            inputRef={alarmRemarks}
            placeholder={t("typeRemarks")}
                        
          />


        </Grid>
        <div className="mb-4" />

        <Grid item xs={12} sm={12}>
          <Grid container spacing={4} >
            <Grid item xs={3} sm={3}>
              <Typography  variant="paragraph-xs" value={t('Alertme')} />

            </Grid>
            <Grid item xs={3} sm={3} >
              <SwitchCustom
                switch={false}
                checked={CheckmeSMS}
                onChange={(e) => handleCheckme(e, 1)}
                primaryLabel={t('SMS')}
                disabled={isAlerAccess ? false : true}

              />

            </Grid>
            <Grid item xs={3} sm={3} >
              <SwitchCustom
                switch={false}
                checked={CheckmeEmail}
                onChange={(e) => handleCheckme(e, 2)}
                primaryLabel={t('Email')}
              />
            </Grid>
          </Grid>
          <Grid item xs={3} sm={3}>
          <Typography  variant="paragraph-xs" value={t('AlertOtherUsers')} style={{marginBottom:"4px"}}/>

        </Grid>
        <Grid item xs={12} sm={12}>

          {
            UserFields.map((val,i) => {
              let buttonComponent1;

              if (UserFields.length - 1 === i) {
                buttonComponent1 = (
                  <Button 
                    type="ghost" 
                    icon={AddLight} 
                    id={`add-icon-${i}`} // Unique ID for Add button
                    stroke={useThemes.colorPalette.primary} 
                    onClick={() => {
                      addOtherUser(val.field);
                      document.activeElement?.blur(); // Unfocus the Delete button if it's active
                    }} 
                  />
                );
              } else if (UserFields.length !== 1) {
                buttonComponent1 = (
                  <Button 
                    type="ghost" 
                    danger 
                    icon={Delete} 
                    id={`delete-icon-${i}`} // Unique ID for Delete button
                    stroke={useThemes.colorPalette.genericRed} 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOtherUser(val.field);
                    }} 
                  />
                );
              } else {
                buttonComponent1 = (
                  <Button 
                    type="ghost" 
                    icon={AddLight} 
                    id={`add-icon-${i}`} // Unique ID for Add button
                    stroke={useThemes.colorPalette.primary} 
                    onClick={() => {
                      addOtherUser(val.field);
                      document.activeElement?.blur(); // Unfocus the Delete button if it's active
                    }} 
                  />
                );
              }
              

              return <Grid key={i+1} container spacing={4} >
                <Grid item xs={3} sm={3}>
                  <SelectBox
                    labelId=""
                    id="combo-box-demo"
                    options={UserOption.filter(x => x.userByUserId.id !== props.currUser.id)}
                    auto={true}
                    multiple={false}
                    isMArray={true}
                    checkbox={false}
                    keyValue="value"
                    keyId="id"
                    dynamic={UserFields}
                    placeholder={t("SelectaUser")}
                    value={val.user_id} 
                    onChange={(e,r) => addUsers(e, r,val.field)} 
                  />
                </Grid>

                <Grid item xs={3} sm={3} >

                  <SwitchCustom
                    switch={false} 
                    checked={val.alert_SMS} 
                    onChange={(e) => addUserValuesms(e, val.field)}
                    primaryLabel={t('SMS')}
                   disabled={isAlerAccess ? false : true}

                  />
                </Grid>
                <Grid item xs={3} sm={3} >
                  <SwitchCustom
                    switch={false}
                    checked={val.alert_email}
                    onChange={(e) => addUserValueEmail(e, val.field)}
                    primaryLabel={t('Email')}
                  />
                </Grid>
                
                <Grid item xs={3} sm={3} style={{ marginTop: "12px" }}>
                {buttonComponent1}
                      </Grid>


              </Grid>
            })
          }
        </Grid>
        {
            !isAlerAccess && 
          <Grid item xs={12} sm={12}>
             <div className="flex items-center gap-2">
           <Information style={{ color: curTheme === "light" ? "#242424" : "#A6A6A6", marginLeft: "10px" }} />
            <Typography value={t ("Please contact the support team to enable SMS services.")} color={"danger"} variant={'lable-01-s'} />
          </div>
          </Grid>
          }
        <Grid item xs={3} sm={3}>
          <Typography variant="Caption1" value={t('CommunicationChannel')} style={{marginBottom:"5px"}} />

        </Grid>
        <Grid item xs={12} sm={12}>
          {
            channelFields.map((val,i) => {
              let buttonComponent;

              if (channelFields.length - 1 === i) {
                buttonComponent = (
                  <Button 
                    type="ghost" 
                    icon={AddLight} 
                    id={`add-channel-icon-${i}`} // Unique ID for Add button
                    stroke={useThemes.colorPalette.primary} 
                    onClick={() => {
                      addChannel();
                      document.activeElement?.blur(); // Unfocus the Delete button if active
                    }} 
                  />
                );
              } else if (channelFields.length !== 1) {
                buttonComponent = (
                  <Button 
                    type="ghost" 
                    danger 
                    icon={Delete} 
                    id={`delete-channel-icon-${i}`} // Unique ID for Delete button
                    stroke={useThemes.colorPalette.genericRed} 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChannel(val.field);
                    }} 
                  />
                );
              } else {
                buttonComponent = (
                  <Button 
                    type="ghost" 
                    icon={AddLight} 
                    id={`add-channel-icon-${i}`} // Unique ID for Add button
                    stroke={useThemes.colorPalette.primary} 
                    onClick={() => {
                      addChannel();
                      document.activeElement?.blur(); // Unfocus the Delete button if active
                    }} 
                  />
                );
              }
              
              return <div key={i+1} style={{ marginBottom: "15px" }}>
                <Grid container spacing={4} >
                  <Grid item xs={4} sm={4}>

                    <SelectBox
                      labelId="hierarchyView"
                      id="hierarchy"
                      auto={false}
                      multiple={false}
                      isMArray={true}
                      checkbox={false}
                      placeholder={t('SelectChannel')}
                      options={ChannelList}
                      keyValue="name"
                      keyId="id"
                      dynamic={channelFields}
                      value={val.channel_id ? val.channel_id : ""}
                      onChange={(e) => addChannelName(e, val.field)}

                    />


                  </Grid>
                  <Grid item xs={2} sm={2} >
                  {buttonComponent}
                  </Grid>
                </Grid>
              </div>
            })
          }
        </Grid>
        </Grid>
        </div>
</React.Fragment>
    )



}
)
export default TimeSlot;