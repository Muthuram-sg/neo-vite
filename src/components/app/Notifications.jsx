/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import 'components/style/notification.css'; 
import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import ClickAwayListener from 'react-click-away-listener'; 
import useGetTheme from 'TailwindTheme'; 
import NotificationDark from 'assets/neo_icons/Menu/notification_dark.svg?react';
import Delete from 'assets/neo_icons/Notification/Delete.svg?react';
import MarkAsRead from 'assets/neo_icons/Notification/MarkAsRead.svg?react';
import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType,exploreTabValue, userData, selectedPlant, alarmNotification, metricsArry } from "recoilStore/atoms";
import moment from 'moment';
import { useMutation } from "@apollo/client";
import configParam from "config";
import gqlQueries from "../layouts/Queries"
import { useTranslation } from 'react-i18next'; 
import { NavLink } from "react-router-dom";
import Activity from '../../assets/neo_icons/Notification/Activity.svg?react';
import Alert from '../../assets/neo_icons/Notification/Alarm_trend.svg?react';
import Alarm from '../../assets/neo_icons/Notification/Alarm.svg?react';
import Release from '../../assets/neo_icons/Notification/Release.svg?react';
import CriticalBadge from '../../assets/neo_icons/Notification/CriticalBadge.svg?react';
import WarnBadge from '../../assets/neo_icons/Notification/WarnBadge.svg?react';
import Audit from '../../assets/neo_icons/Notification/compliance-svgrepo-com.svg?react'; 
import ReportsPublished from '../../assets/neo_icons/Notification/ReportsPublished.svg?react'; 
import Tag from 'components/Core/Tags/TagNDL'; 
import "./Notification.css";  

 

