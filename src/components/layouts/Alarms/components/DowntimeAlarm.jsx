import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL';
import useGetTheme from 'TailwindTheme';
import { useTranslation } from 'react-i18next';
import { snackToggle, snackMessage, snackType, oeeAssets, selectedPlant, user } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import Button from 'components/Core/ButtonNDL';
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL'
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import InputFieldNDL from 'components/Core/InputFieldNDL';
import MaskedInput from 'components/Core/MaskedInput/MaskedInputNDL';
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
import useUsersListForLine from 'components/layouts/Settings/UserSetting/hooks/useUsersListForLine';
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

// NOSONAR
const DowntimeAlarm = forwardRef((props, ref) => {
  const useThemes = useGetTheme();
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant)

  const warningRef = useRef(null);
  const [warningval, setWarningVal] = useState()
  const criticalRef = useRef(null);
  const [cricValue, setCricValue] = useState()
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [alertid, setalertid] = useState('')
  const [oeeAssetsArray] = useRecoilState(oeeAssets);
  const [AssetOption, setAssetOption] = useState([])
  const [selectedOEEAsset, setSelectedOEEAsset] = useState('')
  const [OpenDialog, setOpenDialog] = useState(false);
  const [ActionType, setActionType] = useState('')

  const [CheckmeSMSWarning, setCheckmeSMSWarning] = useState(false);
  const [CheckmeSMSCritical, setCheckmeSMSCritical] = useState(false);
  const [CheckmeEmailWarning, setCheckmeEmailWarning] = useState(false);
  const [CheckmeEmailCritical, setCheckmeEmailCritical] = useState(false);
  const [UserOption, setUserOption] = useState([]);
  const [userIDWarnSMS, setUserIDWarnSMS] = useState([])
  const [userIDCriticalSMS, setUserIDCriticalSMS] = useState([])
  const [userIDWarnEmail, setUserIDWarnEmail] = useState([])
  const [userIDCriticalEmail, setUserIDCriticalEmail] = useState([])
  const [channelIDWarn, setChannelIDWarn] = useState([])
  const [channelIDCritical, setChannelIDCritical] = useState([])
  const [InstMetID, setInstMetID] = useState(0)
  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();
  const { CreateAlarmLoading, CreateAlarmData, CreateAlarmError, getCreateAlarm } = useCreateAlarm()
  const { UpdateAlarmLoading, UpdateAlarmData, UpdateAlarmError, getUpdateAlarm } = useUpdateAlarm()
  const { InstMetLoading, InstMetData, InstMetError, getInstMetForAsset } = useGetInstMetForAsset();
  const [currUser] = useRecoilState(user);
  const [isAlerAccess, setisAlerAccess] = useState(false)
  const { AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError, getAlarmSMSUser } = useGetAlarmSMSUser()

  useEffect(() => {
    getUsersListForLine(headPlant.id)
    getChannelListForLine(headPlant.id)
    getAlarmSMSUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  useImperativeHandle(ref, () => ({
    downtimeEdit: (value) => downtimeEdit(value)
  }))

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

  // console.log(oeeAssetsArray,"oeeAssetsArrayoeeAssetsArray")
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
    let astArry = []
    // eslint-disable-next-line array-callback-return
    oeeAssetsArray.map(val => {
      astArry.push({
        id: val.entity.id,
        name: val.entity.name,
      })
    })
    setAssetOption(astArry)


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oeeAssetsArray])



  useEffect(() => {
    if (!AlarmSMSUserLoading && AlarmSMSUserData && !AlarmSMSUserError) {
      let isHaveAccess = AlarmSMSUserData.filter(x => x.user_id === currUser.id && x.is_enable)
      console.log(AlarmSMSUserData, "AlarmSMSUserData", isHaveAccess, currUser.id)

      // setAlertUser(AlarmSMSUserData)
      if (isHaveAccess.length > 0) {
        setisAlerAccess(true)
      } else {
        setisAlerAccess(false)

      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError])



  const OnchangeOEEAsset = (event) => {
    let assetName = AssetOption.find(option => option.id === event.target.value)?.name
    let alertname = props.alertList.filter(x => x.name === assetName && x.entity_type === 'downtime')
    if (alertname.length > 0) {
      setOpenSnack(true);
      setSnackMessage(t('Alarm Name Already Exist'));
      setSnackType('warning');
      return false;
    }
    setSelectedOEEAsset(event.target.value)
    let inst = 0, met;
    if (props.entityData && props.entityData.length > 0) {
      props.entityData.forEach(entity => {
        if (entity.id === event.target.value && entity.prod_asset_oee_configs) {
          const configs = entity.prod_asset_oee_configs;
          if (Array.isArray(configs) && configs.length > 0) {
            const config = configs[0];
            if (config.is_status_signal_available === true) {
              inst = config.instrumentByMachineStatusSignalInstrument?.id;
              met = config.metricByMachineStatusSignal?.id;
            } else {
              inst = config.instrument?.id;
              met = config.metric?.id;
            }
            getInstMetForAsset(inst.toString(), met)
          }
        }
      });
    }


  } 
  const handleCheckmeWarning = (e, p) => {
    if (p === 1) {
      if (CheckmeSMSWarning && props.section !== 'downtime') {
        handleDialog("warnSMS")
      } else if (CheckmeSMSWarning) {
        setUserIDWarnSMS([])
      }
      setCheckmeSMSWarning(!CheckmeSMSWarning);
    } else {
      if (CheckmeEmailWarning && props.section !== 'downtime') {
        handleDialog("warnEmail")
      } else if (CheckmeEmailWarning) {
        setUserIDWarnEmail([])
      }
      setCheckmeEmailWarning(!CheckmeEmailWarning);
    }

  }

  const handleCheckmeCritical = (e, p) => {
    if (p === 1) {
      if (CheckmeSMSCritical && props.section !== 'downtime') {
        handleDialog("CricSMS")
      } else if (CheckmeSMSCritical) {
        setUserIDCriticalSMS([])
      }
      setCheckmeSMSCritical(!CheckmeSMSCritical);
    } else {
      if (CheckmeEmailCritical && props.section !== 'downtime') {
        handleDialog("CricEmail")
      } else if (CheckmeSMSCritical) {
        setUserIDCriticalEmail([])
      }
      setCheckmeEmailCritical(!CheckmeEmailCritical);
    }

  }

  function handleDialog(type) {
    setOpenDialog(true)
    setActionType(type)
  }

  function Submitaction() {
    if (ActionType === 'warnEmail') {
      setUserIDWarnEmail([])
    } else if (ActionType === 'warnSMS') {
      setUserIDWarnSMS([])
    } else if (ActionType === 'CricSMS') {
      setUserIDCriticalSMS([])
    } else if (ActionType === 'CricEmail') {
      setUserIDCriticalEmail([])
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

  const downtimeEdit = (value) => { 
    try {
      setalertid(value.id)
      setWarningVal(secondsToHHMMSS(value.warn_value))
      setCricValue(secondsToHHMMSS(value.critical_value))
      setInstMetID(value.insrument_metrics_id)
      if (value.name) {
        setSelectedOEEAsset(AssetOption.filter(f => f.name === value.name)[0].id)
      }
      const UserList = (type, val) => {
        return value.alert_users[0][type].filter(x => x[val]).map(c => {
          return UserOption.filter(f => f.id === c.user_id)[0]
        })
      }
      if (value.alert_users.length > 0) {
        let critUserID = UserList("critical", "email")
        if (critUserID.length > 0) {
          setCheckmeEmailCritical(true)
        } 
        setUserIDCriticalEmail(critUserID)
        let critSMSUserID = value.alert_users[0].critical.filter(x => x.sms).map(c => {
          return UserOption.filter(f => f.id === c.user_id)[0]
        })
        if (critSMSUserID.length > 0) {
          setCheckmeSMSCritical(true)
        }
        setUserIDCriticalSMS(critSMSUserID)
        let warSMSID = value.alert_users[0].warning.filter(x => x.sms).map(c => {
          return UserOption.filter(f => f.id === c.user_id)[0]
        })
        if (warSMSID.length > 0) {
          setCheckmeSMSWarning(true)
        }
        setUserIDWarnSMS(warSMSID)
        let warmailID = value.alert_users[0].warning.filter(x => x.email).map(c => {
          return UserOption.filter(f => f.id === c.user_id)[0]
        })
        if (warmailID.length > 0) {
          setCheckmeEmailWarning(true)
        }
        setUserIDWarnEmail(warmailID)

      }
      if (value.alert_multi_channels) {
        let critchanel = value.alert_multi_channels[0].critical.map(c => {
          return ChannelListForLineData.filter(f => f.id === c)[0]
        })
        setChannelIDCritical(critchanel.filter(x => x))
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

  function secondsToHHMMSS(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Add leading zeros if needed
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    return hours + ':' + minutes + ':' + seconds;
  }
// NOSONAR
  const saveAlarm = () => {

    if (!selectedOEEAsset) {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Asset'))
      return false;
    }
    let alertUser = []
    // Initialize arrays to store warning and critical alerts
    let warningAlerts = [];
    let criticalAlerts = []; 
    // Check conditions and push alerts into appropriate arrays
    if (CheckmeSMSWarning || CheckmeEmailWarning) {
      if ((userIDWarnSMS.length === 0) && CheckmeSMSWarning) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select warning SMS Users'))
        return false;
      }
      if ((userIDWarnEmail.length === 0) && CheckmeEmailWarning) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select warning E-mail Users'))
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
    if (CheckmeSMSCritical || CheckmeEmailCritical) {
      if ((userIDCriticalSMS.length === 0) && CheckmeSMSCritical) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select critical SMS Users'))
        return false;
      }
      if ((userIDCriticalEmail.length === 0) && CheckmeEmailCritical) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Users'))
        return false;
      }
      let cricsms = userIDCriticalSMS.map(s => {
        return {
          "user_id": s.id,
          "email": (userIDCriticalEmail.findIndex(o => o.id === s.id) >= 0) ? true : false,
          "sms": CheckmeSMSCritical
        }
      })
      let cricemail = userIDCriticalEmail.map(s => {
        return {
          "user_id": s.id,
          "email": CheckmeEmailCritical,
          "sms": (userIDCriticalSMS.findIndex(o => o.id === s.id) >= 0) ? true : false,
        }
      })
      criticalAlerts = [...cricsms, ...cricemail]
    }
    let uniquecric = criticalAlerts.filter((obj, index) => { // Filter Unique user
      return index === criticalAlerts.findIndex(o => obj.user_id === o.user_id);
    }); 
    // Create the final array of objects containing warning and critical alerts

    alertUser = [{
      "warning": uniquewarn,
      "critical": uniquecric
    }]

    let warningRefVal = warningRef.current.textMaskInputElement.state.previousConformedValue
    let timePartsWarn = warningRefVal.split(':');
    let hoursWarn = parseInt(timePartsWarn[0], 10);
    let minutesWarn = parseInt(timePartsWarn[1], 10);
    let secondsWarn = parseInt(timePartsWarn[2], 10);
    // console.log(hoursWarn,minutesWarn,secondsWarn,"warn")

    let totalSecondsWarn = ((hoursWarn ? hoursWarn : 0) * 3600) + ((minutesWarn ? minutesWarn : 0) * 60) + (secondsWarn ? secondsWarn : 0);


    let warnvalue = ''

    warnvalue = totalSecondsWarn
    // console.log(totalSecondsWarn,"totalSecondsWarntotalSecondsWarn",warnvalue)
    if (warnvalue < 60) {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter warning duration greater than 60 seconds'))
      return false;
    }
    let criticalRefVal = criticalRef.current.textMaskInputElement.state.previousConformedValue
    let timePartsCrit = criticalRefVal.split(':');
    let hoursCrit = parseInt(timePartsCrit[0], 10);
    let minutesCrit = parseInt(timePartsCrit[1], 10);
    let secondsCrit = parseInt(timePartsCrit[2], 10);
    // console.log(hoursCrit,minutesCrit,secondsCrit,"crit")

    let totalSecondsCrit = ((hoursCrit ? hoursCrit : 0) * 3600) + ((minutesCrit ? minutesCrit : 0) * 60) + (secondsCrit ? secondsCrit : 0);
    // console.log(totalSecondsCrit,"totalSecondsWCrittotalSecondCrit")

    let criticalvalue = ''
    criticalvalue = totalSecondsCrit
    if (criticalvalue < 61) {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter critical duration greater than 61 seconds'))
      return false;
    }
    if (criticalvalue <= warnvalue) {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Critical duration should be greater than warning duration'))
      return false;
    }
    // console.log(ChannelListForLineData,"ChannelListForLineDataChannelListForLineData")
    let warningChannel = [];
    let criticalChannel = [];

    if (channelIDWarn && channelIDWarn.length > 0) {
      channelIDWarn.forEach(channel => {
        if (channel.id) {
          warningChannel.push(channel.id.toString())
        }
      });
    }

    if (channelIDCritical && channelIDCritical.length > 0) {
      channelIDCritical.forEach(channel => {
        if (channel.id) {
          criticalChannel.push(channel.id.toString());
        }
      });
    }
    // return false
    let alertChannel = [{ "warning": warningChannel, "critical": criticalChannel }]

    if (props.section === 'downtime') {
      let data = {
        alert_channels: '{}',
        alert_multi_channels: alertChannel,
        alert_users: alertUser,
        entity_type: "downtime",
        insrument_metrics_id: InstMetID,
        time_slot_id: null,
        delivery: {},
        check_aggregate_window_function: "last",
        check_aggregate_window_time_range: '1m',
        check_time: '1m',
        check_time_offset: "0s",
        check_start_time: "-1h",
        line_id: props.headPlant.id,
        critical_type: "above",
        critical_value: criticalvalue.toString(),
        warn_type: "above",
        warn_value: warnvalue.toString(),
        critical_max_value: '',
        critical_min_value: '',
        warn_max_value: '',
        warn_min_value: '',
        name: AssetOption.find(option => option.id === selectedOEEAsset)?.name || "",
        status: "active",
        updated_by: props.currUser.id,
        created_by: props.currUser.id,
        message: '',
        viid: null
      };
      getCreateAlarm(data)
    } else {
      let data = {
        alert_id: alertid,
        alert_channels: '{}',
        alert_multi_channels: alertChannel,
        entity_type: "downtime",
        alert_users: alertUser,
        insrument_metrics_id: InstMetID,
        time_slot_id: null,
        delivery: {},
        check_aggregate_window_function: "last",
        check_aggregate_window_time_range: '1m',
        critical_type: 'above',
        critical_value: criticalvalue.toString(),
        warn_type: 'above',
        warn_value: warnvalue.toString(),
        critical_max_value: '',
        critical_min_value: '',
        warn_max_value: '',
        warn_min_value: '',
        name: AssetOption.find(option => option.id === selectedOEEAsset)?.name || "",
        updated_by: props.currUser.id,
        // created_by: props.currUser.id,
        message: '',
        viid: null

      };
      getUpdateAlarm(data)
    }
  }

  const addUsers = (e, r, val) => {
    // console.log(e,r,val,"e,r,val")
    if (val === 'WarningSMS') {
      setUserIDWarnSMS(e)
    }
    else if (val === 'WarningEmail') {
      setUserIDWarnEmail(e)
    }
    else if (val === 'CriticalSMS') {
      setUserIDCriticalSMS(e)
    }
    else if (val === 'CriticalEmail') {
      setUserIDCriticalEmail(e)
    }

  }
  const addChannel = (e, r, val) => {
    if (val === 'Warning') {
      setChannelIDWarn(e)
    }
    else if (val === 'Critical') {
      setChannelIDCritical(e)
    }

  }

  return (
    <React.Fragment>
<div  className="py-2 px-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark flex items-center justify-between h-[48px]" >
<Breadcrumbs breadcrump={props.listArr} onActive={props.handleActiveIndex} />

<div className='flex gap-2'>
  <Button type='secondary'  value={t('Cancel')} onClick={() => { props.changeSection('', 'Cancel') }} />

  {
    props.section === 'downtime' && (

      <Button type="primary"  value={CreateAlarmLoading ? "...Loading" : t('create')} onClick={saveAlarm} disabled={CreateAlarmLoading ? true : false} />
    )}
  {props.section !== 'downtime' && (

    <Button type="primary"  value={UpdateAlarmLoading ? "...Loading" : t('Update')} onClick={saveAlarm} disabled={UpdateAlarmLoading ? true : false} />
  )
  }
</div>
</div>
<HorizontalLine variant='divider1' />
    <div className="p-4">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
        </Grid>
        <Grid item xs={4} sm={4}>
          <SelectBox
            labelId="assetSelect-label"
            label="Select Asset"
            id="assetSelect"
            placeholder={t("Select Asset")}
            auto={false}
            multiple={false}
            options={AssetOption}
            isMArray={true}
            checkbox={false}
            value={selectedOEEAsset}
            onChange={OnchangeOEEAsset}
            keyValue="name"
            keyId="id"
            disabled={props.section === 'downtime' ? false : true}
          /></Grid>
        <Grid item xs={4} sm={4}></Grid>
        <Grid item xs={4} sm={4}></Grid>
        <Grid item xs={2} sm={2}>
           <InputFieldNDL
          id="title"
          value={t("Warning")}
          label={"Level"}
          placeholder={t("Enter Value")}
          disabled={true}
        /></Grid>
        <Grid item xs={2} sm={2}>
          <Typography value={"Duration"} style={{ marginBottom: "4px" }} variant={"lable-01-xs"} />
          <MaskedInput
            mask={[
              /[0-1]/,
              /\d/,
              ":",
              /[0-5]/,
              /\d/,
              ":",
              /[0-5]/,
              /\d/
            ]}
            //style={classes.maskedInput}
            ref={warningRef}
            value={warningval}
            defaultValue={warningval}
            onChange={(e) => setWarningVal(e.target.value)}
            placeholder='HH:MM:SS'
          />
        </Grid>
        <Grid item xs={2} sm={2}> 
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
            options={UserOption}
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
        <Grid item xs={2} sm={2}> <SwitchCustom
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
            options={UserOption}
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
       
     
        <Grid item xs={2} sm={2}>
          <InputFieldNDL
          id="title"
          value={t("Critical")}
          label={"Level"}
          placeholder={t("Enter Value")}
          disabled={true}
        /></Grid>
        <Grid item xs={2} sm={2}>
          <MaskedInput
          lable={'Duration'}
            mask={[
              /[0-1]/,
              /\d/,
              ":",
              /[0-5]/,
              /\d/,
              ":",
              /[0-5]/,
              /\d/
            ]}
            style={{height:"32px"}}
            ref={criticalRef}
            defaultValue={cricValue}
            value={cricValue}
            onChange={(e) => setCricValue(e.target.value)}
            placeholder={'HH:MM:SS'}
          /></Grid>
        <Grid item xs={2} sm={2}> <SwitchCustom
        noPadding
          switch={false}
          checked={CheckmeSMSCritical}
          onChange={(e) => handleCheckmeCritical(e, 1)}
          primaryLabel={t('SMS')}
          disabled={isAlerAccess ? false : true}
        />
          <SelectBox
            labelId="hierarchyView"
            id="hierarchy-condition"
            value={userIDCriticalSMS}
            options={UserOption}
            placeholder={'Select User'}
            onChange={(e, r) => addUsers(e, r, "CriticalSMS")}
            multiple={true}
            isMArray={true}
            selectAll={true}
            selectAllText={"Select All"}
            auto
            keyValue={"name"}
            keyId="id"
            disabled={CheckmeSMSCritical ? false : true}
          /></Grid>
        <Grid item xs={2} sm={2}> <SwitchCustom
        noPadding
          switch={false}
          checked={CheckmeEmailCritical}
          onChange={(e) => handleCheckmeCritical(e, 2)}
          primaryLabel={t('Email')}
        />
          <SelectBox
            labelId="hierarchyView"
            id="hierarchy-condition"
            value={userIDCriticalEmail}
            options={UserOption}
            placeholder={'Select User'}
            onChange={(e, r) => addUsers(e, r, "CriticalEmail")}
            multiple={true}
            isMArray={true}
            selectAll={true}
            selectAllText={"Select All"}
            auto
            keyValue={"name"}
            keyId="id"
            disabled={CheckmeEmailCritical ? false : true}
          /></Grid>
        <Grid item xs={4} sm={4}>
           <SelectBox
          labelId="hierarchyView"
          id="hierarchy-condition"
          label={"Communication Channel"}
          value={channelIDCritical}
          options={!ChannelListForLineLoading && !ChannelListForLineError && ChannelListForLineData && ChannelListForLineData.length > 0 ? ChannelListForLineData : []}
          placeholder={'Select Channel'}
          onChange={(e, r) => addChannel(e, r, "Critical")}
          multiple={true}
          isMArray={true}
          selectAll={true}
          selectAllText={"Select All"}
          auto
          keyValue={"name"}
          keyId="id"
        />
        </Grid>
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
            <Typography variant="heading-02-xs" value={t("Irreversible Action Confirmation")} />
          </div>
        </ModalHeaderNDL>
        <ModalContentNDL>
          <div style={{ marginBottom: '10px' }}>
            <Typography
              value={t("You are about to deselect the email associated with this limit and will no longer receive notifications related to this limit via email. This action confirms that you are aware of this, and it cannot be undone. Please review carefully before proceeding.")}>
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

export default DowntimeAlarm
