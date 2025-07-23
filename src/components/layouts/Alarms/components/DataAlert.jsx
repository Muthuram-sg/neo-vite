import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import Typography from "components/Core/Typography/TypographyNDL"
import { useTranslation } from 'react-i18next';
import { themeMode, snackToggle, snackMessage, snackType, customdates, TaskRange,user } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Grid from 'components/Core/GridNDL'
import Button from 'components/Core/ButtonNDL';
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import useGetAlertAggregate from "../hooks/useGetAlertAggregate";
import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import useGetChannelListForLine from "../hooks/useGetChannelListForLine";
import useGetInstrumentList from "components/layouts/Alarms/hooks/useGetInstrumentList";
import useGetInsrumentMetricsList from "components/layouts/Alarms/hooks/useGetInstrumentMetricsList";
import useProduct from "components/layouts/Settings/Production/Product/hooks/useProducts";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine";
import useCreateAlarm from "../hooks/useCreateAlarm";
import useUpdateAlarm from "../hooks/useUpdateAlarm";
import useVirtualInstrumentList from 'Hooks/useVirtualInstrument.jsx';
import useTheme from "TailwindTheme";
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL';
import DatePickerNDL from "components/Core/DatepickerNDL";
import useGetDataforAlerts from "../hooks/useGetDataforAlerts";
import moment from "moment";
import useGetAlarmSMSUser from "../hooks/useGetAlarmSMSUser";
import Information from 'assets/neo_icons/Menu/Information.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";