export default function Notifications() { 
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); 
  const [, setNotificationCheckpoint] = useState("");
  const [, setClearNotificationCheckpoint] = useState("");
  const [newNotification, setNewNotification] = useState(false);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [curUserData, setUserDetails] = useRecoilState(userData);
  const [AlertNotify, setAlertNotification] = useRecoilState(alarmNotification); 
  const [, setExpTabValue] = useRecoilState(exploreTabValue);
  const [ActivityData,setActivityData] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)
  const [data, setData] = useState([]) 
  const [NotificationRead, setNotificationRead] = useState([]);
  const [, setmetricList] = useRecoilState(metricsArry); 
  const [tabValue, setTabValue] = useState(0); 
  const [,setreadNotify]= useState(false); 
  const theme = useGetTheme();

  useEffect(() => {
    if (headPlant.id) {
      getmetricList(headPlant)
      getInstrumentMetrics()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])
  useEffect(() => {
    if (!curUserData.user_notification) {
      userNotificationAddRow({ variables: { user_id: curUserData.id } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curUserData]);
  useEffect(() => {
    if (NotificationRead && new Date(curUserData.user_notification?.notification_checkpoint) < new Date(NotificationRead)) {
      setNewNotification(false)
      UpdateNotificationCheckpoint({ variables: { notification_checkpoint: new Date(NotificationRead), user_id: curUserData.id } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NotificationRead])
 

  function getmetricList(line_id) {
    configParam.RUN_GQL_API(gqlQueries.getParameterList, {})
      .then((metrics) => {
        const metricArr = metrics !== undefined && metrics.neo_skeleton_metrics && metrics.neo_skeleton_metrics.length > 0 ? metrics.neo_skeleton_metrics : [];
        setmetricList(metricArr);
      });
  }
  function getInstrumentMetrics() {
    configParam.RUN_GQL_API(gqlQueries.getInstrumentmetrics, {})
      .then((instruments) => { 
        //  console.log(instruments,"instruments")
      });
  } 

  // eslint-disable-next-line no-unused-vars 

  function updateUserDetails(user_id) {
    configParam.RUN_GQL_API(gqlQueries.GetUserDefaults, { user_id: user_id })
      .then((returnData) => {
        if (returnData !== undefined && returnData.neo_skeleton_user && returnData.neo_skeleton_user.length > 0) {
          setUserDetails(returnData.neo_skeleton_user[0]);
          if (returnData.neo_skeleton_user[0].user_notification) {
            getNotificationCount(returnData.neo_skeleton_user[0].user_notification.clear_notification_checkpoint, data, 0)
          }

        } else {
          console.log("forms returndata getUserDetails");
        }
      });
  }
  const getReadNotification = () => {
    configParam.RUN_GQL_API(gqlQueries.getReadNotificationList, { _eq: curUserData.id })
      .then((result) => {
        if (result && result.neo_skeleton_user_notification && result.neo_skeleton_user_notification.length > 0) {
          setNotificationRead(result.neo_skeleton_user_notification[0].read_checkpoint);
        }
      });


  } 

  const getNotificationCount = (checkpoint, notificationDataArray, alertCount) => {
    let count = 0
    count = parseInt(alertCount);
     if (notificationDataArray.length !== 0) {
      let arr=[]
      let arrread=[]
      if( curUserData.user_notification && curUserData.user_notification.notification_checkpoint &&
        (new Date(moment(checkpoint).format("YYYY-MM-DD HH:mm:ss")).getTime() < new Date(moment(new Date(curUserData.user_notification.notification_checkpoint)).format("YYYY-MM-DD HH:mm:ss")).getTime())
        ){
        // console.log("notification_checkpoint",notificationDataArray.filter(x => console.log("filter",new Date(moment(new Date(curUserData.user_notification.notification_checkpoint)).format("YYYY-MM-DD HH:mm:ss")),new Date(moment(x.time).format("YYYY-MM-DD HH:mm:ss")))))
        arr = notificationDataArray.filter(x =>new Date(moment(new Date(curUserData.user_notification.notification_checkpoint)).format("YYYY-MM-DD HH:mm:ss")).getTime() < new Date(moment(x.time).format("YYYY-MM-DD HH:mm:ss")).getTime());
      }
      if (
        curUserData.user_notification && curUserData.user_notification.read_checkpoint &&
        (new Date(checkpoint).getTime() < new Date(curUserData.user_notification.read_checkpoint).getTime())
      ) {
        // console.log(moment(new Date(curUserData.user_notification.notification_checkpoint)).format("YYYY-MM-DD HH:mm:ss"),"read_checkpoint",notificationDataArray.filter(x => new Date(curUserData.user_notification.read_checkpoint) < new Date(moment(x.time).format("YYYY-MM-DD HH:mm:ss"))))
        arrread =notificationDataArray.filter(x => new Date(curUserData.user_notification.read_checkpoint) < new Date(moment(x.time).format("YYYY-MM-DD HH:mm:ss")))
      }
      let merarr =arr.concat(arrread)  
      // Declare a new array
      let newArray = [];
      // Declare an empty object
      let uniqueObject = {};
      // Loop for the array elements
      for (let i in merarr) {
          // Extract the title
          let objTitle = merarr[i]['discription'];
          // Use the title as the index
          uniqueObject[objTitle] = merarr[i];
      }
      // Loop to push unique object into array
      for (let i in uniqueObject) {
          newArray.push(uniqueObject[i]);
      } 
      // Display the unique objects 
      if(newArray.length>0){
        count = count + newArray.length
      } 

    } 
      // console.log(count,"cnt")
    setNotificationCount(count);
    setNewNotification(true);
  }
  useEffect(() => { 
    // console.log(curUserData,"curUserData")
    if (data && data.length > 0 && curUserData.user_notification && !curUserData.user_notification.notification_checkpoint) { 
      
      let checkpointDate = null;
      if (curUserData.user_notification && curUserData.user_notification.clear_notification_checkpoint) {
        checkpointDate = curUserData.user_notification.clear_notification_checkpoint;
      }
      getNotificationCount(checkpointDate, data, 0)
    }else{
      if(data.length > 0 && curUserData.user_notification && curUserData.user_notification.notification_checkpoint){
        let checkpointDate = null;
        if (curUserData.user_notification && curUserData.user_notification.clear_notification_checkpoint) {
            checkpointDate = curUserData.user_notification.clear_notification_checkpoint;
        } 
        getNotificationCount(checkpointDate, data, 0)
      }
      
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const clearNotification = () => {
    getReadNotification();
    setData([]);
    setActivityData([])
    setAlertNotification([])
    updateClearNotificationCheckpoint({ variables: { clear_notification_checkpoint: new Date(), user_id: curUserData.id } })
    setClearNotificationCheckpoint(new Date());
    setNotificationCheckpoint(new Date());
    setNewNotification(false);
    setNotificationCount(0) 
    markAsReadNotification({ variables: { user_id: curUserData.id } });
    handleClose() 
  }

  const [updateClearNotificationCheckpoint, { error: clearNotificationCheckpointError }] = useMutation(
    configParam.UpdateClearNotificationCheckpoint,
    {
      update: (inMemoryCache, returnData) => {
        if (!clearNotificationCheckpointError) {
          SetMessage(t('ClearNotificationsSuccess'))
          SetType("success")
          setOpenSnack(true)
          updateUserDetails(curUserData.id)
        }
        else {
          SetMessage(t('ClearNotificationsError'))
          SetType("error")
          setOpenSnack(true)
        }
      }
    }
  ); 

  function getListitemIcon(type, NotificationReadDt, Createdat) {
    switch (type) {
      case 'Alarm':
        return <Alarm className={(new Date(NotificationReadDt) < new Date(Createdat)) ? "unread-alarm-icon" : "read-alarm-icon"} />
      case 'Release':
        return <Release className={(new Date(NotificationReadDt) < new Date(Createdat)) ? "unread-release-icon" : "read-release-icon"} />
      case 'Audit':
        return <Audit />
      case 'Report':
        return <ReportsPublished />
      default: break
    }
  }
 

  function getBadge(type) {
    switch (type) {
      case ('warn'):
        return <WarnBadge style={{ verticalAlign: "text-top" }} />
      case ('critical'):
        return <CriticalBadge style={{ verticalAlign: "text-top" }} />
      case ('crit'):
        return <CriticalBadge style={{ verticalAlign: "text-top" }} />
      case ('warning'):
        return <WarnBadge style={{ verticalAlign: "text-top" }} />
      case ('ok'):
        return <span style={{ fontSize:'12px',color:'green',fontWeight: 400,background:'#0abb0a29',padding: '1px 10px',borderRadius:'4px' }} >Ok</span>
      default: break
    }
  }

  const handleClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchorEl(null);
  };

  const markAsRead = () => {
    setNewNotification(false);
    setNotificationCount(0)
    UpdateNotificationCheckpoint({ variables: { notification_checkpoint: new Date(), user_id: curUserData.id } })
    markAsReadNotification({ variables: { user_id: curUserData.id } });
    updateUserDetails(curUserData.id)
    handleClose()
    setreadNotify(true)
    setTimeout(()=>{
      setreadNotify(false)
    },10000)
    
  }

  const [markAsReadNotification] = useMutation(
    configParam.makeNotificationRead,
    {
      update: () => {
        UpdateNotificationCheckpoint({ variables: { notification_checkpoint: new Date(), user_id: curUserData.id } })
      }
    }
  )
  const [UpdateNotificationCheckpoint, { error: notificationCheckpointError }] = useMutation(
    configParam.UpdateNotificationCheckpoint,
    {
      update: () => {
        if (notificationCheckpointError) {
          SetMessage(t('NotificationCloseError'))
          SetType("error")
          setOpenSnack(true)
        }
        else {
          setNotificationCheckpoint(new Date());
          updateUserDetails(curUserData.id)
          getNotificationCount(new Date(), data, 0) 
        }
      }
    }
  );
  const [userNotificationAddRow, { error: userNotificationAddRowError }] = useMutation(
    configParam.userNotificationAddRow,
    {
      update: () => {
        if (userNotificationAddRowError) {
          SetMessage(t('NotificationCloseError'))
          SetType("error")
          setOpenSnack(true)
        }

      }
    }
  );

  const viewAlarmHistory = () => {
    setExpTabValue(1)
    handleClose();
  }
  const downloadReport = async (report_name, id) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/zip");
    myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
    myHeaders.append("responseType", 'blob');
    const requestOptions = {
      method: "GET",
      headers: myHeaders
    };
    const url = configParam.API_URL + "/iiot/reportFile?report_id=" + id;
    await fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          response.blob().then(function (myBlob) {
            const fileURL = URL.createObjectURL(myBlob);
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', report_name);
            fileLink.setAttribute('target', '_blank');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        });               
      }else{
        SetMessage(t('Problem in download this report'))
        SetType("error")
        setOpenSnack(true)
      } 
    }) 
    .catch((error) => {
      SetMessage(t('Problem in download this report'))
      SetType("error")
      setOpenSnack(true)
    });
  }
  const [, { error: updateerr }] = useMutation(
    configParam.updateReportGeneration,
    {
      update: () => {
        if (!updateerr) {
          console.log('report updated');
        }
      }
    }
  );

  function BadgeColor(v){
    if(v.badge ==='ok'){
      return 'green'
    }else if(v.badge ==='warning'){return '#FF9500'}else{
      return '#FF0D00'
    }
  }

  return (
    
    <React.Fragment>  
      
      {newNotification && (notificationCount !== 0) ?  
      <>
      
      <NotificationDark stroke={"#FCFCFC"} onClick={handleClick}/> 
      <Tag name={notificationCount} color={'interact-accent-default'} style={{position:'relative',padding:'1px 4px',left:'-11px',top:'-11px'}}/>
      </>
      : 
      <NotificationDark stroke={"#FCFCFC"} onClick={handleClick}/> 
      }
      
      {Boolean(notificationAnchorEl) &&
      <ClickAwayListener onClickAway={handleClose}>
      <div style={{position:'absolute',height:data.length > 0 ? '600px' :'auto' }} className='Notification-Main'>
        {data && data.length > 0 && 
              
          <React.Fragment>
            <div style={{display:'flex'}}>
              
                <p variant="caption" style={{ fontSize: '14px', lineHeight: "24px",fontWeight:500,color:'#101010' }}> {t('NotificationCenter')} </p>
                <div style={{ marginLeft: 'auto'}} >
                  <Tooltip title={t('Mark all as read')} placement="bottom" arrow>
                    <MarkAsRead onClick={markAsRead} style={{ marginRight: 5, cursor: "pointer"}} />
                  </Tooltip>
                  <Tooltip title={t('Clear Notifications')} placement="bottom" arrow>
                    <Delete onClick={clearNotification} style={{ marginRight: 5, cursor: "pointer"}} />
                  </Tooltip>
                </div> 
            </div>
            <div id='noNotification'>
              <div class="border-b border-gray-200 dark:border-gray-700">
                  <ul class="flex -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                      <li class="mr-2" style={{width:'50%'}} onClick={() => setTabValue(0)}>
                          <div className={"w-full inline-flex p-3 border-b-2 rounded-t-lg dark:hover:text-gray-300 group"+ (tabValue === 0 ? ' border-blue-600 text-blue-600 active' :' border-transparent hover:text-gray-600 hover:border-gray-300')}>
                            <Alert stroke={tabValue === 0 ? theme.colorPalette.blue : "#101010"} style={{margin: '0px 6px'}}/>{t("Alerts")}
                          </div>
                      </li>
                      <li class="mr-2" style={{width:'50%'}} onClick={() => setTabValue(1)}>
                          <div className={"w-full inline-flex p-3 border-b-2 rounded-t-lg dark:text-blue-500 dark:border-blue-500 group"+ (tabValue === 1 ? ' border-blue-600 text-blue-600 active' : ' border-transparent hover:text-gray-600 hover:border-gray-300')} aria-current="page">
                            <Activity stroke={tabValue === 1 ? theme.colorPalette.blue : "#101010"} style={{margin: '0px 6px'}}/>{t("Activity")}
                          </div>
                      </li>
                      
                  </ul>
              </div>
              
            </div>
            {tabValue === 0 ?
              <React.Fragment>
              <div id='contentlist' className='Notify-content'>
                <ul style={{width: '100%'}}>
                  {AlertNotify.map(v=>{
                    return (
                      <li style={{display: 'flex',padding:'10px',background:'#E7F1FF',borderRadius:'4px',marginBottom: '5px'}}>
                      <Alert stroke={BadgeColor(v)}/> 
                      <div style={{padding: '0px 10px',width: '350px'}}>
                        <p style={{ fontSize: 12, lineHeight: "16px",fontWeight: '500' }}>
                            {v.name}
                        </p>
                        <p style={{ fontSize: 10, lineHeight: "16px" }}>
                            {v.metric}
                        </p>
                        <p style={{ fontSize: 9, lineHeight: "16px",color:"#FF0D00"}}>
                            #Alarm <span style={{padding: '2px 6px'}}>{getBadge(v.badge)}</span>
                        </p>
                      </div>
                      <div style={{marginLeft: 'auto',width: '200px'}}>
                        <p style={{ fontSize: 11, lineHeight: "16px",whiteSpace: 'break-spaces',textAlign: 'end'}}>
                            {v.instrument}
                        </p>
                        <p style={{ fontSize: 9, lineHeight: "16px",color:theme.colorPalette.blue ,marginTop: '11px',float: 'right'}}>
                            {moment(v.time).fromNow()}
                        </p>
                      </div> 
                    </li>
                    )
                  }) } 
                  {AlertNotify.length ===0 && 
                  <li style={{alignItems: 'flex-start',background:'#E7F1FF',borderRadius:'4px',marginBottom: '5px'}}>
                    No new Notification
                  </li>
                  }
                </ul>
              </div>
              <div id='alarmHistory' style={{textAlign: 'center'}}>
                <NavLink style={{ textDecoration: "none", color: theme.colorPalette.primary }} to={"/neo/explore"} onClick={viewAlarmHistory}><p variant="caption" style={{ fontSize: 12, lineHeight: "24px",color: "#0085FF" }}>{t('View all alerts')} </p>
                </NavLink>
              </div>
              </React.Fragment>
              :
              <React.Fragment>
              <div id='contentlist' className='Notify-content'>
                <ul style={{width: '100%'}}>
                  {ActivityData.map(v=>{
                    return (
                      <li style={{display: 'flex',padding:'10px',background:'#E7F1FF',borderRadius:'4px',marginBottom: '5px'}}>
                      {getListitemIcon(v.type,NotificationRead,v.time)}
                      {/* <Release stroke={'#007BFF'}/>  */}
                      <div style={{padding: '0px 10px',width: '350px'}}>
                        <p style={{ fontSize: 12, lineHeight: "16px",fontWeight: '500' }}>
                            {v.name}
                        </p>
                        <p style={{ fontSize: 10, lineHeight: "16px",whiteSpace: 'break-spaces' }}>
                            <span style={{color:'#007BFF'}} onClick={()=>downloadReport(v.entity,v.id)}>{v.type ==='Report' && 'Click here'}</span>{v.discription}
                        </p>
                        <p style={{ fontSize: 9, lineHeight: "16px",color:v.type === "Release" ? "#007BFF" : "#585757"}}>
                            #{v.type}
                        </p>
                      </div>
                      <div style={{marginLeft: 'auto',marginTop :v.type === "Release" ? 'auto' : 0,width: '200px'}}>
                        <p style={{ fontSize: 11, lineHeight: "16px",whiteSpace: 'break-spaces',textAlign: 'end' }}>
                            {v.entity}
                        </p>
                        <p style={{ fontSize: 9, lineHeight: "16px",color:theme.colorPalette.blue ,marginTop: '11px',float: 'right'}}>
                            {moment(v.time).fromNow()}
                        </p>
                      </div> 
                    </li>
                    )
                  }) } 
                  {ActivityData.length ===0 && 
                  <li style={{alignItems: 'flex-start',background:'#E7F1FF',borderRadius:'4px',marginBottom: '5px'}}>
                    No new Notification
                  </li>
                  }
                  
                </ul>
              </div>
              <div id='alarmHistory' style={{textAlign: 'center'}}>
                <NavLink style={{ textDecoration: "none", color: theme.colorPalette.primary }} to={"/neo/activity"} onClick={handleClose}>
                  <p variant="caption" style={{ fontSize: 12, lineHeight: "24px",color: "#0085FF" }}>
                    {t('View all activity')} 
                  </p>
                </NavLink>
              </div>
              </React.Fragment>
            }
            
          </React.Fragment>
        }
        {data && data.length === 0 &&
          <React.Fragment>
            <div style={{textAlign:'center'}}>No new Notification</div>
          </React.Fragment>
        }
      </div>
      </ClickAwayListener>
      }
      
    </React.Fragment>
  )
}
