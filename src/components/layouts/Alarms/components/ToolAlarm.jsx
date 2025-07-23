import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL';
import useGetTheme from 'TailwindTheme';
import { useTranslation } from 'react-i18next';
import { snackToggle, snackMessage, snackType, selectedPlant, user } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import Button from 'components/Core/ButtonNDL';
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL'
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import InputFieldNDL from 'components/Core/InputFieldNDL'; 
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";

import useGetChannelListForLine from "../hooks/useGetChannelListForLine";
import useCreateAlarm from '../hooks/useCreateAlarm';
import useUpdateAlarm from '../hooks/useUpdateAlarm';
import useGetInstMetForAsset from '../hooks/useGetInstMetForAsset';
import useGetAlarmSMSUser from '../hooks/useGetAlarmSMSUser';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import Information from 'assets/neo_icons/Menu/Information.svg?react';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";



const ToolAlarm = forwardRef((props, ref) => {
  const useThemes = useGetTheme();
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant)
 
  const limitRef = useRef(null);
  const limitPercRef= useRef(null);
  const CrilimitPercRef= useRef(null); 
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [alertid, setalertid] = useState('')
  const [ToolnameError,setToolnameError] = useState('')
  
  const [selectedTool, setselectedTool] = useState('')
  const [OpenDialog, setOpenDialog] = useState(false);
  const [ActionType, setActionType] = useState('')
  const [ActionMsg, setActionMsg] = useState('')
  const [percLimit,setpercLimit]  = useState(90)
  const [CripercLimit,setCripercLimit]  = useState(100)
  const [warnError,setwarnError]  = useState('')
  const [cricError,setcricError] = useState('')

  const [CheckmeSMSWarning, setCheckmeSMSWarning] = useState(false);
  const [CheckmeSMSCritical, setCheckmeSMSCritical] = useState(false);
  const [CheckmeEmailWarning, setCheckmeEmailWarning] = useState(false);
  const [CheckmeEmailCritical, setCheckmeEmailCritical] = useState(false);
  
  const [userIDWarnSMS, setUserIDWarnSMS] = useState([]) 
  const [userIDWarnEmail, setUserIDWarnEmail] = useState([]) 
  const [channelIDWarn, setChannelIDWarn] = useState([]) 
  const [InstMetID, setInstMetID] = useState(0) 
  const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();
  const { CreateAlarmLoading, CreateAlarmData, CreateAlarmError, getCreateAlarm } = useCreateAlarm()
  const { UpdateAlarmLoading, UpdateAlarmData, UpdateAlarmError, getUpdateAlarm } = useUpdateAlarm()
  const { InstMetLoading, InstMetData, InstMetError, getInstMetForAsset } = useGetInstMetForAsset();
  const [currUser] = useRecoilState(user);
  const [isAlerAccess, setisAlerAccess] = useState(true)
  const { AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError, getAlarmSMSUser } = useGetAlarmSMSUser()
  

  useEffect(() => { 
    getChannelListForLine(headPlant.id)
    getAlarmSMSUser() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  useImperativeHandle(ref, () => ({
    ToolEdit: (value) => ToolEdit(value)
  })) 
 
  useEffect(() => {
    if ((!CreateAlarmLoading && CreateAlarmData && !CreateAlarmError)) {
      setSnackMessage(t("New Alarm rules created"))
      setSnackType("success")
      setOpenSnack(true)
      props.changeSection('', 'Cancel')
    }
    if ((CreateAlarmLoading && !CreateAlarmData && CreateAlarmError)) {
      setSnackMessage(t("New Alarm rules creation failed"))
      setSnackType("error")
      setOpenSnack(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CreateAlarmData])

  useEffect(() => {
    if (!InstMetLoading && InstMetData && !InstMetError)
      setInstMetID(InstMetData ? Number(InstMetData) : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InstMetLoading, InstMetData, InstMetError])

  useEffect(() => {
    if ((!UpdateAlarmLoading && UpdateAlarmData && !UpdateAlarmError)) {
      setSnackMessage(alertid ? t('Alarm Updated Successfully') : t('Alarm Created'));
      setOpenSnack(true); setSnackType('success');
      props.changeSection('', 'Cancel')
    }
    if ((UpdateAlarmLoading && !UpdateAlarmData && UpdateAlarmError)) {
      setSnackMessage(t("Alarm Creating has failed"));
      setOpenSnack(true); setSnackType('warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateAlarmData])

  
  useEffect(() => {
    if (!AlarmSMSUserLoading && AlarmSMSUserData && !AlarmSMSUserError) {
      let isHaveAccess = AlarmSMSUserData.filter(x => x.user_id === currUser.id && x.is_enable) 
      if (isHaveAccess.length > 0) {
        setisAlerAccess(true)
      } else {
        setisAlerAccess(false)

      }

    } 
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError]) 
   
  const OnchangeTool = (event) => {
    let ToolOpt = props.ToolOption.find(option => option.id === event.target.value)
    let assetName = ToolOpt?.name
    let alertname = props.alertList.filter(x => x.name === assetName && x.entity_type === 'tool')
    if (alertname.length > 0) {
      setOpenSnack(true);
      setSnackMessage(t('Alarm Name Already Exist'));
      setSnackType('warning');
      return false;
    }
    let actLimit = ToolOpt.limit
    limitRef.current.value = actLimit 
    setselectedTool(event.target.value)
    limitPercRef.current.value = (percLimit / 100 ) * actLimit
    CrilimitPercRef.current.value = (CripercLimit / 100 ) * actLimit
    let InstID = ToolOpt.intruments[0].id
    getInstMetForAsset(InstID.toString(), 33)
     

}
  const handleCheckmeWarning = (e, p) => {
    if (p === 1) {
      if (CheckmeSMSWarning && props.section !== 'tool') {
        handleDialog("warnSMS")
      } else if (CheckmeSMSWarning) {
        setUserIDWarnSMS([])
      }
      setCheckmeSMSWarning(!CheckmeSMSWarning);
    } else {
      if (CheckmeEmailWarning && props.section !== 'tool') {
        handleDialog("warnEmail")
      } else if (CheckmeEmailWarning) {
        setUserIDWarnEmail([])
      }
      setCheckmeEmailWarning(!CheckmeEmailWarning);
    }

  }

 
  function handleDialog(type) {
    setOpenDialog(true)
    setActionType(type)
    if(type === 'warnSMS'){
        setActionMsg('You are about to deselect the sms associated with this limit and will no longer receive notifications related to this limit via sms. This action confirms that you are aware of this, and it cannot be undone. Please review carefully before proceeding.')
    }else{
        setActionMsg('You are about to deselect the email associated with this limit and will no longer receive notifications related to this limit via email. This action confirms that you are aware of this, and it cannot be undone. Please review carefully before proceeding.')
    }
  }

  function Submitaction() {
    if (ActionType === 'warnEmail') {
      setUserIDWarnEmail([])
    } else if (ActionType === 'warnSMS') {
      setUserIDWarnSMS([])
    }  
    setOpenDialog(false)
  }

  function cancelAction() {
    setOpenDialog(false)
    setActionType('')
    if (ActionType === 'warnEmail') {
      setCheckmeEmailWarning(!CheckmeEmailWarning);
    } else if (ActionType === 'warnSMS') {
      setCheckmeSMSWarning(!CheckmeSMSWarning);
    } else if (ActionType === 'CricSMS') {
      setCheckmeSMSCritical(!CheckmeSMSCritical);
    } else if (ActionType === 'CricEmail') {
      setCheckmeEmailCritical(!CheckmeEmailCritical);
    }
  }

  const ToolEdit = (value) => {
    // console.log(value,"editDowntime")
    try {
      setalertid(value.id) 
      setInstMetID(value.insrument_metrics_id)
      if (value.name) {
        let Opt = props.ToolOption.find(f => f.name === value.name)
        setselectedTool(Opt.id)
        let Limit = Opt.limit
        limitRef.current.value = Limit
        setCripercLimit((value.critical_value/Limit * 100).toFixed(0))
        setpercLimit((value.warn_value/Limit * 100).toFixed(0))
        CrilimitPercRef.current.value = value.critical_value
        limitPercRef.current.value = value.warn_value
      }

      
       
      if (value.alert_users.length > 0) { 
         
        let warSMSID = value.alert_users[0].warning.filter(x => x.sms).map(c => {
          return props.UserOption.filter(f => f.id === c.user_id)[0]
        })
        if (warSMSID.length > 0) {
          setCheckmeSMSWarning(true)
        }
        setUserIDWarnSMS(warSMSID)
        let warmailID = value.alert_users[0].warning.filter(x => x.email).map(c => {
          return props.UserOption.filter(f => f.id === c.user_id)[0]
        })
        if (warmailID.length > 0) {
          setCheckmeEmailWarning(true)
        }
        setUserIDWarnEmail(warmailID)

      }
      if (value.alert_multi_channels) {
       
        let warnChanel = value.alert_multi_channels[0].warning.map(c => {
          return ChannelListForLineData.filter(f => f.id === c)[0]
        }) 
        setChannelIDWarn(warnChanel.filter(x => x))
      }


    }
    catch (err) {
      console.log('Error on alert form', err);
    }
  }
// NOSONAR
  const saveAlarm = () => {

    if (!selectedTool) {
        setToolnameError('Please select a tool')
      return false;
    }else{
        setToolnameError('')
    }
    let alertUser = []
    // Initialize arrays to store warning and critical alerts
    let warningAlerts = [];  
    // Check conditions and push alerts into appropriate arrays
    if (CheckmeSMSWarning || CheckmeEmailWarning) {
      if ((userIDWarnSMS.length === 0) && CheckmeSMSWarning) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select SMS Users'))
        return false;
      }
      if ((userIDWarnEmail.length === 0) && CheckmeEmailWarning) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select E-mail Users'))
        return false;
      }
      let warmsms = userIDWarnSMS.map(s => {
        return {
          "user_id": s.id,
          "email": (userIDWarnEmail.findIndex(o => o.id === s.id) >= 0) ? true : false,
          "sms": CheckmeSMSWarning
        }
      })
      let warmmail = userIDWarnEmail.map(s => {
        return {
          "user_id": s.id,
          "email": CheckmeEmailWarning,
          "sms": (userIDWarnSMS.findIndex(o => o.id === s.id) >= 0) ? true : false
        }
      })
      warningAlerts = [...warmmail, ...warmsms]
    }
    let uniquewarn = warningAlerts.filter((obj, index) => { // Filter Unique user
      return index === warningAlerts.findIndex(o => obj.user_id === o.user_id);
    });
     
    // Create the final array of objects containing warning and critical alerts

    alertUser = [{
      "warning": uniquewarn,
      "critical": uniquewarn,
    }]  
      if (percLimit === 0 && CripercLimit === 0) {
          setwarnError('Please enter warning or Critical Limit')
          setcricError('Please enter warning or Critical Limit')
        return false;
      }
      else{
       
         
        if (percLimit <= 0.9 || percLimit > 100) {
            setwarnError('Please enter a value between 1-100')
            return false;
        }else{
            setwarnError('')
        }
        
        if (Number(percLimit) > Number(CripercLimit) || percLimit === CripercLimit) {
            setcricError('Must be greater than the warning limit')
            return false;
        } 
        else{
            setcricError('')
        }
        
        if (CripercLimit <= 0.9 || CripercLimit > 100) {
            setcricError('Please enter a value between 1-100')
            return false;
        }else{
            setcricError('')
        }
      }
       
     
    let warningChannel = []; 

    if (channelIDWarn && channelIDWarn.length > 0) {
      channelIDWarn.forEach(channel => {
        if (channel.id) {
          warningChannel.push(channel.id.toString())
        }
      });
    }   
    let alertChannel = [{ "warning": warningChannel, "critical": warningChannel }]
    let ToolSelected = props.ToolOption.find(option => option.id === selectedTool)
    let FromRange = ToolSelected.reset_ts ? ToolSelected.reset_ts : ToolSelected.created_ts

    if (props.section === 'tool') {
      let data = {
        alert_channels: '{}',
        alert_multi_channels: alertChannel,
        alert_users: alertUser,
        entity_type: "tool",
        insrument_metrics_id: InstMetID,
        time_slot_id: null,
        delivery: {},
        check_aggregate_window_function: "last",
        check_aggregate_window_time_range: FromRange,
        check_time: '1m',
        check_time_offset: "0s",
        check_start_time: "-1h",
        line_id: props.headPlant.id,
        critical_type: "above",
        critical_value: CrilimitPercRef.current.value.toString(),
        warn_type: "above",
        warn_value: limitPercRef.current.value.toString(),
        critical_max_value: '',
        critical_min_value: '',
        warn_max_value: '',
        warn_min_value: '',
        name: ToolSelected?.name || "",
        status: "active",
        updated_by: props.currUser.id,
        created_by: props.currUser.id,
        message: '',
        viid: null
      };
      console.log(data,"datadataTool",ToolSelected)
      getCreateAlarm(data)
    } 
    else {
      let data = {
        alert_id: alertid,
        alert_channels: '{}',
        alert_multi_channels: alertChannel,
        entity_type: "tool",
        alert_users: alertUser,
        insrument_metrics_id: InstMetID,
        time_slot_id: null,
        delivery: {},
        check_aggregate_window_function: "last",
        check_aggregate_window_time_range: FromRange,
        critical_type: 'above',
        critical_value: CrilimitPercRef.current.value.toString(),
        warn_type: 'above',
        warn_value: limitPercRef.current.value.toString(),
        critical_max_value: '',
        critical_min_value: '',
        warn_max_value: '',
        warn_min_value: '',
        name: ToolSelected?.name || "",
        updated_by: props.currUser.id,
        // created_by: props.currUser.id,
        message: '',
        viid: null

      };
      getUpdateAlarm(data)
    }
  }

  const addUsers = (e, r, val) => { 
    if (val === 'WarningSMS') {
      setUserIDWarnSMS(e)
    }
    else if (val === 'WarningEmail') {
      setUserIDWarnEmail(e)
    }  

  }
  const addChannel = (e, r, val) => {
    if (val === 'Warning') {
      setChannelIDWarn(e)
    }
    
  }

  return (
    <React.Fragment>
<div  className="py-2 px-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark flex items-center justify-between h-[48px]" >
<Breadcrumbs breadcrump={props.listArr} onActive={props.handleActiveIndex} />

<div className='flex gap-2'>
  <Button type='secondary'  value={t('Cancel')} onClick={() => { props.changeSection('', 'Cancel') }} />

  {
    props.section === 'tool' && (

      <Button type="primary"  value={CreateAlarmLoading ? "...Loading" : t('create')} onClick={saveAlarm} disabled={CreateAlarmLoading ? true : false} />
    )}
  {props.section !== 'tool' && (

    <Button type="primary"  value={UpdateAlarmLoading ? "...Loading" : t('Update')} onClick={saveAlarm} disabled={UpdateAlarmLoading ? true : false} />
  )
  }
</div>
</div>
<HorizontalLine variant='divider1' />
    <div className="p-4">
      <Grid container spacing={4}>
        
        <Grid item xs={3} sm={3}>
          <SelectBox
            labelId="toolSelect-label"
            label="Tool"
            id="toolSelect"
            placeholder={t("Select a Tool")}
            auto={false}
            multiple={false}
            options={props.ToolOption}
            value={selectedTool}
            onChange={OnchangeTool}
            keyValue="name"
            keyId="id"
            disabled={props.section === 'tool' ? false : true}
            error={ToolnameError ? true : false}
            msg={t(ToolnameError)}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
            <InputFieldNDL
            id="Limit" 
            label={"Tool Limit"}
            inputRef={limitRef}
            NoMinus
            disabled={true}
            />
        </Grid>
        <Grid item xs={6} sm={6}></Grid>
        <Grid item xs={3} sm={3}>
            <Typography value={"Level"} style={{textAlign: 'center' }} variant={"lable-01-xs"} />
            <InputFieldNDL
            id="Warning"
            value={t("Warning")}
            label={""}
            disabled={true}
            />
        </Grid>
        <Grid item xs={3} sm={3}>
            <Typography value={"Check"} style={{ textAlign: 'center'  }} variant={"lable-01-xs"} />
            <InputFieldNDL
            id="title-above"
            value={t("Above")}
            label={""}
            disabled={true}
            />
        </Grid>
        <Grid item xs={3} sm={3}>
            <Typography value={"Limit %"} style={{ textAlign: 'center'  }} variant={"lable-01-xs"} />
            <InputFieldNDL
            id="title-perc"
            label={""}
            NoMinus
            value={percLimit}
            onChange={(e)=> {setpercLimit(e.target.value) ; limitPercRef.current.value = (e.target.value / 100 ) * limitRef.current.value}}
            helperText={warnError}
            error={warnError ? true : false}
           // alertrules={true}
            type={'number'} 
            />
        </Grid>
        <Grid item xs={3} sm={3}>
            <Typography value={"Value"} style={{ textAlign: 'center'  }} variant={"lable-01-xs"} />
            <InputFieldNDL
            id="title-Val"
            NoMinus
            label={""}
            inputRef={limitPercRef}
            defaultValue={0}
            disabled={true}
            />
        </Grid>

        <Grid item xs={3} sm={3}>
            <InputFieldNDL
            id="Critical"
            value={t("Critical")}
            label={""}
            disabled={true}
            />
        </Grid>
        <Grid item xs={3} sm={3}> 
            <InputFieldNDL
            id="title-above-cri"
            value={t("Above")}
            label={""}
            disabled={true}
            />
        </Grid>
        <Grid item xs={3} sm={3}> 
            <InputFieldNDL
            id="title-perc-cri"
            label={""}
            value={CripercLimit}
            helperText={cricError}
            error={cricError ? true : false} 
           // alertrules={true}
           NoMinus
            type={'number'}
            onChange={(e)=> {setCripercLimit(e.target.value) ; CrilimitPercRef.current.value = (e.target.value / 100 ) * limitRef.current.value}}
            />
        </Grid>
        <Grid item xs={3} sm={3}> 
            <InputFieldNDL
            id="title-Val-Cri"
            label={""}
            inputRef={CrilimitPercRef}
            disabled={true}
            defaultValue={0}
            NoMinus
            />
        </Grid>
         
         
        <Grid item xs={4} sm={4}> 
         <SwitchCustom
         noPadding
          switch={false}
          checked={CheckmeSMSWarning}
          onChange={(e) => handleCheckmeWarning(e, 1)}
          primaryLabel={t('SMS')}
          disabled={isAlerAccess ? false : true}

        />
          <SelectBox
            labelId="hierarchyView"
            id="hierarchy-condition"
            value={userIDWarnSMS}
            options={props.UserOption}
            placeholder={'Select User'}
            onChange={(e, r) => addUsers(e, r, "WarningSMS")}
            multiple={true}
            isMArray={true}
            selectAll={true}
            selectAllText={"Select All"}
            auto
            keyValue={"name"}
            keyId="id"
            disabled={CheckmeSMSWarning ? false : true}
          /></Grid>
        <Grid item xs={4} sm={4}> 
        <SwitchCustom
        noPadding
          switch={false}
          checked={CheckmeEmailWarning}
          onChange={(e) => handleCheckmeWarning(e, 2)}
          primaryLabel={t('Email')}
        />
          <SelectBox
            labelId="hierarchyView"
            id="hierarchy-condition"
            value={userIDWarnEmail}
            options={props.UserOption}
            placeholder={'Select User'}
            onChange={(e, r) => addUsers(e, r, "WarningEmail")}
            multiple={true}
            isMArray={true}
            selectAll={true}
            selectAllText={"Select All"}
            auto
            keyValue={"name"}
            keyId="id"
            disabled={CheckmeEmailWarning ? false : true}
          /></Grid>
        <Grid item xs={4} sm={4}> 
          <SelectBox
          label={"Communication Channel"}
          labelId="hierarchyView"
          id="hierarchy-condition"
          value={channelIDWarn}
          options={!ChannelListForLineLoading && !ChannelListForLineError && ChannelListForLineData && ChannelListForLineData.length > 0 ? ChannelListForLineData : []}
          placeholder={'Select Channel'}
          onChange={(e, r) => addChannel(e, r, "Warning")}
          multiple={true}
          isMArray={true}
          selectAll={true}
          selectAllText={"Select All"}
          auto
          keyValue={"name"}
          keyId="id"
        /></Grid> 
         
        {
          !isAlerAccess &&
          <Grid item xs={12} sm={12}>

            <div className="flex items-center gap-2 mt-4">
              <Information style={{ color: useThemes === "light" ? "#242424" : "#A6A6A6", marginLeft: "10px" }} />
              <Typography value={t("Please contact the support team to enable SMS services.")} color={'#DA1E28'} variant={'lable-01-s'} />
            </div>
          </Grid>
        }

      </Grid>
      <ModalNDL open={OpenDialog}>
        <ModalHeaderNDL>
          <div className="flex items-center justify-between">
            <Typography variant="heading-02-xs" value={t("Confirmation")} />
          </div>
        </ModalHeaderNDL>
        <ModalContentNDL>
          <div style={{ marginBottom: '10px' }}>
            <Typography
                variant="paragraph-xs"
              value={t(ActionMsg)}>
            </Typography>
          </div>
          <div style={{ float: 'right' }}>
            <Button type='secondary' style={{ marginRight: '8px' }} value={t('Cancel')} onClick={() => { cancelAction() }} />
            <Button type="primary"  value={t('Continue')} onClick={Submitaction} />
          </div>

        </ModalContentNDL>
      </ModalNDL>
    </div>
    </React.Fragment>

  )
})

export default ToolAlarm
