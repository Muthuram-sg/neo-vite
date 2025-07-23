import React, { useEffect, useState, useRef,forwardRef,useImperativeHandle } from "react"; 
import useGetTheme from 'TailwindTheme'; 
import Typography from "components/Core/Typography/TypographyNDL"
import { useTranslation } from 'react-i18next';
import { themeMode, snackToggle, snackMessage, snackType, user} from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import Grid from 'components/Core/GridNDL'
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Button from 'components/Core/ButtonNDL';
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL' 
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL';
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useGetChannelListForLine from "components/layouts/Alarms/hooks/useGetChannelListForLine";
import UseAddConnectivity from "components/layouts/Alarms/hooks/useAddConnectivity";
import useUpdateConnectivity from "components/layouts/Alarms/hooks/useUpdateConnectivity";
import LoadingScreenNDL from 'LoadingScreenNDL'
import MessageModal from "./MessageModal";
import Information from 'assets/neo_icons/Menu/Information.svg?react';
import useGetAlarmSMSUser from "../hooks/useGetAlarmSMSUser";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";


const  ConnectivityAlert=forwardRef((props,ref)=>{ 
  const useThemes = useGetTheme();
  const [curTheme] = useRecoilState(themeMode);
  const [IsLoading,setIsLoading] = useState(true); 
 
  const classes = { 
    typographyHeading: {
      marginTop: 10,
      fontWeight: "600",
      fontSize: 14
    }, 
    headerColor: useThemes.colorPalette.primary,  
    headerDiv: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: "center"
    },
    radioDiv: {
      display: 'flex',
      justifyContent: 'left',
      alignItems: "center"
    } 
  };
  const { t } = useTranslation();
  const [currUser] = useRecoilState(user);
  const [editId,seteditId] = useState("")
  const [InstrumentName, setInstrumentName] = useState([]);
  const [durationType, setDurationType] = useState("");
  const [duration, setDuration] = useState("");
  const [alertMeSMS, setAlertMeSMS] = useState(false);
  const [alertMeEmail, setAlertMeEmail] = useState(false);
  const [UserOption, setUserOption] = useState([])
  const [channelFields, setChannelFields] = useState([]);
  const [ChannelList, setChannelList] = useState([]);  
  const [instrumentID, setInstrumentID] = useState('');
  const [gatewayID, setGatewayID] = useState('');
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [isConfirm,setIsConfirm] = useState(false);
  const [connectivityType, setConnectivityType] = useState(1)
  const [channel_ids, setChannelIds] = useState([])
  const [sms_user_ids, setSMSUserIds] = useState([])
  const [email_user_ids, setEmailUserIds] = useState([])
  const [sms_users, setSMSUsers] = useState([])
  const [email_users, setEmailUsers] = useState([])
  const [isUserChanged, setUserChange] = useState(false);
  const [isAlerAccess,setisAlerAccess] = useState(false)
   const { AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError,getAlarmSMSUser} = useGetAlarmSMSUser()
    
  const alarmName = useRef();
  const messageRef = useRef();

  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();  
  const { addConnectivityLoading, addConnectivityData, addConnectivityError, addConnectivity } = UseAddConnectivity(); // use hook for insert new connectivity
  const{ updateConnectivityLoading, updateConnectivityData, updateConnectivityError, updateConnectivity } = useUpdateConnectivity()
 
let durationTypeOption = [
    { id: "time_interval", value: t('timeInterval') },
    { id: "last_n_rows", value: t('lastCount') },

  ]
  const durationOption = [
    { id: "60", value: "1 Min" },
    { id: "120", value: "2 Min" },
    { id: "300", value: "5 Min" },
    { id: "600", value: "10 Min" },
    { id: "900", value: "15 Min" },
    { id: "1800", value: "30 Min" },
    { id: "2700", value: "45 Min" },
    { id: "3600", value: "1 Hr" },
    { id: "7200", value: "2 Hr" },
    { id: "10800", value: "3 Hr" },
    { id: "18400", value: "4 Hr" },
    { id: "22000", value: "5 Hr" },
    { id: "25600", value: "6 Hr" },
    { id: "29200", value: "7 Hr" },
    { id: "32800", value: "8 Hr" },
    { id: "36400", value: "9 Hr" },
    { id: "40000", value: "10 Hr" }
  ]
  const countOption = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 }
  ]
  useImperativeHandle(ref,()=>({
    connectivityEdit : (value)=>connectivityEdit(value)
}))