const DataAlert = forwardRef((props, ref) => {

  const useThemes = useTheme();

  const classes = {


    headerColor: useThemes.colorPalette.primary,


    headerDiv: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: "center"
    },

  }
  const { t } = useTranslation();
  const [curTheme] = useRecoilState(themeMode);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [CheckProduct, setCheckProduct] = useState(false);
  const [ProductID, setProductID] = useState('');
  const [warningCheck, setWarningCheck] = useState("");
  const [warningMin, setWarningMin] = useState('');
  const [warningMax, setWarningMax] = useState('');
  const [warningValue, setWarningValue] = useState('');
  const [criticalCheck, setCriticalCheck] = useState("");
  const [aggregation, setAggregation] = useState("");
  const [criticalMin, setCriticalMin] = useState('');
  const [criticalMax, setCriticalMax] = useState('');
  const [criticalValue, setCriticalValue] = useState('');
  const [aggregateFunc, setAggregateFunc] = useState([]);
  const [Consp, setConsp] = useState(false);
  const [durationType, setDurationType] = useState("");
  const [duration, setDuration] = useState("");
  const [LastCountValue, setLastCountValue] = useState('');
  const [CheckmeSMS, setCheckmeSMS] = useState(false);
  const [CheckmeWarnSMS, setCheckmeWarnSMS] = useState(false);
  const [CheckmeCriSMS, setCheckmeCriSMS] = useState(false);
  const [recurringAlert, setRecurringAlert] = useState(false);
  const [CheckmeEmail, setCheckmeEmail] = useState(false);
  const [CheckmeWarnEmail, setCheckmeWarnEmail] = useState(false);
  const [CheckmeCriEmail, setCheckmeCriEmail] = useState(false);
  const [UserFields, setUserFields] = useState([{ field: 1, user_id: "", user_name: "", alert_SMS: false, alert_email: false }]);
  const [WarnUserFields, setWarnUserFields] = useState([{ field: 1, user_id: "", user_name: "", alert_SMS: false, alert_email: false }]);
  const [CriUserFields, setCriUserFields] = useState([{ field: 1, user_id: "", user_name: "", alert_SMS: false, alert_email: false }]);
  const [UserOption, setUserOption] = useState([])
  const [channelFields, setChannelFields] = useState([{ field: 1, channel_id: "", channel_namess: "" }]);
  const [warnchannelFields, setWarnChannelFields] = useState([{ field: 1, channel_id: "", channel_namess: "" }]);
  const [crichannelFields, setCriChannelFields] = useState([{ field: 1, channel_id: "", channel_namess: "" }]);
  const [ChannelList, setChannelList] = useState([]);
  const [InstrumentList, setInstrumentList] = useState([]);
  const [instrument, setInstrument] = useState('');
  const [metricsListAL, setMetricsList] = useState([]);
  const [instrumentMetrics, setInstrumentMetrics] = useState('');
  const [productOption, setproductOption] = useState([])
  const [editAlertId, seteditAlarmid] = useState('');
  const [entityType, setentityType] = useState('instrument')
  const [virtualInstrument, setVirtualInstrument] = useState([])
  const [virtualInstrumentid, setVirtualInstrumentid] = useState('')
  const [ViInstrumentMetric, setViInstrumentMetric] = useState('')
  const [checkUpdateName, setcheckUpdateName] = useState('')
  const [checkUpdateProdId, setcheckUpdateProdId] = useState('')
  const [checkUpdateViid, setcheckUpdateViid] = useState('')
  const [checkUpdateInstrumentMetricID, setcheckUpdateInstrumentMetricID] = useState('')
  const alarmName = useRef()
  const alarmRemarks = useRef()
  const { AlertAggregateLoading, AlertAggregateData, AlertAggregateError, getAlertAggregate } = useGetAlertAggregate();
  const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();
  const { InstrumentListLoading, InstrumentListData, InstrumentListError, getInstrumentList } = useGetInstrumentList();
  const { InstrumentMetricsListLoading, InstrumentMetricsListData, InstrumentMetricsListError, getInsrumentMetricsList } = useGetInsrumentMetricsList();
  const { outGPLoading, outGPData, outGPError, getProduct } = useProduct();
  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const { CreateAlarmLoading, CreateAlarmData, CreateAlarmError, getCreateAlarm } = useCreateAlarm()
  const { UpdateAlarmLoading, UpdateAlarmData, UpdateAlarmError, getUpdateAlarm } = useUpdateAlarm()
  const { virtualInstrumentListLoading, virtualInstrumentListData, virtualInstrumentListError, virtualInstrumentList } = useVirtualInstrumentList();
  const [limitType, setLimitType] = useState([]);
  const [baselineLimitType, setBaseineLimitType] = useState([]);
  const [limitid, setLimitId] = useState(-1);
  const [baselinelimitid, setBaselineLimitId] = useState(-1);
  const [isshowbaslinelimit, setisshowbaslinelimit] = useState(false);
  const [isshowmaxalert, setisshowmaxalert] = useState(false);
  const [isshowdatacountinput, setisshowdatacountinput] = useState(false);
  const [isshowdatepicker, setisshowdatepicker] = useState(false);
  const [Customdatesval] = useRecoilState(customdates);
  const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.startDate);
  const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.endDate);
  const [isshowlimit, setisshowlimit] = useState(false);
  const [alertValue, setAlertValue] = useState('');
  const [rangeSelected, setRangeSelected] = useRecoilState(TaskRange);
  const [specificselect] = useState('');
  const datepickerRef = useRef();
  const [limitDisable, setLimitDisable] = useState(false);
  const [, setalertId] = useState('')
  const [selectedmetrictitle, setselectedmetrictitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [datacount, setdatacount] = useState(0)
  const [selectedwarnfreq,setselectedwarnfreq] = useState('1 hour');
  const [selectedcrifreq,setselectedCrifreq] = useState('1 hour');
  const [dataalertstrigger, triggerdataalertsfunction] = useState(false)
  const { DataforAlertsLoading, DataforAlertsData, DataforAlertsError, getDataforAlerts } = useGetDataforAlerts()
  let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
  let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
  let stdOffset = Math.min(janOffset, julOffset);
  let TZone = moment().utcOffset(stdOffset).format('Z')
  const [currUser] = useRecoilState(user);
  const [isAlerAccess,setisAlerAccess] = useState(false)
   const { AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError,getAlarmSMSUser} = useGetAlarmSMSUser()
    

  useEffect(() => {
    setRangeSelected(6)
    getAlarmSMSUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    let end = moment().format("YYYY-MM-DDTHH:mm:ss" + TZone);
    let start = moment().subtract(6, 'months').format("YYYY-MM-DDTHH:mm:ss" + TZone);

    if (dataalertstrigger) {
      setLoading(true)
      getDataforAlerts(props.headPlant.schema, instrument, selectedmetrictitle, start, end, Number(datacount), false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dataalertstrigger])

  useEffect(() => {
    if (InstrumentListData && metricsListAL) {
      const filteredData = InstrumentListData.filter(item => item.id === instrument);
      const filteredmetric = metricsListAL.filter(item => item.id === instrumentMetrics);

      if (filteredData.length > 0 && filteredmetric.length > 0) {
 
        const category = filteredData[0].category;
        const metricId = filteredmetric[0].metric.id;
        const metric_ids = [39, 106, 1178, 1179, 28, 42, 29, 40, 45, 1180, 43, 107, 109, 110, 41, 1181, 46, 108, 44, 1182, 17]
        if (category === 3 && metric_ids.includes(metricId)) {
          setisshowlimit(true);
          setLimitDisable(true)
        } else {
          setisshowlimit(false);
          setLimitDisable(false)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InstrumentListData, instrument, metricsListAL, instrumentMetrics]);

  useEffect(()=>{
    if (warnchannelFields.length === 0) {
      setWarnChannelFields([{ field: 1, channel_id: "", channel_namess: "" }]);
  } else  if (crichannelFields.length === 0) {
    setCriChannelFields([{ field: 1, channel_id: "", channel_namess: "" }]);
}
// eslint-disable-next-line react-hooks/exhaustive-deps
  },[warnchannelFields, crichannelFields])

  useEffect(()=>{
    if (WarnUserFields.length === 0) {
      setWarnUserFields([{ field: 1, user_id: "", user_name: "", alert_SMS: false, alert_email: false }]);
  } else  if (CriUserFields.length === 0) {
    setCriUserFields([{ field: 1, user_id: "", user_name: "", alert_SMS: false, alert_email: false }]);
}
  },[WarnUserFields, CriUserFields])

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

  const checkdatavalue = (event) => {
    setdatacount(event.target.value)

  }

  const setLimits = () =>{
    setCriticalValue(Number(Number(alertValue) + (0.5 * Number(alertValue))).toFixed(2))
    setWarningValue(Number(Number(alertValue) + (0.2 * Number(alertValue))).toFixed(2))
    setWarningCheck("above")
    setCriticalCheck("above")
  }
  const handleKeyDown = (event) => {
    if (event.code === 'Enter' || event.code === "NumpadEnter") {
       triggerdataalertsfunction(true)
    }
  }

 

  const handleKeyAlert = (event) => {
    if (event.code === 'Enter' || event.code === "NumpadEnter") {
      setLimits() 
    }
  }

  const checkalertvalue = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
       setWarningCheck("above")
       setCriticalCheck("above")
      setAlertValue(value);
    }
  };

  useEffect(() => {
    getUsersListForLine(props.headPlant.id)
    getAlertAggregate()
    getChannelListForLine(props.headPlant.id)
    getInstrumentList(props.headPlant.id)
    getProduct()
    virtualInstrumentList(props.headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.headPlant])
  useEffect(() => {
    if (!outGPLoading && outGPData && !outGPError) {

      setproductOption(outGPData)
    }
  }, [outGPLoading, outGPData, outGPError])

  useEffect(() => {
    let limittype = ["ISO Standards", "Baseline", "Alert Revision"];
    const options = limittype.map((iso, index) => ({
      id: index + 1,
      name: iso,
    }));
    setLimitType(options);
  }, []);

  
  const SetWarnFrequency = (e, type) => {
    setselectedwarnfreq(e.target.value);
};

const SetCriFrequency = (e, type) => {
  setselectedCrifreq(e.target.value);
};

  useEffect(() => {
    let baselineLimitType = ["F90", "Data Count", "Custom Range"];
    const options = baselineLimitType.map((iso, index) => ({
      id: index + 1,
      name: iso,
    }));
    setBaseineLimitType(options);
  }, []);

  const handleEntitychange = () => {
    setisshowlimit(false);
    setCriticalValue("")
    setWarningValue("")
    setWarningCheck("")
    setCriticalCheck("")
    setInstrument("")
    setInstrumentMetrics("")
    setisshowbaslinelimit(false)
    setisshowmaxalert(false)
    setisshowdatacountinput(false)
    setisshowdatepicker(false)
    setisshowlimit(false)
    }


  const handleInstrumentLimit = (e) => {
    setLimitId(e.target.value);
  }

  const handleInstrumentbaselineLimit = (e) => {
    setBaselineLimitId(e.target.value)
  }
  useImperativeHandle(ref, () => ({
    alertEdit: (value) => alertEdit(value)
  }))

  useEffect(() => {
    if (!AlertAggregateLoading && AlertAggregateData && !AlertAggregateError) {
      let AggregationList = []
      AggregationList = AlertAggregateData.map((x) => {
        return Object.assign(x, { "id": x.aggregate_function })
      })
      setAggregateFunc(AggregationList)

    }

  }, [AlertAggregateLoading, AlertAggregateData, AlertAggregateError])
  useEffect(() => {
    if (!InstrumentMetricsListLoading && InstrumentMetricsListData && !InstrumentMetricsListError) {

      let InstruMetricList = []
      InstruMetricList = InstrumentMetricsListData.map((x) => {
        return Object.assign(x, { "title": x.metric.title }, { "name": x.metric.name })
      })
      setMetricsList(InstruMetricList)
      if (entityType === "virtual_instrument") {
        let metricDetail = InstruMetricList.filter(x => x.name.toString().toLowerCase() === ViInstrumentMetric.toString().toLowerCase())

        if (metricDetail.length > 0) {
          setInstrumentMetrics(metricDetail[0].id)
        } else if (metricDetail.length === 0) {
          setOpenSnack(true);
          setSnackType('warning');
          setSnackMessage(t('Selected entity does not having Consumption Reading'))
          setInstrumentMetrics([])
        }

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
    if (!InstrumentListLoading && InstrumentListData && !InstrumentListError) {
      setInstrumentList(InstrumentListData)
    }
  }, [InstrumentListLoading, InstrumentListData, InstrumentListError])
  useEffect(() => {
    if (!virtualInstrumentListLoading && virtualInstrumentListData && !virtualInstrumentListError) {
      setVirtualInstrument(virtualInstrumentListData)
    }
  }, [virtualInstrumentListLoading, virtualInstrumentListData, virtualInstrumentListError])
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

  const frequencies = [
    { id: "1 hour", name: "1 hour" },
    { id: "2 hours", name: "2 hours" },
    { id: "5 hours", name: "5 hours" },
    { id: "10 hours", name: "10 hours" },
    { id: "24 hours", name: "24 hours" }
];

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
    if ((!UpdateAlarmLoading && UpdateAlarmData && !UpdateAlarmError)) {
      setSnackMessage(editAlertId ? t('Alarm Updated Successfully') : t('Alarm Created'));
      setOpenSnack(true); setSnackType('success');
      props.changeSection('', 'Cancel')
    }
    if ((UpdateAlarmLoading && !UpdateAlarmData && UpdateAlarmError)) {
      setSnackMessage(t("Alarm Creating has failed"));
      setOpenSnack(true); setSnackType('warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateAlarmData])


// NOSONAR
  const alertEdit = (value) => {
    try {
      seteditAlarmid(value.id)
      alarmName.current.value = value.name
      setcheckUpdateName(value.name)
      setentityType(value.entity_type)
      setInstrumentMetrics(value.insrument_metrics_id)
      setselectedmetrictitle(value.instruments_metric.metric.name)
      if (value.entity_type === "instrument") {
        setInstrument(value.instrument_id)
        if (value.instruments_metric) {
          getInsrumentMetricsList(value.instrument_id);
        }
        setcheckUpdateInstrumentMetricID(value.insrument_metrics_id)
      } else {
        if (value.viid) {
          setVirtualInstrumentid(value.viid)
          setcheckUpdateViid(value.viid)
          setConsp(true)
          const selectedData = virtualInstrument.find(item => item.id === value.viid);
          if (selectedData) {
            handleVirtualInstruments({ target: { value: value.viid } }, virtualInstrument);
          }
        }
      }
      setWarningCheck(value.warn_type)
      if (value.warn_value) {
        setWarningValue(value.warn_value)
      }
      setWarningMin(value.warn_min_value)
      setWarningMax(value.warn_max_value)
      setCriticalCheck(value.critical_type)
      if (value.critical_value) {
        setCriticalValue(value.critical_value)
      }
      setCriticalMin(value.critical_min_value)
      setCriticalMax(value.critical_max_value)
      setAggregation(value.check_aggregate_window_function)
      setDurationType(value.check_type)
      setDuration(value.check_aggregate_window_time_range)
      setLastCountValue(value.check_last_n)
      setalertId(value.id)
      if (value.is_prod_id_available) {
        setCheckProduct(value.is_prod_id_available)
        setProductID(value.alertByproduct.id)
        setcheckUpdateProdId(value.alertByproduct.id)
      }
      if (alarmRemarks) {
        alarmRemarks.current.value = value.message
      }
      //setLimits
      if(value.misc){
        setLimitId(value.misc.limitid)
        setBaselineLimitId(value.misc.baselinelimitid)
        setAlertValue(value.misc.maxalert)
        setdatacount(value.misc.datacount)
        setRangeSelected(17)
        setSelectedDateStart(value.misc.startdt  ?  new Date(value.misc.startdt) : null)
        setSelectedDateEnd(value.misc.enddt ? new Date(value.misc.enddt) : null)
      }
      if(value.recurring_alarm){
        setRecurringAlert(value.recurring_alarm)
        setselectedCrifreq(value.cri_frequency)
        setselectedwarnfreq(value.warn_frequency)
      }
      // setChannelFields(value.alert_channels)
      let newarr = [];
      let warnChannelFields = [];
      let criChannelFields = [];

      if (value.alert_channels) {
        
        if (value.alert_channels.length > 0) {
          value.alert_channels.forEach((val, i) => {
            if (i % 2 === 0) { 
              const evenVal = value.alert_channels[i + 1]; 
              
              const channelObj = {
                field: newarr.length + 1,
                channel_id: val
              };
              
              newarr.push(channelObj);
              
              if (evenVal === "warn") {
                warnChannelFields.push(channelObj);
              } else if (evenVal === "cri") {
                criChannelFields.push(channelObj);
              }
            }
          });
        } else {
          newarr.push({ field: 1, channel_id: "", channel_namess: "" });
        }
      }

      if (value.recurring_alarm) {
        setWarnChannelFields(warnChannelFields);
        setCriChannelFields(criChannelFields);
      } else {
        setChannelFields(newarr);
      }

      if (value.alert_users.length > 0) {
        // eslint-disable-next-line array-callback-return
        value.alert_users.map(val => {
          if (props.currUser.id === val.user_id) {

            setCheckmeEmail(val.email)
            setCheckmeSMS(val.sms)
            setCheckmeWarnEmail(val.emailwarn)
            setCheckmeWarnSMS(val.smswarn)
            setCheckmeCriEmail(val.emailcri)
            setCheckmeCriSMS(val.smscri)
          }
        })

        let others = value.alert_users ? value.alert_users.filter(x => x.user_id !== props.currUser.id) : []
        if (others && others.length > 0) {
          let userArr3 = []
          // eslint-disable-next-line array-callback-return
          others.map((val, i) => {

            let user = UserOption.filter(e => e.id === val.user_id)
            userArr3.push({
              field: i + 1,
              user_id: val.user_id,
              user_name: user.lebgth > 0 ? user[0].userByUserId.name : "",
              alert_SMS: val.sms,
              alert_email: val.email,
              source: val.source
            })


          })
          const filteredUserArr3 = userArr3
          .filter(user => user.user_id !== "")
          .reduce((acc, current) => {
            const exists = acc.find(item => item.user_id === current.user_id && item.source === current.source); 
            if (!exists) {
              acc.push(current); 
            }
            return acc;
          }, []);
        
          const warnUsers = filteredUserArr3.filter(user => user.source === 'warn');
          const criUsers = filteredUserArr3.filter(user => user.source === 'cri');
          
          if (value.recurring_alarm) {
            setWarnUserFields(warnUsers);  
            setCriUserFields(criUsers);   
          } else {
            setUserFields(filteredUserArr3);  
          }          

        }
      }

    }

    catch (err) {
      console.log('Error on alert form', err);
    }
  }

// NOSONAR
  const editAlertForm = () => {
console.log('hii')
    let alertUser = []
      alertUser.push({
        "user_id": props.currUser.id,
        "email": CheckmeEmail,
        "emailwarn": CheckmeWarnEmail,
        "emailcri": CheckmeCriEmail,
        "sms": CheckmeSMS,
        "smswarn": CheckmeWarnSMS,
        "smscri": CheckmeCriSMS
      })
   function combineUserFields(UserFields = [], WarnUserFields = [], CriUserFields = []) {
    const defaultFields = UserFields.map(item => ({ ...item, source: 'default' }));
    const warnFields = WarnUserFields.map(item => ({ ...item, source: 'warn' }));
    const criFields = CriUserFields.map(item => ({ ...item, source: 'cri' }));
    
    return [...defaultFields, ...warnFields, ...criFields];
  }
  
  const combinedUserFields = combineUserFields(UserFields, WarnUserFields, CriUserFields);
  
  processUserFields(combinedUserFields, alertUser);  
    if (alarmName.current.value === '') {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a alarm name'))
      return false;
    }
    else if (entityType === '') {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Entity Type'))
      return;
    } else if (entityType === 'virtual_instrument' && virtualInstrumentid === '') {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Virtual Instrument'))
      return;
      // eslint-disable-next-line eqeqeq
    } else if (entityType === "instrument" && (instrument === '' || instrument == 0)) {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select a instrument'));
      return;
      // eslint-disable-next-line eqeqeq
    } else if (entityType === "instrument" && (instrumentMetrics === '' || instrumentMetrics == 0)) {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select a instrument metrics'));
      return;
    } else if (aggregation === "") {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select aggregation'))
      return false;
    } else if (durationType === '') {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Duration Type'))
      return false;
    } else if (durationType === 'last_n_rows' && !LastCountValue) {

      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please Enter Last Count'))
      return false;

    } else if (durationType === 'time_interval' && duration === '') {

      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Duration'))
      return false;

    } else if (warningCheck === "") {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select warning check'))
      return false;
    } else if (criticalCheck === "") {
      setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select critical check'))
      return false;
    } else if (CheckProduct) {
      if (!ProductID) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Product'))
        return false;
      }
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
      if (warnvalue === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a warning value'))
        return false;
      }
    } else {
      if (warningCheck === 'inside_the_range' || warningCheck === 'outside_the_range') {
        if (warningMax === '' || warningMin === '') {

          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a minimum and maximum value'))
          return false;
        }
        if (warningMin >= warningMax) {
          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Warning minimum should be less than warning maximum'))
          return false;
        }
        warntype = criticalCheck
        warnmaxvalue = warningMax
        warnminvalue = warningMin
      }

    }
    if (criticalCheck === 'above' || criticalCheck === 'below') {
      criticaltype = criticalCheck
      criticalvalue = criticalValue
      if (criticalvalue === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a critical value'))
        return false;
      }
    } else {
      if (criticalCheck === 'inside_the_range' || criticalCheck === 'outside_the_range') {
        if (criticalMax === '' || criticalMin === '') {

          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a minimum and maximum value'))
          return false;
        }
        if (criticalMin >= criticalMax) {
          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Critical minimum should be less than critical maximum'))
          return false;
        }
        criticaltype = criticalCheck
        criticalmaxvalue = criticalMax
        criticalminvalue = criticalMin
      }

    }

    const combinedChannelFields = [
      ...(channelFields || []).map(item => ({ ...item, source: 'default' })), 
      ...(warnchannelFields || []).map(item => ({ ...item, source: 'warn' })), 
      ...(crichannelFields || []).map(item => ({ ...item, source: 'cri' }))
    ];
    
    const uniqueChannelFields = combinedChannelFields.reduce((acc, current) => {
      // Check if both channel_id and source match an existing entry
      const exists = acc.find(item => item.channel_id === current.channel_id && item.source === current.source);
      
      if (!exists) {
        acc.push(current);
      }
      
      return acc;
    }, []);
    
    processChannelFields(uniqueChannelFields, ChannelListForLineData, listChanel, channelsarr);     

    let data = {
      alert_id: editAlertId,
      entity_type: entityType,
      alert_channels: "{" + listChanel.toString() + "}",
      alert_multi_channels: [],
      alert_users: alertUser,
      delivery: channelsarr.length > 0 ? channelsarr[0] : {},
      check_aggregate_window_function: aggregation,
      check_aggregate_window_time_range: duration,
      insrument_metrics_id: instrumentMetrics ? Number(instrumentMetrics) : 0,
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
      check_last_n: LastCountValue ? Number(LastCountValue) : 0,
      check_type: durationType,
      message: alarmRemarks.current.value,
      is_prod_id_available: CheckProduct,
      product_id: ProductID ? ProductID : null,
      viid: (entityType === "virtual_instrument" && virtualInstrumentid) ? virtualInstrumentid : null,
      misc: {"limitid":limitid , "baselinelimitid" :baselinelimitid , "datacount" :datacount , "startdt":selectedDateStart , "enddt":selectedDateEnd , maxalert : alertValue},
      recurring_alarm: recurringAlert,
      warn_frequency: selectedwarnfreq,
      cri_frequency: selectedcrifreq
    };

    updateUniqueAlarm(alarmName.current.value, instrumentMetrics, data, ProductID ? ProductID : "", virtualInstrumentid)


  }

  const updateUniqueAlarm = (alarmname, Metricid, data, proID, viid) => {
    let name = []
    let virtualId = []
    let metID = []
    let prodcheck = []
    if (checkUpdateName !== alarmname) {
      name = props.alertList.filter(x => x.name === alarmname)
    } else if (checkUpdateViid !== viid) {
      virtualId = props.alertList.filter(x => x.viid === viid)
    } else if (checkUpdateProdId !== proID || checkUpdateInstrumentMetricID !== Metricid) {
      if (CheckProduct) {
        prodcheck = props.alertList.filter(x => (x.insrument_metrics_id === Metricid) && (x.product_id === proID) && (x.viid === null))
      } else {
        metID = props.alertList.filter(x => (x.insrument_metrics_id === Metricid) && (x.viid === null) && (x.alertType === "alert"))
      }

    }

    if (name.length > 0) {
      setOpenSnack(true)
      setSnackMessage(t('Alarm Name Already Exist'));
      setSnackType('warning');
      return false;
    }
    if (metID.length > 0) {
      setOpenSnack(true)
      setSnackMessage(t('Alarm Rule Parameter Already Exist'));
      setSnackType('warning');
      return false;
    }
    if (virtualId.length > 0) {
      setOpenSnack(true)
      setSnackMessage(t('Alarm Rule Entity is Already Exist'));
      setSnackType('warning');
      return false;
    }
    if (prodcheck.length > 0) {
      setOpenSnack(true)
      setSnackMessage(t('Alarm Rule Parameter and Product Already Exist'));
      setSnackType('warning');
      return false;
    }
    getUpdateAlarm(data)
  }

  const handleProduct = () => {
    setCheckProduct(!CheckProduct)
    if (CheckProduct) {
      setProductID('')
    }
  }

  const handleProductChange = (e) => {
    setProductID(e.target.value)
  }
  const checkOption = [
    { id: "above", value: t("Above") },
    { id: "below", value: t("Below") },
    { id: "inside_the_range", value: t("insideRange") },
    { id: "outside_the_range", value: t("outsideRange") },
  ]
  const criticalCheckOption = [
    { id: "above", value: t("Above") },
    { id: "below", value: t("Below") },
    { id: "inside_the_range", value: t("insideRange") },
    { id: "outside_the_range", value: t("outsideRange") },

  ]
  const durationTypeOption = [
    { id: "time_interval", value: t("timeInterval") },
    { id: "last_n_rows", value: t("lastCount") },

  ]
  const durationOption = [
    { id: "1m", value: "1 Minute" },
    { id: "15m", value: "15 Minutes" },
    { id: "30m", value: "30 Minutes" },
    { id: "1h", value: "1 hour" },
    { id: "3h", value: "3 hours" },
    { id: "6h", value: "6 hours" },
    { id: "24h", value: "24 hours" },
    { id: "shiftwise", value: "Shiftwise" },
    { id: "daywise", value: "Daywise" }

  ]



  const addUserValuesms = (e, field) => {
    
    let setelement = [...UserFields];

    let fieldIndex = setelement.findIndex(x => x.field === field);
    if(fieldIndex === -1) {
      fieldIndex = 0
    }
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['alert_SMS'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;
    setUserFields(setelement)

  }
  const addUserWarnValuesms = (e, field) => {

    let setelement = [...WarnUserFields];

    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['alert_SMS'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;
    setWarnUserFields(setelement)

  }
  const addUserCriValuesms = (e, field) => {

    let setelement = [...CriUserFields];

    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['alert_SMS'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;
    setCriUserFields(setelement)

  }
  const removeOtherUser = (val) => {
    let setelement = [...UserFields];
    let removed = setelement.filter(x => x.field !== val);
    setUserFields(removed);
  }
  const removeWarnOtherUser = (val) => {
    let setelement = [...WarnUserFields];
    let removed = setelement.filter(x => x.field !== val);
    setWarnUserFields(removed);
  }
  const removeCriOtherUser = (val) => {
    let setelement = [...CriUserFields];
    let removed = setelement.filter(x => x.field !== val);
    setCriUserFields(removed);
  }
  const addUsers = (e, data, field) => {
    let row = data.filter(x => x.id === e.target.value)[0]
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
      let fieldIndex = setelement.findIndex(x => x.field === field);
      if (fieldIndex === -1) {
        fieldIndex = setelement.length;
      }
    
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['user_id'] = row ? row.id : '';
      fieldObj['user_name'] = row ? row.userByUserId.name : '';
      fieldObj['alert_SMS'] = false;
      fieldObj['alert_email'] = false;
      fieldObj['field'] = field; 
    
      setelement[fieldIndex] = fieldObj;
    
      const filteredSetelement = setelement.filter(item => item.field !== null && item.field !== undefined);
    
      setUserFields(filteredSetelement);
    }    
  }
  const addWarnUsers = (e, data, field) => {
    let row = data.filter(x => x.id === e.target.value)[0]
    let setelement = [...WarnUserFields];
    let Exist = e ? setelement.filter(x => x.user_id === row.id) : []
    if (Exist.length > 0) {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['user_id'] = '';
      fieldObj['user_name'] = '';
      setelement[fieldIndex] = fieldObj;
      setWarnUserFields(setelement);

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
      setWarnUserFields(setelement);

    }
  }
  const addCriUsers = (e, data, field) => {
    let row = data.filter(x => x.id === e.target.value)[0]
    let setelement = [...CriUserFields];
    let Exist = e ? setelement.filter(x => x.user_id === row.id) : []
    if (Exist.length > 0) {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['user_id'] = '';
      fieldObj['user_name'] = '';
      setelement[fieldIndex] = fieldObj;
      setCriUserFields(setelement);

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
      setCriUserFields(setelement);

    }
  }
  const addOtherUser = (val) => {
    let setelement = [...UserFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield, user_id: '', user_name: '' });
    setUserFields(setelement);
  }
  const addWarnOtherUser = (val) => {
    let setelement = [...WarnUserFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield, user_id: '', user_name: '' });
    setWarnUserFields(setelement);
  }
  const addCriOtherUser = (val) => {
    let setelement = [...CriUserFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield, user_id: '', user_name: '' });
    setCriUserFields(setelement);
  }
  const addUserValueEmail = (e, field) => {
    let setelement = [...UserFields];
    let fieldIndex = setelement.findIndex(x => x.field === field);
    if(fieldIndex === -1) {
      fieldIndex = 0
    }
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['alert_email'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;


    setUserFields(setelement);
  }
  const addUserWarnValueEmail = (e, field) => {
    let setelement = [...WarnUserFields];
    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['alert_email'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;

    setWarnUserFields(setelement);
  }
  const addUserCriValueEmail = (e, field) => {
    let setelement = [...CriUserFields];
    const fieldIndex = setelement.findIndex(x => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj['alert_email'] = e.target.checked;
    setelement[fieldIndex] = fieldObj;


    setCriUserFields(setelement);
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
      setSnackMessage(t("Channel Already Selected"))
      setSnackType("warning")
      setOpenSnack(true)
    } else {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['channel_id'] = e.target.value ? e.target.value : '';
      fieldObj['channel_namess'] = e.target.value ? e.target.value : '';
      setelement[fieldIndex] = fieldObj;

      setChannelFields(setelement);

    }

  }
  const addWarnChannelName = (e, field) => {
    let setelement = [...warnchannelFields];
    let Exist = e ? setelement.filter(x => x.channel_id === e.target.value) : []

    if (Exist.length > 0) {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['channel_id'] = '';
      fieldObj['channel_namess'] = '';
      setelement[fieldIndex] = fieldObj;
      setWarnChannelFields(setelement);
      setSnackMessage(t("Channel Already Selected"))
      setSnackType("warning")
      setOpenSnack(true)
    } else {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['channel_id'] = e.target.value ? e.target.value : '';
      fieldObj['channel_namess'] = e.target.value ? e.target.value : '';
      setelement[fieldIndex] = fieldObj;
      setWarnChannelFields(setelement);

    }

  }
  const addCriChannelName = (e, field) => {
    let setelement = [...crichannelFields];
    let Exist = e ? setelement.filter(x => x.channel_id === e.target.value) : []

    if (Exist.length > 0) {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['channel_id'] = '';
      fieldObj['channel_namess'] = '';
      setelement[fieldIndex] = fieldObj;
      setCriChannelFields(setelement);
      setSnackMessage(t("Channel Already Selected"))
      setSnackType("warning")
      setOpenSnack(true)
    } else {
      const fieldIndex = setelement.findIndex(x => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj['channel_id'] = e.target.value ? e.target.value : '';
      fieldObj['channel_namess'] = e.target.value ? e.target.value : '';
      setelement[fieldIndex] = fieldObj;

      setCriChannelFields(setelement);

    }

  }
  const addChannel = (val) => {
    let setelement = [...channelFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield, channel_id: '', channel_namess: '' });
    setChannelFields(setelement);
  }
  const addWarnChannel = (val) => {
    let setelement = [...warnchannelFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield, channel_id: '', channel_namess: '' });
    setWarnChannelFields(setelement);
  }
  const addCriChannel = (val) => {
    let setelement = [...crichannelFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    setelement.push({ field: lastfield, channel_id: '', channel_namess: '' });
    setCriChannelFields(setelement);
  }
  const removeChannel = (val) => {
    let setelement = [...channelFields];
    let removed = setelement.filter(x => x.field !== val);

    setChannelFields(removed);
  }
  const removeWarnChannel = (val) => {
    let setelement = [...warnchannelFields];
    let removed = setelement.filter(x => x.field !== val);

    setWarnChannelFields(removed);
  }
  const removeCriChannel = (val) => {
    let setelement = [...crichannelFields];
    let removed = setelement.filter(x => x.field !== val);

    setCriChannelFields(removed);
  }

  const handleDuration = (e) => {
    if (e.target.value) {
      setDuration(e.target.value);
    }


  }
  const handleDurationType = (e) => {
    if (e.target.value) {
      setDurationType(e.target.value);
    }

  }


  const updateCheck = (e, field) => {
    if (field === 1) {
      setWarningCheck(e.target.value)
    }
    if (field === 2) {
      setCriticalCheck(e.target.value)
    }
  }
  const handleAggregation = (e) => {

    if (e) {
      setAggregation(e.target.value);
    }
  }


  const updateMinVal = (e, field) => {
    if (field === 1) {
      if (e.target.value) {
        setWarningMin(Number(e.target.value));
      } else {
        setWarningMin('');
      }
    } else if (field === 2) {
      if (e.target.value) {
        setCriticalMin(Number(e.target.value));
      } else {
        setCriticalMin('');
      }
    }
  }
  const updateMaxVal = (e, field) => {
    if (field === 1) {
      if (e.target.value) {
        setWarningMax(Number(e.target.value));
      } else {
        setWarningMax('');
      }
    } else if (field === 2) {

      if (e.target.value) {
        setCriticalMax(Number(e.target.value));
      } else {
        setCriticalMax('');
      }
    }
  }

  const updateValue = (e, field) => {
    if (field === 1) {
      setWarningValue(e.target.value);

    } else if (field === 2) {
      setCriticalValue(e.target.value);
    } else if (field === 3) {
      setLastCountValue(e.target.value);
    }
  }
  const handleCheckme = (e, f) => {
    if (f === 1) {
      setCheckmeSMS(!CheckmeSMS);
    } else {
      setCheckmeEmail(!CheckmeEmail);
    }

  }

  const handleWarnCheckme = (e, f) => {
    if (f === 1) {
      setCheckmeWarnSMS(!CheckmeWarnSMS);
    } else {
      setCheckmeWarnEmail(!CheckmeWarnEmail);
    }

  }

  const handleCriCheckme = (e, f) => {
    if (f === 1) {
      setCheckmeCriSMS(!CheckmeCriSMS);
    } else {
      setCheckmeCriEmail(!CheckmeCriEmail);
    }

  }

  const handleRecurring = (e, f) => {
    setRecurringAlert(!recurringAlert)
  }

  function reinitialize (){
    setisshowlimit(false);
    setLimitId(-1)
    setBaselineLimitId(-1)
    setisshowbaslinelimit(false)
    setisshowdatacountinput(false)
    setisshowdatepicker(false)
    setisshowmaxalert(false)
    setCriticalValue("")
    setWarningValue("")
    setWarningCheck("")
    setCriticalCheck("")
    setdatacount(0)
  }

  const handleInstruments = (e) => {
    if (e) {
      getInsrumentMetricsList(e.target.value);
      setInstrument(e.target.value);
      reinitialize()


    }
  }

  const handleVirtualInstruments = (e, data) => {
    if (e) {
      setVirtualInstrumentid(e.target.value)
    }
    // eslint-disable-next-line no-useless-escape
    if (data.length > 0) {
      let filteredData = data.filter(f => f.id === e.target.value)[0]
      // eslint-disable-next-line no-useless-escape
      let instruments = filteredData.formula.split(/([-+*\/()\n])/g)
      instruments = instruments.filter(word => word.trim().length > 0);
      let re = '-+*\\/()';
      instruments = instruments.filter(val => !re.includes(val));
      let metrics = instruments.filter(val => val.split('.')[1]).map((val) => val.split('.')[1].toString());
      instruments = instruments.map(val => val.split('.')[0]);


      if (metrics.length > 0 && metrics[0] === "kwh") {
        setConsp(true)
        setDurationType("time_interval")
        setAggregation("cons");
        getInsrumentMetricsList(instruments[0]);
        setViInstrumentMetric(metrics[0])


      } else {
        setConsp(false)
        setDurationType("")
        setAggregation("");
        setInstrumentMetrics('')
      }
    }


  }

  const handleMetrics = (e, data) => {

    if (e) {
      setInstrumentMetrics(e.target.value);
      setselectedmetrictitle(data.filter(f => f.id === e.target.value)[0].metric.name)
      reinitialize()
      if (data.filter(f => f.id === e.target.value)[0].name === "kwh") {
        setConsp(true)
        setDurationType("time_interval")
        setAggregation("cons");
      } else {
        setConsp(false)
        setDurationType("")
        setAggregation("");
      }

    }

  }

  function processUserFields(userFields, alertuser) {
    if (userFields.length > 0) {
      userFields.forEach(val => {
        if (val) { 
          alertuser.push({
            user_id: val.user_id,
            email: val.alert_email,
            sms: val.alert_SMS,
            source: val.source
          });
        }
      });
    }
  
    return alertuser;
  }
  
  function processChannelFields(channelfields, ChannellistforLineData, listChanel, channelsarr) {

    if (channelfields.length > 0) {
      channelfields.forEach(x => {
        if (x.channel_id !== "") {
          let chObj = {};
          const channelid = x.channel_id;

          ChannellistforLineData.forEach(val => {
            if (channelid === val.id) {
              listChanel.push(val.id, x.source);

              let channelname = '';
              let channelsValue = '';

              if (val.notificationChannelType.id === 'f85819bc-c2ca-45c8-a1a7-28320b7f44e6') {
                channelname = "sms";
              } else if (val.notificationChannelType.id === 'aee76d9f-843a-4041-badc-707d54ffcb3e') {
                channelname = "email";
              } else if (val.notificationChannelType.id === '013d0b10-b4f2-4ef1-8804-a2b756684ad2') {
                channelname = "teams";
              }

              channelsValue = val.parameter;

              if (chObj.hasOwnProperty(channelname)) {
                let arr = [...chObj[channelname]];
                arr.push(channelsValue);
                chObj[channelname] = arr;
              } else {
                let arr = [];
                arr.push(channelsValue);
                chObj[channelname] = arr;
              }
            }
          });

          channelsarr.push(chObj);
        }
      });
    }
    return channelsarr;
  }////

// NOSONAR
  const saveAlarm = () => {

    try {
      let alertUser = []
        
        alertUser.push({
          "user_id": props.currUser.id,
          "email": CheckmeEmail,
          "emailwarn": CheckmeWarnEmail,
          "emailcri": CheckmeCriEmail,
          "sms": CheckmeSMS,
          "smswarn": CheckmeWarnSMS,
          "smscri": CheckmeCriSMS
        })
// NOSONAR
      function combineUserFields(UserFields = [], WarnUserFields = [], CriUserFields = []) {
        const defaultFields = UserFields.map(item => ({ ...item, source: 'default' }));
        const warnFields = WarnUserFields.map(item => ({ ...item, source: 'warn' }));
        const criFields = CriUserFields.map(item => ({ ...item, source: 'cri' }));
        
        return [...defaultFields, ...warnFields, ...criFields];
      }
      
      const combinedUserFields = combineUserFields(UserFields, WarnUserFields, CriUserFields);
      
      processUserFields(combinedUserFields, alertUser);  

      if (alarmName.current.value === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a alarm name'))
        return false;
      } else if (entityType === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Entity Type'))
        return;
      } else if (entityType === 'virtual_instrument' && virtualInstrumentid === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Virtual Instrument'))
        return;
      }
      // eslint-disable-next-line eqeqeq
      else if (entityType === "instrument" && (instrument === '' || instrument == 0)) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select a instrument'));
        return;
        // eslint-disable-next-line eqeqeq
      } else if (entityType === "instrument" && (instrumentMetrics === '' || instrumentMetrics == 0)) {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select a instrument metrics'));
        return;
      } else if (durationType === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Duration Type'))
        return false;
      } else if (durationType === 'last_n_rows' && !LastCountValue) {

        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please Enter Last Count'))
        return false;

      }
      else if (aggregation === "") {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select aggregation'))
        return false;
      }
      else if (durationType === 'time_interval' && duration === '') {

        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Duration'))
        return false;

      } else if (warningCheck === '') {

        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select warning check'))
        return false;
      } else if (criticalCheck === '') {
        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select critical check'))
        return false;
      } else if (CheckProduct) {
        if (!ProductID) {
          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please select Product'))
          return false;
        }
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
        if (warnvalue === '') {
          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a warning value'))
          return false;
        }
      } else {
        if (warningCheck === 'inside_the_range' || warningCheck === 'outside_the_range') {
          if (warningMax === '' || warningMin === '') {

            setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a minimum and maximum value'))
            return false;
          }
          if (warningMin >= warningMax) {
            setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Warning minimum should be less than warning maximum'))
            return false;
          }
          warntype = criticalCheck
          warnmaxvalue = warningMax
          warnminvalue = warningMin
        }




      }
      if (criticalCheck === 'above' || criticalCheck === 'below') {
        criticaltype = criticalCheck
        criticalvalue = criticalValue
        if (criticalvalue === '') {
          setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a critical value'))
          return false;
        }
      } else {
        if (criticalCheck === 'inside_the_range' || criticalCheck === 'outside_the_range') {
          if (criticalMax === '' || criticalMin === '') {

            setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Please enter a minimum and maximum value'))
            return false;
          }
          if (criticalMin >= criticalMax) {
            setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Critical minimum should be less than critical maximum'))
            return false;
          }
          criticaltype = criticalCheck
          criticalmaxvalue = criticalMax
          criticalminvalue = criticalMin
        }
      }
    
      const combinedChannelFields = [
        ...(channelFields || []).map(item => ({ ...item, source: 'default' })), 
        ...(warnchannelFields || []).map(item => ({ ...item, source: 'warn' })), 
        ...(crichannelFields || []).map(item => ({ ...item, source: 'cri' }))
      ];
      
      const uniqueChannelFields = combinedChannelFields.reduce((acc, current) => {
        // Check if both channel_id and source match an existing entry
        const exists = acc.find(item => item.channel_id === current.channel_id && item.source === current.source);
        
        if (!exists) {
          acc.push(current);
        }
        
        return acc;
      }, []);
      
      processChannelFields(uniqueChannelFields, ChannelListForLineData, listChanel, channelsarr);      

      let data = {
        alert_channels: "{" + listChanel.toString() + "}",
        alert_multi_channels: [],
        alert_users: alertUser,
        entity_type: entityType,
        delivery: channelsarr.length > 0 ? channelsarr[0] : {},
        check_aggregate_window_function: aggregation,
        check_aggregate_window_time_range: duration,
        check_time: '1m',
        check_time_offset: "0s",
        check_start_time: "-1h",
        line_id: props.headPlant.id,
        insrument_metrics_id: instrumentMetrics ? Number(instrumentMetrics) : 0,
        critical_type: criticaltype,
        critical_value: criticalvalue,
        warn_type: warntype,
        warn_value: warnvalue,
        critical_max_value: criticalmaxvalue.toString(),
        critical_min_value: criticalminvalue.toString(),
        warn_max_value: warnmaxvalue.toString(),
        warn_min_value: warnminvalue.toString(),
        name: alarmName.current ? alarmName.current.value : '',
        status: "active",
        updated_by: props.currUser.id,
        created_by: props.currUser.id,
        check_last_n: LastCountValue ? Number(LastCountValue) : 0,
        check_type: durationType,
        message: alarmRemarks.current ? alarmRemarks.current.value : '',
        is_prod_id_available: CheckProduct,
        product_id: ProductID ? ProductID : null,
        viid: virtualInstrumentid ? virtualInstrumentid : null,
        misc: {"limitid":limitid , "baselinelimitid" :baselinelimitid , "datacount" :datacount , "startdt":selectedDateStart , "enddt":selectedDateEnd , maxalert : alertValue},
        recurring_alarm: recurringAlert,
        warn_frequency: selectedwarnfreq,
        cri_frequency: selectedcrifreq,
        // isinstrumentalert:true,
      };
      CheckUniqueAlarm(alarmName.current.value, instrumentMetrics, data, ProductID ? ProductID : 0, virtualInstrumentid, entityType)

    }
    catch (e) {
      console.log(e, "save alert ")
    }

  }
  function CheckUniqueAlarm(alarmname, Metricid, data, proID, viid, entityTypes) {
    let name = props.alertList.filter(x => x.name === alarmname)
    let virtualId = props.alertList.filter(x => (x.viid === viid) && (x.entity_type === entityTypes))

    let metID = []
    let prodcheck = []
    if (CheckProduct) {
      prodcheck = props.alertList.filter(x => (x.insrument_metrics_id === Metricid) && (x.product_id === proID) && (x.viid === null) && (x.entity_type === entityTypes))
    } else {
      metID = props.alertList.filter(x => (x.insrument_metrics_id === Metricid) && (x.viid === null) && (x.entity_type === entityTypes))
    }


    if (name.length > 0) {
      setOpenSnack(true);
      setSnackMessage(t('Alarm Name Already Exist'));
      setSnackType('warning');
      return false;
    }
    if (metID.length > 0) {
      setOpenSnack(true);
      setSnackMessage(t('Alarm Rule Parameter Already Exist'));
      setSnackType('warning');
      return false;
    }
    if (virtualId.length > 0) {
      setOpenSnack(true);
      setSnackMessage(t('Alarm Rule Entity  is Already Exist'));
      setSnackType('warning');
      return false;
    }
    if (prodcheck.length > 0) {
      setOpenSnack(true);
      setSnackMessage(t('Alarm Rule Parameter and Product Already Exist'));
      setSnackType('warning');
      return false;
    }
    getCreateAlarm(data);
  }


// NOSONAR
  useEffect(() => {
    let filteredInstru = InstrumentList.filter(i => i.id === instrument)
    
    if (limitid === 1) {
      setisshowbaslinelimit(false)
      setisshowmaxalert(false)

      if (filteredInstru.length > 0) {
        let criticalval, warningval
        criticalval = filteredInstru[0].instrumentClassByInstrumentClass && filteredInstru[0].instrumentClassByInstrumentClass.limits ?
          filteredInstru[0].instrumentClassByInstrumentClass.limits.critical : ''

        warningval = filteredInstru[0].instrumentClassByInstrumentClass && filteredInstru[0].instrumentClassByInstrumentClass.limits ?
          filteredInstru[0].instrumentClassByInstrumentClass.limits.warning : ''

        if(selectedmetrictitle.includes("env_acc")){
          criticalval = 4
          warningval = 2
        } else if (selectedmetrictitle.includes("acc_rms")){
          criticalval = 20
          warningval = 10
        } else if (selectedmetrictitle.includes("temp")){
          criticalval = 70
          warningval = 50
        }
        
        let criticalval_str = criticalval.toString();
        let warningval_str = warningval.toString();

        setCriticalValue(criticalval_str)
        setWarningValue(warningval_str)
        setWarningCheck("above")
        setCriticalCheck("above")
      }
    } else if (limitid === 2) {
      setisshowbaslinelimit(true)
      setisshowmaxalert(false)
      
   
     
      if (baselinelimitid === 2) {
        setisshowdatacountinput(true)
        setisshowdatepicker(false)
        setCriticalValue("")
        setWarningValue("")
        setWarningCheck("above")
        setCriticalCheck("above")
      } else if (baselinelimitid === 3) {
        setCriticalValue("")
        setWarningValue("")
        setWarningCheck("above")
        setCriticalCheck("above")
        setisshowdatacountinput(false)
        setisshowdatepicker(true)
        if (!isNaN(new Date(selectedDateStart).getTime()) && !isNaN(new Date(selectedDateEnd).getTime()) && selectedmetrictitle && instrument) {
          setLoading(true)
          getDataforAlerts(props.headPlant.schema, instrument, selectedmetrictitle, selectedDateStart, selectedDateEnd, null, null, null)
        }
      } else if (baselinelimitid === 1) {
        setCriticalValue("")
        setWarningValue("")
        setWarningCheck("above")
        setCriticalCheck("above")
        if (filteredInstru.length > 0) {
          let end = moment(filteredInstru[0].created_ts).add(90,'days').format("YYYY-MM-DDTHH:mm:ss" + TZone);
          let start = moment(filteredInstru[0].created_ts).format("YYYY-MM-DDTHH:mm:ss" + TZone);
          setLoading(true)
          getDataforAlerts(props.headPlant.schema, instrument, selectedmetrictitle, start, end, 1, true, null)
        }
        setisshowdatacountinput(false)
        setisshowdatepicker(false)
      }
    } else if (limitid === 3) {
     
      let end = moment().format("YYYY-MM-DDTHH:mm:ss" + TZone);
      let start = moment().subtract(24, "hours").format("YYYY-MM-DDTHH:mm:ss" + TZone);
      setLoading(true)
      setCriticalValue("")
      setWarningValue("")
      setWarningCheck("above")
      setCriticalCheck("above")
      setLoading(true)
      getDataforAlerts(props.headPlant.schema, instrument, selectedmetrictitle, start, end, null, null, true)
      setisshowbaslinelimit(false)
      setisshowmaxalert(true)
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStart, selectedDateEnd, selectedmetrictitle, limitid, baselinelimitid ])
// NOSONAR
  useEffect(() => {

    if (!DataforAlertsLoading && DataforAlertsData && !DataforAlertsError) {
      if (DataforAlertsData.length > 0) {
        if (limitid !== 3) {
          const datapoints = DataforAlertsData.filter(d => Number(d.value) >= 0.3).map(m => m.value)
          if(datapoints.length === 0){
            setOpenSnack(true);
            setSnackType('warning');
            setSnackMessage(t('No data available above 0.3'));
            setCriticalValue('0')
            setWarningValue('0')
          }
          const avg = (datapoints.reduce((a, b) => a + b, 0)) / (datapoints.length)
          if (avg) {
            setCriticalValue((avg + (0.5 * avg)).toFixed(2))
            setWarningValue((avg + (0.2 * avg)).toFixed(2))
          }         
        } else {
          let max = Math.max(...DataforAlertsData.map(o => Number(o.value)))
          const roundedMax = max.toFixed(3);
          setWarningCheck("above")
          setCriticalCheck("above")
          setAlertValue(roundedMax);
          setCriticalValue((max + (0.5 * max)).toFixed(2))
          setWarningValue((max + (0.2 * max)).toFixed(2))

        }
        setLoading(false)
        triggerdataalertsfunction(false)




      } else {
        if(limitid === 2 && baselinelimitid === 3){
          setOpenSnack(true)
          setSnackMessage("There is no data in the given range")
          setSnackType("warning")
        } else if(limitid === 2 && baselinelimitid === 1){
          setOpenSnack(true)
          setSnackMessage("Data is not available within an year of sensor installation")
          setSnackType("warning")
        } else if(limitid === 2 && baselinelimitid === 2){
          setOpenSnack(true)
          setSnackMessage("Data is not available")
          setSnackType("warning")
        } else if(limitid === 3){
          setOpenSnack(true)
          setSnackMessage("No alerts are recorded in the past 24 hours")
          setSnackType("warning")
        }
        setLoading(false)
        triggerdataalertsfunction(false)
        setCriticalValue('')
        setWarningValue('')
      }
      
    } 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataforAlertsLoading, DataforAlertsData, DataforAlertsError])

  return (
    <React.Fragment>
       <div className="h-[48px] px-4 py-2" style={classes.headerDiv}>
              {
                props.section === 'alert' ? (
                  <Typography value={t('newAlarm')} variant={"heading-02-base"}  />

                ) : (
                  <Typography value={t("UpdateAlarm")} variant={"heading-02-base"}  />
                )
              }
              <div style={{ display: 'flex' }}>

                <Button type='secondary' style={{ marginRight: 10, }} value={t('Cancel')} onClick={() => { props.changeSection('', 'Cancel') }} />
                {
                  props.section === 'alert' && (

                    <Button type="primary" value={CreateAlarmLoading ? ("...Loading") : t('create')} onClick={saveAlarm} disabled={CreateAlarmLoading ? true : false} />
                  )}
                {
                  props.section !== 'alert' && (

                    <Button type="primary" onClick={editAlertForm} value={UpdateAlarmLoading ? ("...Loading") : t('Update')} disabled={UpdateAlarmLoading ? true : false} />
                  )
                }
              </div>
            </div>
      
      <HorizontalLine variant='divider1' />
      <div className="p-4" >
        <Grid container spacing={3} >
          <Grid item xs={12} sm={12}>
          
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputFieldNDL
              id="title"
              label={t("alarmName")}
              inputRef={alarmName}
              placeholder={t("typeTitle")}

            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <div className="flex items-center gap-4">
              <RadioNDL
                labelText={t('Instrument')}
                id="instrument"
                checked={entityType === "instrument"}
                onChange={() =>{ setentityType("instrument"); handleEntitychange()}}
              />
              <RadioNDL
                labelText={t('Virtual Instrument')}
                id="virtual_instrument"
                checked={entityType === "virtual_instrument"}
                onChange={() => {setentityType("virtual_instrument"); handleEntitychange() }}
              />
            </div>
          </Grid>
          <Grid item xs={4} sm={4}>
            {
              entityType === "instrument" ?
                <SelectBox
                  labelId=""
                  id="combo-box-demo"
                  auto={true}
                  label={t('Instruments')}
                  options={InstrumentList}
                  keyValue="name"
                  keyId="id"
                  value={instrument}
                  isMArray={true}
                  onChange={(e) => handleInstruments(e)}
                  disabled={loading}
                />
                :
                <SelectBox
                  labelId=""
                  id="combo-box-demo"
                  auto={true}
                  label={t('Entity')}
                  options={virtualInstrument}
                  keyValue="name"
                  keyId="id"
                  value={virtualInstrumentid}
                  isMArray={true}
                  onChange={(e, data) => handleVirtualInstruments(e, data)}
                  disabled={loading}

                />
            }

          </Grid>

          <Grid item xs={4} sm={4}>
            <SelectBox
              labelId=""
              id="combo-box-demo"
              auto={true}
              label={t('Metric')}
              options={metricsListAL}
              keyValue="title"
              keyId="id"
              value={instrumentMetrics}
              isMArray={true}
              onChange={(e, option) => handleMetrics(e, option)}
              disabled={entityType !== "instrument" || loading ? true : false}
            />

            {/* <span style={{ color: '#FF0D00' }}>{(updateData ? (updateData.InstrumentMetrics != instrumentMetrics && t("Note: Your Alarm history will be deleted")) : "")}</span> */}


          </Grid>
          <Grid item xs={4} sm={4} style={{ display: 'flex', alignItems: 'initial', justifyContent: "initial" }}>
            <CustomSwitch
              id={'Product'}
              MainDivStyle={{ position: "absolute" }}
              switch={false}
              checked={CheckProduct}
              onChange={handleProduct}
              primaryLabel={t("Products")}
            />
            {CheckProduct &&
              <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: "flex-start", paddingTop: "24px" }}>
                <SelectBox
                  labelId="entity-type-label"
                  label=""
                  id="select-entity-Product"
                  auto={false}
                  multiple={false}
                  options={productOption}
                  isMArray={true}
                  checkbox={false}
                  value={ProductID}
                  onChange={handleProductChange}
                  keyValue="name"
                  keyId="id"
                  placeholder={"Select a Product"}
                />
              </div>}
          </Grid>
          {isshowlimit && (
            <Grid item xs={4} sm={4}>
              <SelectBox
                labelId=""
                id="combo-box-demo"
                auto={true}
                label={t('Limit Type')}
                options={limitType}
                keyValue="name"
                keyId="id"
                value={limitid}
                isMArray={true}
                onChange={(e) => handleInstrumentLimit(e)}
                disabled={loading}
              />
            </Grid>
          )}

          {isshowbaslinelimit && isshowlimit && (
            <Grid item xs={4} sm={4}>
              <div style={{ marginBottom: 10 }}>
                <SelectBox
                  labelId=""
                  id="combo-box-demo"
                  auto={true}
                  label={t('Baseline Limit')}
                  options={baselineLimitType}
                  keyValue="name"
                  keyId="id"
                  value={baselinelimitid}
                  isMArray={true}
                  onChange={(e) => handleInstrumentbaselineLimit(e)}
                  disabled={loading}
                />
              </div>
            </Grid>
          )}
          {isshowdatacountinput && isshowbaslinelimit && isshowlimit ? (
            <InputFieldNDL
              id="data count"
              label={t('Data Count')}
              onChange={checkdatavalue}
              type="number"
              NoMinus
              required={true}
              value={datacount}
              placeholder={t('Data Count')}
              handleKeyDown={handleKeyDown}
              // onBlur={handleOnBlur}
              disabled={loading}
            />
          ) : null}
          {isshowdatepicker && isshowbaslinelimit && isshowlimit ? (
            <Grid item xs={4} sm={4} className="flex items-center justify-center" >
              <label class="w-full py-1.5 ml-2  font-geist-sans text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                Custom Range</label>
              <DatePickerNDL
                id="custom-range-dashboard"
                ref={datepickerRef}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setSelectedDateStart(start);
                  setSelectedDateEnd(end);
                }}
                startDate={selectedDateStart}
                endDate={selectedDateEnd}
                disabled={true}
                dateFormat="dd/MM/yyyy HH:mm:ss"
                selectsRange={true}
                timeFormat="HH:mm:ss"
                customRange={true}
                defaultDate={rangeSelected}
                Dropdowndefine={specificselect}
              />
            </Grid>
          ) : null}
          {isshowmaxalert && (
            <InputFieldNDL
              id="alert value"
              label={t('Maximum Alert Value')}
              onChange={checkalertvalue}
              required={true}
              value={alertValue}
              placeholder={loading ? 'Loading...' : t('Maximum Alert Value')}
              onKeyDown={handleKeyAlert}
              disabled={loading}
            />
          )}
        </Grid>

        <div className="flex justify-around mt-4 mb-0.5" >
          <TypographyNDL value='Level' variant='label-02-s' />
          <TypographyNDL value='Check' variant='label-02-s' />
          <TypographyNDL value='Value' variant='label-02-s' />
         </div>

        <Grid container spacing={3} >
          <Grid item xs={4} sm={4}>
            <InputFieldNDL
              id="title"
              value={t("Warning")}
              placeholder={t("Enter Value")}
              disabled={true}
              NoMinus
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <SelectBox
              labelId="hierarchyView"
              id="hierarchy-warning"
              auto={false}
              multiple={false}
              options={checkOption}
              isMArray={true}
              checkbox={false}
              value={warningCheck}
              onChange={(e) => updateCheck(e, 1)}
              keyValue="value"
              keyId="id"
              placeholder={t("selectCheck")}
              disabled={limitDisable}

            />
          </Grid>
          <Grid item xs={4} sm={4}>
            {
              (warningCheck === 'inside_the_range' || warningCheck === 'outside_the_range') ? (
                <div style={{ display: 'inline-flex' }}>
                  <div>
                    <InputFieldNDL
                      style={{ width: '98%' }}
                      id="title"
                      type="number"
                      NoMinus
                    //  alertrules={true}
                      value={warningMin}
                      placeholder={t("Enter Value")}
                      // label={t('Minimum')}
                      onChange={(e) => updateMinVal(e, 1)}
                    

                    />

                  </div>
                  <div>

                    <InputFieldNDL
                      id="title"
                      type="number"
                      NoMinus
                     // alertrules={true}
                      value={warningMax}
                      placeholder={t("Enter Value")}
                      onChange={(e) => updateMaxVal(e, 1)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <InputFieldNDL
                    id="title"
                    type={loading ? "text" : "number"}
                    value={loading ? '' :warningValue}
                    placeholder={loading ? "Loading..." : t("Enter Value")}
                    onChange={(e) => updateValue(e, 1)}
                    NoMinus
                   // alertrules={true}
                    disabled={limitDisable}
                  />

                </>
              )
            }
          </Grid>
        </Grid>
        <div className="mb-4" />

        <Grid container spacing={3} >
          <Grid item xs={4} sm={4}>
            <InputFieldNDL
              id="title"
              value={t('Critical')}
              placeholder={t("Enter Value")}
              NoMinus
              disabled={true}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <SelectBox
              labelId="hierarchyView"
              id="hierarchy-critical"
              auto={false}
              multiple={false}
              value={criticalCheck}
              options={criticalCheckOption}
              isMArray={true}
              checkbox={false}
              onChange={(e) => updateCheck(e, 2)}
              placeholder={t("selectCheck")}
              keyValue="value"
              keyId="id"
              disabled={limitDisable}
            />

          </Grid>
          <Grid item xs={4} sm={4}>
            {
              (criticalCheck === 'inside_the_range' || criticalCheck === 'outside_the_range') ? (
                <div style={{ display: 'inline-flex' }}>
                  <div>
                    <InputFieldNDL
                      style={{ width: '98%' }}
                      id="title"
                      type="number"
                      NoMinus
                     // alertrules={true}
                      value={criticalMin}
                      placeholder={t("Enter Value")}
                      onChange={(e) => updateMinVal(e, 2)}
                    
                    />
                  </div>
                  <div>
                    <InputFieldNDL
                      id="title"
                      type="number"
                     // alertrules={true}
                     NoMinus
                      value={criticalMax}
                      placeholder={t("Enter Value")}
                      onChange={(e) => updateMaxVal(e, 2)}

                    />

                  </div>
                </div>
              ) : (
                <>

                  <InputFieldNDL
                    id="title"
                    type={loading ? "text" : "number"}
                    // label={t('Value')}
                    placeholder={loading ? "Loading..." : t("Enter Value")}
                    NoMinus
                   // alertrules={true}
                    value={loading ? '' : criticalValue}
                    onChange={(e) => updateValue(e, 2)}
                    disabled={limitDisable}
                  />

                </>
              )
            }
          </Grid>
        </Grid>
        <div className="mb-4" />
        <Grid container spacing={3} >

          <Grid item xs={4} sm={4}>

            <SelectBox
              labelId="hierarchyView"
              id="hierarchy"
              value={aggregation}
              label={t('Aggregation')}
              auto={false}
              multiple={false}
              isMArray={true}
              checkbox={false}
              options={aggregateFunc}
              onChange={(e) => handleAggregation(e)}
              disabled={Consp ? true : false}
              keyValue="aggregate_function"
              keyId="id"
            />


          </Grid>


          <Grid item xs={4} sm={4}>
            <SelectBox
              labelId="durationType"
              id="duration-Type"
              auto={false}
              multiple={false}
              label={t('Duration Type')}
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
                auto={false}
                multiple={false}
                label={t('Duration')}
                value={duration}
                options={durationOption}
                isMArray={true}
                checkbox={false}
                onChange={handleDuration}
                keyValue="value"
                keyId="id"
              />
              :
              <InputFieldNDL
                id="title"
                type="number"
              //  alertrules={true}
              NoMinus
                label={t('Last Count')}
                placeholder={t("Enter Value")}
                value={LastCountValue}
                onChange={(e) => updateValue(e, 3)}
              />
            }
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputFieldNDL
              id="remarks"
              label={t("remarks")}
              inputRef={alarmRemarks}
              placeholder={t("typeRemarks")}
            />
            <div className="pt-5 pb-5">
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'Recurent'}
                  switch={false}
                  checked={recurringAlert}
                  onChange={(e) => handleRecurring(e)}
                  primaryLabel={'Recurrent Alarm Check'}
                />
              <Typography variant="sm-helper-text-01" color={"secondary"} value={'Enabling this will check the repetition of alarm levels at a specified frequency'} />
              </Grid>
              </div>
          </Grid>
          {recurringAlert === false ?
          <React.Fragment>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={3} style={{ width: '100%' }}>
              <Grid item xs={3} sm={3}>
                <Typography variant="paragraph-xs" value={t('Alertme')} />

              </Grid>
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'CheckmeSMS'}
                  switch={false}
                  checked={CheckmeSMS}
                  onChange={(e) => handleCheckme(e, 1)}
                  primaryLabel={t('SMS')}
                  disabled={isAlerAccess ? false : true}
                />
              
              </Grid>
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'CheckmeEmail'}
                  switch={false}
                  checked={CheckmeEmail}
                  onChange={(e) => handleCheckme(e, 2)}
                  primaryLabel={t('Email')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography variant="paragraph-xs" value={t('AlertOtherUsers')} />

          </Grid>
          <Grid item xs={12} sm={12}>

          {
          (UserFields.length > 0 ? UserFields : [{ field: 0, user_id: "", alert_SMS: false, alert_email: false }]).map((val, i) => {
            let buttonComponent;

            if (UserFields.length - 1 === i || UserFields.length === 0) {
              buttonComponent = (
                <Button 
                  type="ghost" 
                  id={`add-icon-${i}`} 
                  icon={AddLight} 
                  stroke={useThemes.colorPalette.primary} 
                  onClick={() => {
                    addOtherUser(val.field ?? 0); 
                    document.activeElement?.blur();
                  }} 
                />
              );
            } else if (UserFields.length !== 1) {
              buttonComponent = (
                <Button 
                  type="ghost" 
                  danger 
                  id={`delete-icon-${i}`} 
                  icon={Delete} 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    removeOtherUser(val.field);
                  }} 
                />
              );  
            }

            const fieldId = val.field ?? 0;

            return (
              <Grid key={i + 1} container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={3} sm={3}>
                  <SelectBox
                    labelId=""
                    id={"drop-user" + fieldId}
                    options={UserOption.filter(x => x.userByUserId.id !== props.currUser.id)}
                    auto={true}
                    multiple={false}
                    isMArray={true}
                    checkbox={false}
                    keyValue="value"
                    keyId="id"
                    dynamic={UserFields}
                    placeholder={t("SelectaUser")}
                    value={val.user_id || ""}
                    onChange={(e, r) => addUsers(e, r, fieldId)}
                  />
                </Grid>

                <Grid item xs={3} sm={3}>
                  <CustomSwitch
                    id={'chk_sms_' + fieldId}
                    switch={false}
                    checked={val.alert_SMS || false}
                    onChange={(e) => addUserValuesms(e, fieldId)}
                    primaryLabel={t('SMS')}
                    disabled={!isAlerAccess}
                  />
                </Grid>

                <Grid item xs={3} sm={3}>
                  <CustomSwitch
                    id={'chk_email_' + fieldId}
                    switch={false}
                    checked={val.alert_email || false}
                    onChange={(e) => addUserValueEmail(e, fieldId)}
                    primaryLabel={t('Email')}
                  />
                </Grid>

                <Grid item xs={3} sm={3} style={{ marginTop: "12px" }}>
                  {buttonComponent}
                </Grid>
              </Grid>
            );
          })
        }


          </Grid>
          {
            !isAlerAccess && 
          <Grid item xs={12} sm={12}>

             <div className="flex items-center gap-2">
           <Information style={{ color: curTheme === "light" ? "#242424" : "#A6A6A6", marginLeft: "10px" }} />
            <TypographyNDL value={t ("Please contact the support team to enable SMS services.")} color={'#DA1E28'} variant={'lable-01-s'} />
          </div>
          </Grid>
          }
          <Grid item xs={3} sm={3}>
            <Typography variant="paragraph-xs" value={t('CommunicationChannel')} />

          </Grid>
          <Grid item xs={12} sm={12}>
            {
              channelFields.map((val, i) => {
                let buttonComponent1;

                if (channelFields.length - 1 === i) {
                  buttonComponent1 = (
                    <Button 
                      type="ghost" 
                      icon={AddLight} 
                      id={`add-icon-${i}`} // Add unique ID for Add button
                      stroke={useThemes.colorPalette.primary} 
                      onClick={() => {
                        addChannel();
                        document.activeElement?.blur(); // Unfocus the delete icon if it's active
                      }} 
                    />
                  );
                } else if (channelFields.length !== 1) {
                  buttonComponent1 = (
                    <Button 
                      type="ghost" 
                      danger 
                      id={`delete-icon-${i}`} // Add unique ID for Delete button
                      icon={Delete} 
                      stroke={useThemes.colorPalette.genericRed} 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        removeChannel(val.field);
                      }} 
                    />
                  );
                } else {
                  buttonComponent1 = (
                    <Button 
                      type="ghost" 
                      id={`delete-icon-${i}`} // Add unique ID for Delete button
                      icon={Delete} 
                      stroke={useThemes.colorPalette.genericRed} 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        removeChannel(val.field);
                      }} 
                    />
                  );
                }
                
                return <div key={i+1} style={{ marginBottom: "15px" }}>
                  <Grid container spacing={3} style={{ width: '100%' }}>
                    <Grid item xs={4} sm={4}>

                      <SelectBox
                        labelId="hierarchyView"
                        id={"hierarchy-channel" + val.field}
                        auto={false}
                        multiple={false}
                        isMArray={true}
                        checkbox={false}
                        options={ChannelList}
                        keyValue="name"
                        keyId="id"
                        dynamic={channelFields}
                        placeholder={t('SelectChannel')}
                        value={val.channel_id ? val.channel_id : ""}
                        onChange={(e) => addChannelName(e, val.field)}

                      />


                    </Grid>
                    <Grid item xs={2} sm={2} >
                      {buttonComponent1}
                    </Grid>
                  </Grid>
                </div>
              })
            }
          </Grid>
          </React.Fragment> : 
            <React.Fragment>
            <Grid item xs={12} sm={12}>
            <Grid container spacing={4} style={{ width: '100%' }}>
              <Grid item xs={6} sm={6}>
                <div className="pb-5" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <Typography variant="sm-heading-02" value={"Level"}></Typography>
                    <InputFieldNDL
                      id="title"
                      value={'Warning'}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Typography variant="sm-heading-02" value={"Frequency"}></Typography>
                    <SelectBox
                    noSorting
                      labelId="freq"
                      id="select-freq"
                      value={selectedwarnfreq}
                      options={frequencies}
                      placeholder={'Select Frequency'}
                      onChange={(e) => SetWarnFrequency(e)}
                      multiple={false}
                      isMArray={true}
                      keyValue={"name"}
                      keyId="id"
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ width: '100%' }}>
              <Grid item xs={3} sm={3}>
                <Typography variant="paragraph-xs" value={t('Alertme')} />

              </Grid>
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'CheckmeSMS'}
                  switch={false}
                  checked={CheckmeWarnSMS}
                  onChange={(e) => handleWarnCheckme(e, 1)}
                  primaryLabel={t('SMS')}
                  disabled={isAlerAccess ? false : true}
                />
              
              </Grid>
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'CheckmeEmail'}
                  switch={false}
                  checked={CheckmeWarnEmail}
                  onChange={(e) => handleWarnCheckme(e, 2)}
                  primaryLabel={t('Email')}
                />
              </Grid>
            </Grid>
          </Grid>
            <Grid item xs={3} sm={3}>
              <Typography variant="sm-heading-02" value={t('AlertOtherUsers')} />
  
            </Grid>
            <Grid item xs={12} sm={12}>
  
              {
                WarnUserFields.map((val, i) => {
                  let buttonComponent;
  
                  if (WarnUserFields.length - 1 === i) {
                    buttonComponent = (
                      <Button type="ghost" icon={AddLight} stroke={useThemes.colorPalette.primary} onClick={() => addWarnOtherUser(val.field)} />
                    );
                  } else if (WarnUserFields.length !== 1) {
                    buttonComponent = (
                      <Button type="ghost" danger icon={Delete} stroke={useThemes.colorPalette.genericRed} onClick={() => removeWarnOtherUser(val.field)} />
                    );
                  } else {
                    buttonComponent = (
                      <Button type="ghost" icon={AddLight} stroke={useThemes.colorPalette.primary} onClick={() => addWarnOtherUser(val.field)} />
                    );
                  }
                  return <Grid key={i+1} container spacing={4} style={{ width: '100%' }}>
                    <Grid item xs={3} sm={3}>
                      <SelectBox
                        labelId=""
                        id={"drop-user" + val.field}
                        options={UserOption.filter(x => x.userByUserId.id !== props.currUser.id)}
                        auto={true}
                        multiple={false}
                        isMArray={true}
                        checkbox={false}
                        keyValue="value"
                        keyId="id"
                        dynamic={WarnUserFields}
                        placeholder={t("SelectaUser")}
                        value={val.user_id}
                        onChange={(e, r) => addWarnUsers(e, r, val.field)}
                      
  
                      />
                    </Grid>
  
                    <Grid item xs={3} sm={3} >
  
                      <CustomSwitch
                        id={'chk_' + val.field}
                        switch={false}
                        checked={val.alert_SMS}
                        onChange={(e) => addUserWarnValuesms(e, val.field)}
                        primaryLabel={t('SMS')}
                    disabled={isAlerAccess ? false : true}
  
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} >
                      <CustomSwitch
                        id={'chk_' + val.field}
                        switch={false}
                        checked={val.alert_email}
                        onChange={(e) => addUserWarnValueEmail(e, val.field)}
                        primaryLabel={t('Email')}
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} style={{ marginTop: "12px" }}>
                      {buttonComponent}
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
              <TypographyNDL value={t ("Please contact the support team to enable SMS services.")} color={'#DA1E28'} variant={'sm-helper-text-01'} />
            </div>
            </Grid>
            }
            <Grid item xs={3} sm={3}>
              <Typography variant="sm-heading-02" value={t('CommunicationChannel')} />
  
            </Grid>
            <Grid item xs={12} sm={12}>
            {
              warnchannelFields.map((val, i) => {
                let buttonComponent1;

                if (warnchannelFields.length - 1 === i) {
                  buttonComponent1 = (
                    <Button type="ghost" icon={AddLight} stroke={useThemes.colorPalette.primary} onClick={() => addWarnChannel()} />
                  );
                } else if (warnchannelFields.length !== 1) {
                  buttonComponent1 = (
                    <Button type="ghost" danger icon={Delete} stroke={useThemes.colorPalette.genericRed} onClick={() => removeWarnChannel(val.field)} />
                  );
                } else {
                  buttonComponent1 = (
                    <Button type="ghost" icon={Delete} stroke={useThemes.colorPalette.genericRed} onClick={() => removeWarnChannel(val.field)} />
                  );
                }
                return <div key={i+1} style={{ marginBottom: "15px" }}>
                  <Grid container spacing={3} style={{ width: '100%' }}>
                    <Grid item xs={4} sm={4}>

                      <SelectBox
                        labelId="hierarchyView"
                        id={"hierarchy-channel" + val.field}
                        auto={false}
                        multiple={false}
                        isMArray={true}
                        checkbox={false}
                        options={ChannelList}
                        keyValue="name"
                        keyId="id"
                        dynamic={warnchannelFields}
                        placeholder={t('SelectChannel')}
                        value={val.channel_id ? val.channel_id : ""}
                        onChange={(e) => addWarnChannelName(e, val.field)}

                      />


                    </Grid>
                    <Grid item xs={2} sm={2} >
                      {buttonComponent1}
                    </Grid>
                  </Grid>
                </div>
              })
            }
          </Grid>
            <Grid item xs={12} sm={12}>
            <Grid container spacing={4} style={{ width: '100%' }}>
              <Grid item xs={6} sm={6}>
                <div className="pb-5" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <Typography variant="sm-heading-02" value={"Level"}></Typography>
                    <InputFieldNDL
                      id="title"
                      value={'Critical'}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Typography variant="sm-heading-02" value={"Frequency"}></Typography>
                    <SelectBox
                    noSorting
                      labelId="freq"
                      id="select-freq"
                      value={selectedcrifreq}
                      options={frequencies}
                      placeholder={'Select Frequency'}
                      onChange={(e) => SetCriFrequency(e)}
                      multiple={false}
                      isMArray={true}
                      keyValue={"name"}
                      keyId="id"
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ width: '100%' }}>
              <Grid item xs={3} sm={3}>
                <Typography variant="paragraph-xs" value={t('Alertme')} />

              </Grid>
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'CheckmeSMS'}
                  switch={false}
                  checked={CheckmeCriSMS}
                  onChange={(e) => handleCriCheckme(e, 1)}
                  primaryLabel={t('SMS')}
                  disabled={isAlerAccess ? false : true}
                />
              
              </Grid>
              <Grid item xs={3} sm={3} >
                <CustomSwitch
                  id={'CheckmeEmail'}
                  switch={false}
                  checked={CheckmeCriEmail}
                  onChange={(e) => handleCriCheckme(e, 2)}
                  primaryLabel={t('Email')}
                />
              </Grid>
            </Grid>
            </Grid>
            <Grid item xs={3} sm={3}>
              <Typography variant="sm-heading-02" value={t('AlertOtherUsers')} />
  
            </Grid>
            <Grid item xs={12} sm={12}>
  
              {
                CriUserFields.map((val, i) => {
                  let buttonComponent;
  
                  if (CriUserFields.length - 1 === i) {
                    buttonComponent = (
                      <Button type="ghost" icon={AddLight} stroke={useThemes.colorPalette.primary} onClick={() => addCriOtherUser(val.field)} />
                    );
                  } else if (CriUserFields.length !== 1) {
                    buttonComponent = (
                      <Button type="ghost" danger icon={Delete} stroke={useThemes.colorPalette.genericRed} onClick={() => removeCriOtherUser(val.field)} />
                    );
                  } else {
                    buttonComponent = (
                      <Button type="ghost" icon={AddLight} stroke={useThemes.colorPalette.primary} onClick={() => addCriOtherUser(val.field)} />
                    );
                  }
                  return <Grid key={`userbox${i+1}`} container spacing={4} style={{ width: '100%' }}>
                    <Grid item xs={3} sm={3}>
                      <SelectBox
                        labelId=""
                        id={"drop-user" + val.field}
                        options={UserOption.filter(x => x.userByUserId.id !== props.currUser.id)}
                        auto={true}
                        multiple={false}
                        isMArray={true}
                        checkbox={false}
                        keyValue="value"
                        keyId="id"
                        dynamic={CriUserFields}
                        placeholder={t("SelectaUser")}
                        value={val.user_id}
                        onChange={(e, r) => addCriUsers(e, r, val.field)}
                       
  
  
                      />
                    </Grid>
  
                    <Grid item xs={3} sm={3} >
  
                      <CustomSwitch
                        id={'chk_' + val.field}
                        switch={false}
                        checked={val.alert_SMS}
                        onChange={(e) => addUserCriValuesms(e, val.field)}
                        primaryLabel={t('SMS')}
                    disabled={isAlerAccess ? false : true}

                      />
                    </Grid>
                    <Grid item xs={3} sm={3} >
                      <CustomSwitch
                        id={'chk_' + val.field}
                        switch={false}
                        checked={val.alert_email}
                        onChange={(e) => addUserCriValueEmail(e, val.field)}
                        primaryLabel={t('Email')}
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} style={{ marginTop: "12px" }}>
                      {buttonComponent}
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
              <TypographyNDL value={t ("Please contact the support team to enable SMS services.")} color={'#DA1E28'} variant={'sm-helper-text-01'} />
            </div>
            </Grid>
            }
            <Grid item xs={3} sm={3}>
              <Typography variant="sm-heading-02" value={t('CommunicationChannel')} />
  
            </Grid>
            <Grid item xs={12} sm={12}>
            {
              crichannelFields.map((val, i) => {
                let buttonComponent1;

                if (crichannelFields.length - 1 === i) {
                  buttonComponent1 = (
                    <Button type="ghost" icon={AddLight} stroke={useThemes.colorPalette.primary} onClick={() => addCriChannel()} />
                  );
                } else if (crichannelFields.length !== 1) {
                  buttonComponent1 = (
                    <Button type="ghost" danger icon={Delete} stroke={useThemes.colorPalette.genericRed} onClick={() => removeCriChannel(val.field)} />
                  );
                } else {
                  buttonComponent1 = (
                    <Button type="ghost" icon={Delete} stroke={useThemes.colorPalette.genericRed} onClick={() => removeCriChannel(val.field)} />
                  );
                }
                return <div key={`channel${i+1}`} style={{ marginBottom: "15px" }}>
                  <Grid container spacing={3} style={{ width: '100%' }}>
                    <Grid item xs={4} sm={4}>

                      <SelectBox
                        labelId="hierarchyView"
                        id={"hierarchy-channel" + val.field}
                        auto={false}
                        multiple={false}
                        isMArray={true}
                        checkbox={false}
                        options={ChannelList}
                        keyValue="name"
                        keyId="id"
                        dynamic={crichannelFields}
                        placeholder={t('SelectChannel')}
                        value={val.channel_id ? val.channel_id : ""}
                        onChange={(e) => addCriChannelName(e, val.field)}

                      />


                    </Grid>
                    <Grid item xs={2} sm={2} >
                      {buttonComponent1}
                    </Grid>
                  </Grid>
                </div>
              })
            }
          </Grid>
            </React.Fragment>
          }
        </Grid>
      </div>
    </React.Fragment>
  )

}
)

export default DataAlert;