const connectivityEdit =(value)=>{
  console.log(value)
  setIsLoading(false)
  try{
    alarmName.current.value= value.name
      seteditId(value.id)
      setConnectivityType(value.connectivity_type)
      setInstrumentID(value.instrument_id);
      setGatewayID(value.gateway_id)
    
      setDurationType(value.check_type)
      setDuration(value.check_last_n)

      if(value.alert_users &&value.alert_users.length > 0){ // edit user details for SMS & Email
        let smsUsers = [];
        let emailUsers = [];
        // NOSONAR
        value.alert_users.map(val=>{
          if(val.sms){
            smsUsers.push(UserOption.find((d) => d.id === val.user_id));
          }
          if(val.email){
            emailUsers.push(UserOption.find((d) => d.id === val.user_id));
          }
          let list1 = smsUsers.map((d) => d.id);
          setSMSUserIds(list1) 
          let list2 = emailUsers.map((d) => d.id);
          setEmailUserIds(list2);
        });
        console.log(smsUsers,emailUsers)
        if(smsUsers.length > 0)
          setAlertMeSMS(true)
        if(emailUsers.length > 0)
          setAlertMeEmail(true)
        setSMSUsers(smsUsers)
        setEmailUsers(emailUsers)
        
      }
      let newarr =[];let temp = [];
      if(value.alert_channels && value.alert_channels.length > 0){ // Edit Channel details
        value.alert_channels.map((val,i)=>
          newarr.push(ChannelList.find((c) => c.id === val))
        )
        // NOSONAR
        value.alert_channels.map((val,index) => {
          let chn = ChannelList.find((c) => c.id === val);
          let tempobj = { field: index+1, channel_id: chn.id, channel_name: chn.name };
          temp.push(tempobj);
        })
        console.log(temp)
        setChannelFields(temp);
      }
      setChannelIds(newarr)

  }
  catch(err){
    console.log('Error on connectivity form',err);
  }
}
  useEffect(() => {
    getUsersListForLine(props.headPlant.id)
    getChannelListForLine(props.headPlant.id)
    if(props.section === "connectivity"){
      setIsLoading(false)
    }
    getAlarmSMSUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.headPlant])

  useEffect(()=>{
    if(!AlarmSMSUserLoading &&   AlarmSMSUserData  && !AlarmSMSUserError){
        let isHaveAccess = AlarmSMSUserData.filter(x=>x.user_id === currUser.id && x.is_enable) 
        console.log(AlarmSMSUserData,"AlarmSMSUserData",isHaveAccess,currUser.id) 
        if(isHaveAccess.length > 0){
            setisAlerAccess(true)
        }else{
            setisAlerAccess(false)

        }
        
    } // eslint-disable-next-line react-hooks/exhaustive-deps
},[AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError])

  useEffect(() => {
    if (!addConnectivityLoading && !addConnectivityError && addConnectivityData) {
    
      openNotification(t('New Connectivity Created'), 'success');
      props.changeSection('','Cancel')
    }
    if (!addConnectivityLoading && addConnectivityError && !addConnectivityData) {
      openNotification(t('BulkConnectivityError'), 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addConnectivityData,addConnectivityError,addConnectivityLoading])
  useEffect(()=>{
    if(!updateConnectivityLoading && updateConnectivityData && !updateConnectivityError){
      setSnackMessage(editId ? t('Alarm Updated Successfully') : t('Alarm Created'));
              setOpenSnack(true); setSnackType('success');
              props.changeSection('','Cancel')
    }
    if(!updateConnectivityLoading && !updateConnectivityData &&  updateConnectivityError){
      setSnackMessage(t("Alarm Creating has failed"));
      setOpenSnack(true); setSnackType('warning');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateConnectivityData] )
  
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

  const openNotification = (content, type) => {
    setSnackMessage(content); setSnackType(type); setOpenSnack(true);
  }

  const handleConnectivityType = (type) => {
    setConnectivityType(type)
    // NOSONAR
    if(type == 2){
      setDurationType("time_interval");
      setDuration(3600)
    }
  }
  const handleInstruments = (e,data) => {
    if (e) {
      setInstrumentID(e.target.value);
      setInstrumentName(data.filter(x=> x.id === e.target.value))
    }
    else {
      setInstrumentName([])
      setInstrumentID('');
    }
  }
  const handleGateway = (e,data) => {
    if (e) {
      setGatewayID(e.target.value);
      setInstrumentName(data.filter(x=> x.id === e.target.value))
    }
    else {
      setInstrumentName([])
      setGatewayID('');
    }
  }
  const handleDurationType = (e) => {
    if (e.target.value) {
      setDurationType(e.target.value);
    }
  }

  const handleDuration = (e) => {
    if (e.target.value) {
      setDuration(e.target.value);
    }
  }

  // alert me sms checkbox toggle
  const handleAlertMeSMS = (e) => {
    setAlertMeSMS(e.target.checked)
  }

  // alert me mail checkbox toggle
  const handleAlertMeMail = (e) => {
    setAlertMeEmail(e.target.checked)
  }

  // Add channel to send Alarm
  const handleMultiChannelChange = (e) => {
    console.log(e.length,e)
    let temp = [];
    if(e.length > 0){
      temp = e.map((elt,index) => {
        return { field: index+1, channel_id: elt.id, channel_name: elt.name }
      })
    }
    console.log(temp)
    setChannelFields(temp);
    if(props.section !== "connectivity"){
      setUserChange(true);
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

  //save function
  const saveConnectivityAlarm = () => {
    try {
      if (InstrumentName.length === 0 && connectivityType == 1) {
        openNotification(t('Please select an instrument'), 'warning')
        return;
      }
      else if(InstrumentName.length === 0 && connectivityType == 2){
        openNotification(t('Please select a gateway'), 'warning')
        return;
      }
      if (durationType === '') {
        openNotification(t('Please Select Duration Type'), 'warning')
        return;
      }
      // NOSONAR
      if (duration === '' || duration == 0) {
        openNotification(durationType === 'last_n_rows' ? t('Please Select number of counts') : t('Please Select duration limit'), 'warning')
        return;
      }
      // NOSONAR
      if(alertMeSMS && sms_users.length == 0){
        openNotification(t('Please Select users for SMS alert'), 'warning')
        return;
      }
      // NOSONAR
      if(alertMeEmail && email_users.length == 0){
        openNotification(t('Please Select users for Email alert'), 'warning')
        return;
      }

      //Unique validation
      let exist;
      // NOSONAR
      if(connectivityType == 1)
        exist = props.alertList.filter(x => x.instrument_id === instrumentID.toString() && x.alertType === 'connectivity')
      // NOSONAR
      else if(connectivityType == 2)
        exist = props.alertList.filter(x => x.gateway_id === gatewayID && x.alertType === 'connectivity')
      if (exist.length > 0) {
        let name = connectivityType == 1 ? exist[0].instrument_name : exist[0].gateway_name
        openNotification(t('Alarm for '+name+' Already Exist'), 'warning')
        return;
      }
      let listChanel = [];
      let channelsarr = [];
      if (channelFields.length > 0) {
        channelsarr = processChannelFields(channelFields,listChanel);
      }
      const alertList = InstrumentName.map(x=>{
        let connectivity_name = connectivityType == 1 ? "connectivity_" : "gateway_";
        let result = {
          alert_channels: "{" + listChanel.toString() + "}",
          alert_users: formUserDetails(),
          delivery: channelsarr.length > 0 ? channelsarr[0] : {},
          line_id: props.headPlant.id, 
          name: connectivity_name+"alert_"+x.name,
          created_by: currUser.id,
          check_type: durationType,
          check_last_n: duration,
          connectivity_type: connectivityType
        };  
        // NOSONAR
        if(connectivityType == 1)  
          result.instrument_id = x.id;
        else
          result.gateway_id = x.id;
        return result
      }) 
      console.log(alertList);//return false;
      removeDuplicateAlarm(alertList) 
    } catch (err) {
      openNotification(t('Connectivity creation failed'), 'error')
    }
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

  const updateAlarm = () => {
    if(isUserChanged)
      messageRef.current.handleDialogOpen()
    else
      editConnectivityAlarm();
  }

  const editConnectivityAlarm=()=>{
   
      if (alarmName.current.value === '') {
        openNotification(t('Please enter a connectivity name'), 'warning')
        return false;
        // NOSONAR
      } else if (instrumentID === '' && connectivityType == 1) {
        openNotification(t('Please select an instrument'), 'warning')
        return;
        // NOSONAR
      }else if (gatewayID == 0 && connectivityType == 2) {
        openNotification(t('Please select a gateway'), 'warning');
        return;
    }
      if (durationType === '') {
        openNotification(t('Please Select Duration Type'), 'warning')
        return;
      }
      // NOSONAR
      if (duration === '' || duration == 0) {
        openNotification(durationType === 'last_n_rows' ? t('Please Select number of counts') : t('Please Select duration limit'), 'warning')
        return;
      }// NOSONAR
      if(alertMeSMS && sms_users.length == 0){
        openNotification(t('Please Select users for SMS alert'), 'warning')
        return;
      }// NOSONAR
      if(alertMeEmail && email_users.length == 0){
        openNotification(t('Please Select users for Email alert'), 'warning')
        return;
      }

      //Unique validation
      let exist;
      if(connectivityType == 1)
        exist = props.alertList.filter(x => x.instrument_id === instrumentID.toString() && x.alertType === 'connectivity' && x.id !== editId)
      else if(connectivityType == 2)
        exist = props.alertList.filter(x => x.gateway_id === gatewayID && x.alertType === 'connectivity' && x.id !== editId)
      if (exist.length > 0) {
        let name = connectivityType == 1 ? exist[0].instrument_name : exist[0].gateway_name
        openNotification(t('Alarm for '+name+' Already Exist'), 'warning')
        return;
      }

      let listChanel = [];
      let channelsarr = [];
      if (channelFields.length > 0) {
        channelsarr = processChannelFields(channelFields,listChanel);
      }
      let data = {
        id:editId,
        alert_channels: "{" + listChanel.toString() + "}",
        alert_users: formUserDetails(),
        delivery: channelsarr.length > 0 ? channelsarr[0] : {},
        instrument_id: connectivityType == 1 ? instrumentID : null,
        gateway_id: connectivityType == 2 ? gatewayID : null,
        name: alarmName.current.value,
        updated_by: currUser.id,
        check_type: durationType,
        check_last_n: duration,
        connectivity_type: connectivityType
      };
      console.log(data)
      updateConnectivity(data)
  }
  const removeDuplicateAlarm = (alertList) =>{
    console.log(alertList)
    addConnectivity(alertList);
  } 
  
  const enableConfirmButton = () => setIsConfirm(true)

  const handleUsers = (data,type) => {
    type === 'SMS' ?  setSMSUsers(data) : setEmailUsers(data);
    let list = data.map((d) => d.id);
    type === 'SMS' ?  setSMSUserIds(list) : setEmailUserIds(list);
    if(props.section !== "connectivity"){
      setUserChange(true);
    }
  }

  const formUserDetails = () => {
    //User details for SMS & Email
    let alertUser = []
    if (alertMeSMS || alertMeEmail) {
      if(alertMeSMS && !alertMeEmail){ // SMS only
        sms_user_ids.forEach((val, index) => {
          alertUser.push({
            "user_id": val,
            "email": false,
            "sms": true
          });
        });
      }
      else if(!alertMeSMS && alertMeEmail){ // Email only
        email_user_ids.forEach((val, index) => {
          alertUser.push({
            "user_id": val,
            "email": true,
            "sms": false
          });
        });
      }
      else{ // Both SMS & Email
        let mainArray = sms_user_ids.length > email_user_ids.length ? sms_user_ids : email_user_ids;
        let subArray = sms_user_ids.length <= email_user_ids.length ? sms_user_ids : email_user_ids;
        let main = sms_user_ids.length > email_user_ids.length ? 'SMS' : 'Email';
        let sub = sms_user_ids.length <= email_user_ids.length ? 'SMS' : 'Email';
        mainArray.forEach((val) => {
          alertUser.push({
            "user_id": val,
            "email": main === 'Email' ? true : false,
            "sms": main === 'SMS' ? true : false
          });
        }); 
        let same = subArray.filter((element) => mainArray.includes(element));
        same.forEach((sVal) => {
          let check = alertUser.findIndex((d) => d.user_id === sVal);
          if(check >= 0){
            alertUser[check] = {
              "user_id": sVal,
              "email": true,
              "sms": true
            }
          }
        })
        let difference = subArray.filter((element) => !mainArray.includes(element)); 
        difference.forEach((diff) => {
          alertUser.push({
            "user_id": diff,
            "email": sub === 'Email' ? true : false,
            "sms": sub === 'SMS' ? true : false
          });
        })
      }
    }
    console.log(alertUser)
    return alertUser;
  }

  if(connectivityType === 1){
    durationTypeOption = [
      { id: "time_interval", value: t('timeInterval') },
      { id: "last_n_rows", value: t('lastCount') },
    ]
  }
  else{
    durationTypeOption = [
      { id: "time_interval", value: t('timeInterval') }
    ]
  }
  
  return (
    <React.Fragment>
       <div  className=" py-2 px-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark flex items-center justify-between h-[48]">
          <Breadcrumbs breadcrump={props.listArr} onActive={props.handleActiveIndex} />
          <div className="flex gap-2">
              <Button type={"secondary"}  value={t('Cancel')} onClick={() => { props.changeSection('','Cancel')}} />
             
           {(() => {
                          if (props.section === "connectivity") {
                            if (isConfirm) {
                              return (
                                <Button
                                  type={"primary"}
                                  value={"Confirm Save"}
                                  onClick={() => {
                                    saveConnectivityAlarm();
                                  }}
                                />
                              );
                            } else {
                              return (
                                <Button
                                  type={"primary"}
                                  value={t("create")}
                                  onClick={() => {
                                    enableConfirmButton();
                                  }}
                                />
                              );
                            }
                          } else {
                            return (
                              <Button
                                type={"primary"}
                                value={t("Update")}
                                onClick={() => {
                                  updateAlarm();
                                }}
                              />
                            );
                          }
                        })()}
            </div>
      </div>
      <HorizontalLine variant='divider1' />
      <div className="p-4">
          {
            IsLoading && <LoadingScreenNDL />
          }
          <MessageModal ref={messageRef} editConnectivityAlarm={editConnectivityAlarm} />
         
      <Grid container spacing={4} >
        {
           props.section !== "connectivity" && (
              <Grid item xs={12} sm={12}>
                <Typography  variant="heading-02-sm" value={t("Connectivity Name")} style={classes.typographyHeading} />
                <InputFieldNDL
                  id="title" 
                  placeholder={t("Connectivity Name")}
                  inputRef={alarmName}
                />
              </Grid>
           )
        }
        <Grid item xs={12} sm={12}>
          <div className="flex items-center gap-4">
            <RadioNDL name={t('Instrument')} labelText={t('Instrument')} id={"Instrument"} checked={connectivityType == 1 ? true : false} onChange={() => handleConnectivityType(1)} />
            <RadioNDL name={t('Gateway')} labelText={t('Gateway')} id={"Gateway"} checked={connectivityType == 2 ? true : false} onChange={() => handleConnectivityType(2)} />
          </div>
        </Grid>
        
          <Grid item xs={12} sm={12}>
          {connectivityType === 1 ?
          (
            <Grid item xs={4} sm={4} style={{width:"32.5%"}}>
              <SelectBox
              labelId="lblInstrumentList"
              id="InstrumentList"
              label={t('Instruments')}
              auto={true}
              edit={true}
              options={props.InstrumentList}
              keyValue="name"
              keyId="id"
              value={instrumentID}
              isMArray={true}
              onChange={(e, option) => handleInstruments(e,option)}
            />
            </Grid>
          )
          :
          (
            <Grid item xs={4} sm={4} style={{width:"32.5%"}}>
              <SelectBox
              labelId="lblGatewayList"
              id="GatewayList"
              label={t('Gateway')}
              auto={true}
              edit={true}
              options={props.GateWayList}
              keyValue="name"
              keyId="id"
              value={gatewayID}
              isMArray={true}
              onChange={(e, option) => handleGateway(e,option)}
            />
            </Grid>
          )
          }
          </Grid>
          {/*NOSONAR */}
        {connectivityType == 1 && 
        <React.Fragment>
          <Grid item xs={4} sm={4}>
            <SelectBox
              labelId="durationType"
              id="duration-Type"
              auto={false}
              label={t('Duration Type')}
              multiple={false}
              value={durationType}
              options={durationTypeOption}
              isMArray={true}
              checkbox={false}
              onChange={handleDurationType}
              keyValue="value"
              keyId="id"
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            {durationType !== 'last_n_rows' ?
              <SelectBox
                labelId="durationType"
                id="duration-Option"
                label={t('Duration') }
                auto={false}
                multiple={false}
                value={duration.toString()}
                options={durationOption}
                isMArray={true}
                checkbox={false}
                onChange={handleDuration}
                keyValue="value"
                keyId="id"
              />
              :
              <SelectBox
                labelId="lblLast-n-count"
                id="last-n-count"
                label={t('Count')}
                auto={false}
                multiple={false}
                value={duration}
                options={countOption}
                isMArray={true}
                checkbox={false}
                onChange={handleDuration}
                keyValue="value"
                keyId="id"
              />
            }
          </Grid>
          <Grid item xs={4} sm={4}></Grid>
        </React.Fragment>
        }
        </Grid>
        <div className="mb-4" />
          <div className="flex items-center justify-around">
          <CustomSwitch
                id={'alertMeSMS'}
                switch={false}
                checked={alertMeSMS}
                onChange={handleAlertMeSMS}
                primaryLabel={t('SMS')}
                disabled={isAlerAccess ? false : true}

              />
              <CustomSwitch
                id={'alertMeEmail'}
                switch={false}
                checked={alertMeEmail}
                onChange={handleAlertMeMail}
                primaryLabel={t('Email')}
              />
         
            <Typography   value={t('CommunicationChannel')} />
          </div>
          <Grid container spacing={4}>
          <Grid item xs={4} sm={4} >
            <SelectBox
                labelId="lblAlertOtherUsers"
                id={"AlertOtherUsers"}
                edit={true}
                auto={true}
                multiple={true}
                placeholder={t('Select Users')}
                isMArray={true}
                checkbox={true}
                selectall={true} 
                selectAllText={t('All Users')}
                keyId="id"
                keyValue="value"
                options={UserOption !== null && UserOption && alertMeSMS ? UserOption : []}
                value={sms_users ? sms_users : []}
                onChange={(e) => handleUsers(e,'SMS')}
                disabled={!alertMeSMS}
              />
          </Grid>
          <Grid item xs={4} sm={4}>
          <SelectBox
                labelId="lblAlertOtherUsers"
                id={"AlertOtherUsers"}
                auto={true}
                edit={true}
                multiple={true}
                placeholder={t('Select Users')}
                isMArray={true}
                checkbox={true}
                selectall={true} 
                keyId="id"
                keyValue="value"
                options={UserOption !== null && UserOption && alertMeEmail ? UserOption : []}
                value={email_users ? email_users : []}
                onChange={(e) => handleUsers(e,'EMail')}
                disabled={!alertMeEmail}
              />
          </Grid>
          <Grid item xs={4} sm={4}>
              <SelectBox
                labelId="lblCommunicationChannel"
                id={"CommunicationChannel"}
                auto={true}
                edit={true}
                multiple={true}
                isMArray={true}
                checkbox={true}
                placeholder={t("SelectChannel")}
                keyId="id"
                keyValue="name"  
                // dynamic={channelFields}
                options={ChannelList !== null && ChannelList ? ChannelList : []}
                value={channel_ids ? channel_ids : ""}
                onChange={(e) => handleMultiChannelChange(e)}
              />
          </Grid>
          {
            !isAlerAccess && 
          <Grid item xs={12} sm={12}>

             <div className="flex items-center gap-2">
           <Information style={{ color: curTheme === "light" ? "#242424" : "#A6A6A6", marginLeft: "10px" }} />
            <Typography value={t ("Please contact the support team to enable SMS services.")} color={'danger'} variant={'lable-01-s'} />
          </div>
          </Grid>
          }
        <Grid item xs={12} sm={12}>
          <Typography  value={t('BulkConnectivityNote')} variant={"Caption1"} style={{ color: curTheme==='dark' ? useThemes.colorPalette.genericRed : '#ffff', marginTop: '15px' }} />
        </Grid>
</Grid>
      </div>
    </React.Fragment>
  )

}
)
export default ConnectivityAlert;