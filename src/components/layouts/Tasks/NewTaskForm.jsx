import React, { useRef, useState, useEffect, createRef, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import useTheme from 'TailwindTheme';
import Button from 'components/Core/ButtonNDL';
import { useTranslation } from 'react-i18next';
import configParam from 'config';
import ParagraphText from 'components/Core/Typography/TypographyNDL'; 
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ModalNDL from 'components/Core/ModalNDL';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import FileIcon from 'assets/neo_icons/Menu/File_icon.svg?react';
import { useRecoilState } from 'recoil';
import { selectedPlant, snackToggle, snackMessage, snackType, userData,themeMode } from 'recoilStore/atoms';
import useEntityList from './hooks/useEntityList';
import useTaskTypeList from './hooks/useTaskTypeList';
import useTaskPriority from './hooks/useTaskPriority';
import useTaskStatus from './hooks/useTaskStatus';
import useDownloadFiles from './hooks/useDownloadFiles';
import useActionTakenList from './hooks/useActionTaken';
import useAddTask from './hooks/useAddTask';
import useEditTask from './hooks/useEditTask';
import useViewFiles from './hooks/useViewFiles';
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL'
import TaskHistory from './components/TaskHistory'
import useGetEntityInstrumentsList from './hooks/useGetEntityInstrumentsList.jsx' 
import Image from "components/Core/Image/ImageNDL";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx"; 
import useInstrumentStatusList from './hooks/useInstrumentStatusList';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import Delete from 'assets/neo_icons/Notification/Delete.svg?react';
import Document from 'assets/neo_icons/Explore/doc.svg?react';
import PDF from 'assets/neo_icons/Explore/pdf.svg?react';
import Excel from 'assets/neo_icons/Explore/xls.svg?react';
import LoadingScreenNDL from "LoadingScreenNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import Grid from 'components/Core/GridNDL'
import HorizontalLine from 'components/Core/HorizontalLine/HorizontalLineNDL';
import useMainComponentList from './hooks/useMainComponentList';
import useSubComponentList from './hooks/useSubComponentList';
import useSuspectFaultList from './hooks/useSuspectFaultList';
import useGetInstrumentType from './hooks/useGetInstrumentType';
import useUpdateAlarmAcknowledgement from 'components/layouts/Alarms/Overview/hooks/useUpdateAlarmAcknowledgement' 
// NOSONAR
const TaskForm = forwardRef((props, ref) => {
    console.log("propsprops",props.taskListData)
    const [headPlant] = useRecoilState(selectedPlant);
    const [curTheme]=useRecoilState(themeMode)
    const [IsEditable,setIsEditable] = useState(true) 
    const [taskPrimaryID, setTaskPrimaryID] = useState('') 
    const [assetID, setAssetID] = useState('');
    const [instrumentID, setInstrumentID] = useState(''); 
    const [assigneeID, setAssigneeID] = useState(''); 
    const [observedByID, setObservedByID] = useState(null); 
    const [reportedByID, setReportedByID] = useState(null);
    const [isInstrument, setIsInstrument] = useState(false);
    const [observedDate, setObservedDate] = useState(new Date());
    const [reportedDate,setreportedDate] = useState(new Date());
    const [type, setType] = useState('');
    const [priority, setPriority] = useState(14);
    const [instype, setinstype] = useState('');
    const [status, setStatus] = useState('');
    const [listArr,setListArr]=useState([{ index: 'Overview', name: 'Task' }])
    const [, setCreatedDate] = useState(new Date());
    const [createdByName,setcreatedByName] = useState(''); 
    const [dueDate, setDueDate] = useState(new Date(moment(moment().add(45,'days')).format('YYYY-MM-DDTHH:mm:ssZ')));
    const [filesArr, setFilesArr] = useState([]);
    const [entityInstrumentArr, setEntityInstrumentArr] = useState([]);
    const [subComponentListOptions, setSubComponentListOptions] = useState([]);
    const [attachmentloading] = useState(false)
    const [actionTakenDate, setActionDate] = useState(new Date());
    const [deletedFiles, setDeleteFiles] = useState([]);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [taskActions, setTaskActions] = useState(null);
    const [actionTakenID, setActionTakenID] = useState('');
    const [faultModeID, setFaultModeID] = useState('');
    const [faultOption,setfaultOption] = useState([]);
    const [isFaultMode, setIsFaultMode] = useState(false);
    const [mainComponentID, setMainComponentID] = useState('');
    const [isMainComponent, setIsMainComponent] = useState(false);
    const [subComponentID, setSubComponentID] = useState('');
    const [isSubComponent, setIsSubComponent] = useState(false);
    const [instrumentStatusID, setInstrumentStatusID] = useState('');
    const [isInstrumentStatus, setIsInstrumentStatus] = useState(false);
    const [isName, setIsName] = useState(false);
    const [isDescription] = useState(false);
    const [isAsset, setIsAsset] = useState(false);
    const [isAssignee, setIsAssignee] = useState(false);
    const [isType, setIsType] = useState(false);
    const [isPriority, setIsPriority] = useState(false);
    const [isStatus, setIsStatus] = useState(false);
    const [isActionTaken, setIsActionTaken] = useState(false);
    const [currUser] = useRecoilState(userData);
    const [UserOption, setUserOption] = useState([])
    const [loading, setLoading] = useState(false);
    const [assigneGmail, setassigneGmail] = useState('');
    const [editAssigneCheck, seteditAssigneCheck] = useState('');
    const [previousassigneGmail, setpreviousassigneGmail] = useState('');
    const [isAssigneChange, setisAssigneChange] = useState(false);
    const [editTaskStatusCheck, setEditTaskStatusCheck ] = useState(false);
    const [isTaskStatusChange, setIsTaskStatusChange] = useState(false);  
    const [isTaskCompleted,setisTaskCompleted] = useState(false)
    const [OpenConfirmDialog,setOpenConfirmDialog] = useState(false)
    const { EntityListLoading, EntityListData, EntityListError, getEntityList } = useEntityList();
    const { TypeListLoading, TypeListData, TypeListError, getTypeList } = useTaskTypeList()
    const { PriorityListLoading, PriorityListData, PriorityListError, getPriorityList } = useTaskPriority();
    const { StatusListLoading, StatusListData, StatusListError, getStatusList } = useTaskStatus();
    const { DonwloadFilesLoading, DownloadFilesData, DonwloadFilesError, getDownloadFiles } = useDownloadFiles();
    const { ActionTakenListLoading, ActionTakenListData, ActionTakenListError, getActionTakenList } = useActionTakenList();
    const { AddTaskLoading, AddTaskData, AddTaskError, getAddTask } = useAddTask()
    const { EditTaskLoading, EditTaskData, EditTaskError, getEditTask } = useEditTask()
    const { ViewFilesLoading, ViewFilesData, ViewFilesError, getViewFiles } = useViewFiles()
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList } = useGetEntityInstrumentsList(); 
    const { InstrumentTypeLoading, InstrumentTypeData, InstrumentTypeError, getInstrumentType } = useGetInstrumentType()
    const { MainComponentListLoading, MainComponentListData, MainComponentListError, getMainComponentList } = useMainComponentList();
    const { SubComponentListLoading, SubComponentListData, SubComponentListError, getSubComponentList } = useSubComponentList();
    const { SuspectFaultListLoading, SuspectFaultListData, SuspectFaultListError, getSuspectFaultList } = useSuspectFaultList();
    const { InstrumentStatusLoading, InstrumentStatusData, InstrumentStatusError, getInstrumentStatusList } = useInstrumentStatusList();
    const { getUpdateAlarmAcknowledgement } =useUpdateAlarmAcknowledgement()
    const [isShowDatacollectedDetails, setisShowDatacollectedDetails] = useState(false);
    const [taskCompletedBy, setTaskCompletedBy] = useState('');

    const titleRef = useRef();
    const descRef = useRef();  
    const commentsRef = useRef();
    const actionRecommendedRef = useRef();
    const maxTotalFileSize  = 1024 * 1024;
    const dropzoneRef = createRef();
    const historyRef = useRef();
    const { t } = useTranslation();
    const theme= useTheme()
    const borderStyle = curTheme === 'dark' ? '2px dashed #2a2a2a' : '2px dashed #e8e8e8';
    const classes = {
        root: {
            "& .MuiInputBase-root": {
                fontSize: 16,
                lineHeight: "24px",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.secondaryText.main
            },
            "& .MuiOutlinedInput-notchedOutline": {
                border: 0
            },
            "& .MuiGrid-item": {
                padding: 4
            },
        },
        imageField: {
            border: borderStyle,
            borderRadius: '6px',
            textAlign: 'center',
            padding: '16px'
        }
    }
    useImperativeHandle(ref, () => ({
        bindValue: (value) => {
            bindValue(value)
            historyRef.current.historyList(value.id, value.task_id)
        },
        createTask: (e) => {
            titleRef.current.value = e.title;
            descRef.current.value = e.description;
            setObservedDate(moment(e.time).format('YYYY-MM-DDTHH:mm:ssZ'));
            setActionDate(moment(e.time).format('YYYY-MM-DDTHH:mm:ssZ'))
            setDueDate(moment(e.time).format('YYYY-MM-DDTHH:mm:ssZ'))
            if (e.entity_id) {
                setAssetID(e.entity_id) 
            }
            if (e.taskPriority) {
                setPriority(e.taskPriority.id) 
            }
            if (e.instrument && e.instrument.id) { 
                setInstrumentID(e.instrument.id);
            }
            if(e.taskType){
                setType(e.taskType.id);
            }
            if (e.taskStatus) {
                setStatus(e.taskStatus.id);
                setEditTaskStatusCheck(e.taskStatus.id)
                if(e.taskStatus.id === 3 || e.taskStatus.id === 21){
                    setisTaskCompleted(true)
                }
            }
            if (e.instrument_status_type && e.instrument_status_type.id) {
                setInstrumentStatusID(e.instrument_status_type.id);
            }
            setIsEditable(false)
            breadCrumbHandler("New Task")
            setReportedByID(currUser.id)
            setObservedByID(currUser.id) 
            setIsEditable(false)
        },
        breadCrumbHandler:(e)=>{
            setReportedByID(currUser.id)
            setObservedByID(currUser.id)
            setStatus(1);
            setIsEditable(false)
            breadCrumbHandler(e)
        }
    }))

    useEffect(() => {
        getEntityList(headPlant.id)
        getEntityInstrumentsList(headPlant.id);
        getMainComponentList(); 
        getInstrumentStatusList();
        getTypeList();
        getPriorityList();
        getStatusList();
        getUsersListForLine(headPlant.id);
        getSuspectFaultList()
        getInstrumentType(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id]) 

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
        if (!SubComponentListLoading && SubComponentListData && !SubComponentListError) {
            if(SubComponentListData && SubComponentListData.length > 0){
                setSubComponentListOptions(SubComponentListData)
            } else {
                setSubComponentListOptions([])
            }
        }
        else {
            setSubComponentListOptions([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SubComponentListData, mainComponentID])

    useEffect(() => {
        if (!InstrumentTypeLoading && InstrumentTypeData && !InstrumentTypeError) {
            console.log("InstrumentTypeData", InstrumentTypeData);
    
            const matchingInstrument = InstrumentTypeData.find(instrument => instrument.id === instrumentID);
    
            if (matchingInstrument && matchingInstrument.instrumentTypeByInstrumentType) {
                setinstype(matchingInstrument.instrumentTypeByInstrumentType.name);
            } else {
                setinstype(''); 
            }
        }
    }, [InstrumentTypeLoading, InstrumentTypeData, InstrumentTypeError, instrumentID]);

    useEffect(() => {
        if (!ActionTakenListLoading && !ActionTakenListError && ActionTakenListData && ActionTakenListData.length > 0) { 
            let FaultID = ActionTakenListData.map(e=> e.fm_id).filter((obj, index) => { // Filter Unique metrics
                return index === ActionTakenListData.map(f=> f.fm_id).findIndex(o => obj === o);
            }); 
            let Optionval = FaultID.filter(x=> x).map(y=>{
                let obj = (!SuspectFaultListLoading && SuspectFaultListData && !SuspectFaultListError) ? SuspectFaultListData.filter(s=> s.id === y)[0] : {}
                return {...obj}    
            })
            // console.log(ActionTakenListData,"ActionTakenListDataActionTakenListData",FaultID,Optionval)
            setfaultOption(Optionval)
            const actionList = [...ActionTakenListData];
            actionList.push({ "id": "8c47d281-cfdc-4672-8189-292084fe15dc", "name": "Others" })
            setTaskActions(actionList);
            
        } else {
            setTaskActions([{ "id": "8c47d281-cfdc-4672-8189-292084fe15dc", "name": "Others" }])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ActionTakenListData])
    useEffect(() => {
        if (DownloadFilesData) {
            const blobfile = new Blob([DownloadFilesData.response], { type: 'text/plain' })
            const fileURL = URL.createObjectURL(blobfile);
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', DownloadFilesData.file_name);
            fileLink.setAttribute('target', '_blank');
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
        }
        if (!DonwloadFilesLoading && DownloadFilesData && !DonwloadFilesError) {
            SetMessage(t('Problem in download this report'))
            SetType("error")
            setOpenSnack(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DownloadFilesData])
    useEffect(() => {
        if (AddTaskData && AddTaskData.length > 0) {
            if (filesArr.length > 0) {
                uploadFiles(AddTaskData[0].id)
            } else {
                let alarmTask = localStorage.getItem("createTaskFromAlarm") ? JSON.parse(localStorage.getItem("createTaskFromAlarm")) : ''
                if(alarmTask){
                    const body = {
                        "schema": headPlant.schema,
                        "set": { task_id: AddTaskData[0].id },
                        "where": [{ iid: alarmTask.state.instrument.id, key: alarmTask.state.metricKey, time: alarmTask.state.time, alert_level: alarmTask.state.alarmStatus }]
                    }
                    localStorage.setItem("createTaskFromAlarm",'')
                    getUpdateAlarmAcknowledgement(body)
                }
                SetMessage(t(`Task created succesfully`))
                SetType("success")
                setOpenSnack(true);
                props.changeSec('Overview');

            }
            
            if(Number(status) === 16){
                triggerAssigne(assigneGmail,"",true)
            } 
            
            setLoading(false)
        }
        if (!AddTaskData && !AddTaskLoading && AddTaskError) {
            SetMessage(t(`Task creation failed`))
            SetType("warning")
            setOpenSnack(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddTaskData])
    useEffect(() => {
        if (EditTaskData && EditTaskData.length > 0) {
            if (filesArr.length > 0 || deletedFiles.length > 0) {

                updatingFiles()
            } else { 
                
                SetMessage(t(`Task edited succesfully`))
                SetType("success")
                setOpenSnack(true);
                props.changeSec('Overview');
            }
            if (isAssigneChange) {
                triggerAssigne(assigneGmail, previousassigneGmail)
            }
           

            if (isTaskStatusChange) {
              
                    let observerEmail = UserOption &&  UserOption.filter(a => a.id === observedByID)[0] && UserOption.filter(a => a.id === observedByID)[0].userByUserId.email
                    let reporteEmail = UserOption &&  UserOption.filter(a => a.id === observedByID)[0] && UserOption.filter(a => a.id === reportedByID)[0].userByUserId.email
                    let emailArray = [observerEmail,reporteEmail]
                   triggerAssigne("","","",emailArray)
                
            }
            setLoading(false)
            setisTaskCompleted(false)
        }
        if (!EditTaskData && !EditTaskLoading && EditTaskError) {
            SetMessage(t(`Task edit failed`))
            SetType("warning")
            setOpenSnack(true);
            setisTaskCompleted(false)

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EditTaskData])
    useEffect(() => {
        if (!ViewFilesLoading && !ViewFilesError && ViewFilesData && ViewFilesData.length > 0) {
            setFilesArr(ViewFilesData);
        } else {
            setFilesArr([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ViewFilesData])
    useEffect(() => {
        if (!EntityInstrumentsListLoading && !EntityInstrumentsListError && EntityInstrumentsListData) {
            let EntityInstrumentsList = EntityInstrumentsListData ? EntityInstrumentsListData.filter(x => x.entity_id === assetID).map(v => { return { id: v.instrument.id, name: v.instrument.name } }) : []
            setEntityInstrumentArr(EntityInstrumentsList)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EntityInstrumentsListData, assetID])
    //NOSONAR
    const bindValue = (value) => { 
        try {
            titleRef.current.value = value.title;
            descRef.current.value = value.description;
            setTaskPrimaryID(value.id);
            if (value.entityId && value.entityId.id) {
                setAssetID(value.entityId.id)
                let EntityInstrumentsList = EntityInstrumentsListData ? EntityInstrumentsListData.filter(x => x.entity_id === value.entityId.id).map(v => { return { id: v.instrument.id, name: v.instrument.name } }) : []
                setEntityInstrumentArr(EntityInstrumentsList)
            }
            if (value.instrument && value.instrument.id) {

                setInstrumentID(value.instrument.id);
            }
            if (value.faultModeByFaultMode && value.faultModeByFaultMode.id) {
                setFaultModeID(value.faultModeByFaultMode.id);
            }
            if (value.instrument_status_type && value.instrument_status_type.id) {
                setInstrumentStatusID(value.instrument_status_type.id);
            }
            if (value.userByAssignedFor && value.userByAssignedFor.id) {
                seteditAssigneCheck(value.userByAssignedFor.id)
                setAssigneeID(value.userByAssignedFor.id);
                setpreviousassigneGmail(value.userByAssignedFor.email)
            }
            if (value.userByObservedBy && value.userByObservedBy.id) {
                setObservedByID(value.userByObservedBy.id); 
        
            }
            setType(value.type);
            console.log("value.type", value.type)
            if (value.userByReportedBy && value.userByReportedBy.id) { 
                setReportedByID(value.userByReportedBy.id);
            }
            setObservedDate(value.observed_date);
            if (value.priority) {
                setPriority(value.priority)
            }
            if(value.taskType.id === 27 || value.taskType.id === 29){
                setisShowDatacollectedDetails(true)
            } else if(value.taskType.id === 20 || value.taskType.id === 15 || value.taskType.id === 28){
                setisShowDatacollectedDetails(false)
            }
            if (value.status) {
                setStatus(value.status);
                setEditTaskStatusCheck(value.status)
                if(value.status === 3){
                    setisTaskCompleted(true)
                    setTaskCompletedBy(value.task_closed_by)
                }
            }
            breadCrumbHandler(value.task_id) 
            if(!value.mcc_id){
                setFaultModeID('')
            }
            setMainComponentID(value.mcc_id)
            getSubComponentList(value.mcc_id)
            setSubComponentID(value.scc_id) 
            getActionTakenList(value.mcc_id, value.scc_id)
            setreportedDate(value.reported_date) 
            setCreatedDate(value.created_ts);
            setcreatedByName(value.userByCreatedBy ? value.userByCreatedBy.name : '')
            actionRecommendedRef.current.value = value.action_recommended;
            
            setDueDate(value.due_date);
            setActionTakenID(value.action_taken);
            setActionDate(value.action_taken_date);
            commentsRef.current.value = value.comments;
            if (value.tasksAttachements.length > 0)
                getViewFiles(value.id)
            else setFilesArr([])
        } catch (err) {
            console.log('Error on task form', err);
        }
    }
    const handleAsset = (e) => {
        if(e.target.value){
            setIsAsset(false)
            setAssetID(e.target.value)
        let EntityInstrumentsList = EntityInstrumentsListData ? EntityInstrumentsListData.filter(x => x.entity_id === e.target.value).map(v => { return { id: v.instrument.id, name: v.instrument.name } }) : []
        setEntityInstrumentArr(EntityInstrumentsList)
        }
        
    }

    const handleInstruments = (e) => {
        if(e.target.value){
            setIsInstrument(false)
            setInstrumentID(e.target.value) 
        }
        
    }

    const handleAssignee = (e, option) => {
        if(e.target.value){
            setIsAssignee(false)
            setAssigneeID(e.target.value)
            setassigneGmail(option.filter(a => a.id === e.target.value)[0].userByUserId.email)
        }
        
    }
    
    const handleReportedUser = (e,option) => {
        setReportedByID(e.target.value) 
    }
    const handleObservedUser = (e, option) => {
        setObservedByID(e.target.value) 

    }
    const handleType = (e) => {
        if(e.target.value){
          setIsType(false)
          setType(e.target.value)
          if(e.target.value === 20){
            setPriority(17)
          }
          if(e.target.value === 20 || e.target.value === 15 || e.target.value === 28 ){
            setisShowDatacollectedDetails(false)
          } else if(e.target.value === 27 || e.target.value === 29 ){
            setisShowDatacollectedDetails(true)
          }
        }
    }
    const handlePriority = (e) => {
        if(e.target.value){
            setIsPriority(false)
            setPriority(e.target.value)
            if(e.target.value === 14){ 
                setDueDate(moment(moment().add(45,'days')).format('YYYY-MM-DDTHH:mm:ssZ'));
            }else if(e.target.value === 12){ 
                setDueDate(moment(moment().add(15,'days')).format('YYYY-MM-DDTHH:mm:ssZ'));
            }else{ 
                setDueDate(moment(moment().add(30,'days')).format('YYYY-MM-DDTHH:mm:ssZ'));
            }
        }
    }
    const handleStatus = (e) => {
        if(e.target.value){
            setIsStatus(false)
            setStatus(e.target.value) 
        }
    }
    const handleDueDate = (val,from) => {
        setDueDate(moment(val).format('YYYY-MM-DDTHH:mm:ssZ'))
    }
    const handleObservedDate = (val,from) => {
        setObservedDate(moment(val).format('YYYY-MM-DDTHH:mm:ssZ'))
    } 
    const handleActionTakenDate = (val,from) => {
        setActionDate(moment(val).format('YYYY-MM-DDTHH:mm:ssZ'))
    }
    const handleFaultMode = (option) => {
        if(option.target.value){
            setIsFaultMode(false)
            setFaultModeID(option.target.value)
            setActionTakenID('') 
        }
    }
    const handleMainComponent = (option) => {
        if(option.target.value){
            setIsMainComponent(false)
            setMainComponentID(option.target.value)
            setSubComponentID('')
            getSubComponentList(option.target.value)
        }
    }
    const handleSubComponent = (option) => {
        if(option.target.value){
            setIsSubComponent(false)
            setSubComponentID(option.target.value)
            setFaultModeID('') 
            getActionTakenList(mainComponentID, option.target.value)
        }
    }
    const handleInstrumentStatusType = (option) => {
        if(option.target.value){
            setIsInstrumentStatus(false)
            setInstrumentStatusID(option.target.value) 
        }
    }
    
    const downloadImage = async (file_base64,file_name) => {
        if (file_name && file_base64 !== "File does not exist") {
            getDownloadFiles(file_name);
        }else{
            setOpenSnack(true)
            SetMessage(file_base64);
            SetType("warning")
        }
    }
    // NOSONAR
    const openFile = async (file_base64, file_name) => {
        if(file_base64 !== "File does not exist"){
            if (file_name && file_name !== undefined ) {
                if (file_name.split('.')[1] === "jpg" || file_name.split('.')[1] === "jpeg" || file_name.split('.')[1] === "png" || file_name.split('.')[1] === "pdf") {
                    if (file_base64 && file_base64 !== undefined) {
                        try {
                            if (file_name.split('.')[1] === "pdf") {
                                window.open("").document.write(`<iframe width="100%" height="100%" src="${file_base64}"></iframe>`);
                            }
                            else {
                                let image = document.createElement('img');
                                image.src = file_base64;
                                window.open("").document.write(image.outerHTML);
                            }
    
                        } catch (err) {
                            SetMessage(t('EnablePopupsInBrowserSettings'))
                            SetType("warning")
                            setOpenSnack(true);
                            return;
                        }
                    }
                }
                else {
                    getDownloadFiles(file_name);
                }
            }
        }else{
            setOpenSnack(true)
            SetMessage(file_base64);
            SetType("warning")
        }   
        
    }

    const updateImage = async (e) => {
        const currentFiles = Array.from(e.target.files);
        const totalSizeCurrent = currentFiles.reduce((acc, file) => acc + file.size, 0); 
        const totalSizeExisting = filesArr.reduce((acc, file) => acc + file.size, 0); 
        const totalSize = totalSizeCurrent + totalSizeExisting; 
        if (totalSize > maxTotalFileSize) {
            SetMessage(`You can upload files up to 1 MB in total size`);
            SetType("warning");
            setOpenSnack(true);
        } else {
            const results = await readAllFiles(currentFiles);
            const newFiles = Array.from(results);
            const updatedFiles = [...filesArr, ...newFiles];
            setFilesArr(updatedFiles);
        }

    }

    const removeFiles = (index, e) => {

        e.stopPropagation();
        const copyfileArr = [...filesArr];
        copyfileArr.splice(index, 1)
        setFilesArr(copyfileArr);


    }
    const removeExistingFiles = (index, val) => {

        const copyfileArr = [...filesArr];
        let existFileArr = [...deletedFiles];
        copyfileArr.splice(index, 1)
        setFilesArr(copyfileArr);
        existFileArr.push(val.image_path);
        setDeleteFiles(existFileArr);

    }
    const handleFileChosen = async (file) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = reject;

        });
    }
    const readAllFiles = async (AllFiles) => {
        return Promise.all(AllFiles.map(async (file) => {
            
            file.base64 = await handleFileChosen(file)
            return file

        }));
    }
    const handleActionRecommended = (e) => {
        setActionTakenID(e.target.value);
    }
    // NOSONAR
    const saveTask = () => {
        

        if (!titleRef.current.value) {
            setIsName(true)
            return false;
        } else {
            setIsName(false);
        }
        if (!priority) {
            setIsPriority(true);
            return false;
        } else {
            setIsPriority(false)
        }
        if (!assigneeID) {
            setIsAssignee(true)
            return false;
        } else {
            setIsAssignee(false);
        }
        
        if (!assetID) {
            setIsAsset(true)
            return false;
        } else {
            setIsAsset(false);
        }
        if (!instrumentID) {
            setIsInstrument(true)
            return false;
        }
        else {
            setIsInstrument(false)
        }
        if (!instrumentStatusID) {
            setIsInstrumentStatus(true)
            return false;
        }
        else {
            setIsInstrumentStatus(false)
        }
        if (!type) {
            setIsType(true);
            return false;
        } else {
            setIsType(false)
        }
        
        if (!status) {
            setIsStatus(true)
            return false;
        } else {
            setIsStatus(false)
        }
        if (!mainComponentID) {
            setIsMainComponent(true)
            return false;
        }
        else {
            setIsMainComponent(false)
        }
        if (!subComponentID) {
            setIsSubComponent(true)
            return false;
        }
        else {
            setIsSubComponent(false)
        }
        if (!faultModeID) {
            setIsFaultMode(true)
            return false;
        }
        else {
            setIsFaultMode(false)
        }
       

      
        if (filesArr.length > 0) {
            let sizeArray = [...filesArr]
            let filesize = sizeArray.map(e => e.size)
            const totalSize = filesize.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0)

            if (totalSize / (1024 * 1024) > 1) {
                // File size exceeds the maximum allowed size
                SetMessage(t(`Uploaded File  exceeds the maximum size of 1MB`));
                SetType("warning")
                setOpenSnack(true);
                // You may choose to reset the file input here if needed
                return false;
            }

        }
        setLoading(true);
       
        const formattedReportedDate = moment(new Date(reportedDate)).format('YYYY-MM-DD');

        const duplicateCheck = props.taskListData.some(item => {
          const formattedItemReportedDate = moment(new Date(item.reported_date)).format('YYYY-MM-DD');
          return (
            item.entity_id === assetID &&
            item.instrument?.id === instrumentID &&
            item.mcc_id === mainComponentID &&
            item.scc_id === subComponentID &&
            item.faultModeByFaultMode?.id === faultModeID &&
            item.action_recommended === actionRecommendedRef.current.value &&
            item.userByObservedBy?.id === observedByID 
            &&
            formattedItemReportedDate === formattedReportedDate
          );
        });
        
             

        if(duplicateCheck){
            SetMessage("Task creation failed: A task with the same details already exists. Please review the existing task or modify the new one to avoid duplication.")
            SetType("warning")
            setOpenSnack(true);
            setLoading(false);
        }
       else{
        let datas={
            title:titleRef.current.value,
            description:descRef.current.value,
            entity:assetID,
            instrumentID:instrumentID,
            assignee:assigneeID,
            observedDate:observedDate,
            observedBy:observedByID,
            reportedBy:reportedByID,
            reportedDate: reportedDate,
            dueDate:dueDate,
            type:type,
            priority:priority,
            status:status,
            userid:currUser.id,
            mcc_id: mainComponentID,
            scc_id: subComponentID

        }
   
        getAddTask(datas, actionRecommendedRef.current.value, faultModeID, instrumentStatusID, actionTakenID ? actionTakenID : "601ea23d-e209-4a86-8f63-6b2937f05df5", actionTakenDate, commentsRef.current.value ? commentsRef.current.value : "")
       }
        
    
      
    }
    // NOSONAR
    const triggerAssigne = async (mailId, previousAssigneeMailID,isCreate,reporterEmail) => {
        let assigneMailID
        let removeduplicate = reporterEmail && reporterEmail.length && [...new Set(reporterEmail)]
        if (previousAssigneeMailID) {
            assigneMailID=[mailId,previousAssigneeMailID];
        } else {
            assigneMailID=[mailId];
        }
        setisAssigneChange(false)
        setIsTaskStatusChange(false)
        setassigneGmail("")
        setpreviousassigneGmail("")
        const url = '/mail/sentmail'
        let userName =  currUser ? currUser.name : "--" 
        let UserRefValue = createdByName ? createdByName : "--"
        let filteredTasksEmail = reporterEmail && reporterEmail.length > 0 ? removeduplicate : assigneMailID
        const mailJson = {
            task_create: isCreate ? "1" : "0",
            payload: {
                email: filteredTasksEmail.join(','),
                line_name: headPlant ? headPlant.name : "--",
                mail_date: moment().format("DD/MM/YYYY"),
                task_name: titleRef.current ? titleRef.current.value : "--",
                description: descRef.current ? descRef.current.value : "--",
                priority: priority ? PriorityListData.filter(e=>e.id ===priority)[0].task_level : "--",
                created_by: isCreate ? userName : UserRefValue,
                observed_by: observedByID ? UserOption.filter(f=> f.id === observedByID)[0].name : "--",
                reported_by: reportedByID ? UserOption.filter(f=> f.id === reportedByID)[0].name : "--", 
                due_date: moment(dueDate).format("DD/MM/YYYY"),
                completed_date: Number(status) === 3 ? moment().format("DD/MM/YYYY") : "--",
                header: "Task Overdue Reminder: Action Required!",
                description_text: "This is a reminder regarding the overdue deadline for your task"
            }
             
        };
        configParam.RUN_REST_API(url, mailJson,'','',"POST")
            .then((response) => {
                if (response) {
                   console.log("msg sent")
                }
            })
            .catch((e) => {
              console.log(e,'failed to send message')
            });
    }
   
    const uploadFiles = async (taskid) => {
        const formData = new FormData();
        // eslint-disable-next-line array-callback-return
        //No return statement neede since forEach doesn't create seperate array
        filesArr.forEach(file => {
            formData.append(`taskFiles[]`, file, file.name);
            
          });
        let obj = { id: taskid }
        formData.append('tasks', JSON.stringify(obj))
        const url = '/tasks/fileUpload';
            configParam.RUN_REST_API(url, formData,'','',"POST",true)
            .then(result => {
                if (result) {
                    props.changeSec('Overview');
                    SetMessage(t(`Task created succesfully`))
                    SetType("success")
                    setOpenSnack(true);
                    console.log("success");
                } else {
                    SetMessage(t(`Fail upload failed`))
                    SetType("warning")
                    setOpenSnack(true);
                }
            })
            .catch(error => console.log(error));
    }
    // NOSONAR
    const editTask = (closed) => {

        if (!titleRef.current.value) {
            setIsName(true)
            return false;
        } else {
            setIsName(false);
        }
       
        if (!assetID) {
            setIsAsset(true)
            return false;
        } else {
            setIsAsset(false);
        }
        if (!instrumentID) {
            setIsInstrument(true)
            return false;
        }
        else {
            setIsInstrument(false)
        }
        if (!instrumentStatusID) {
            setIsInstrumentStatus(true)
            return false;
        }
        else {
            setIsInstrumentStatus(false)
        }
        if (!type) {
            setIsType(true);
            return false;
        } else {
            setIsType(false)
        }
        if (!priority) {
            setIsPriority(true);
            return false;
        } else {
            setIsPriority(false)
        }
        if (!status) {
            setIsStatus(true)
            return false;
        } else {
            setIsStatus(false)
        }
        if (!assigneeID) {
            setIsAssignee(true)
            return false;
        } else {
            setIsAssignee(false);
        }
        if (!faultModeID) {
            setIsFaultMode(true)
            return false;
        }
        else {
            setIsFaultMode(false)
        }
       
        
        if (editAssigneCheck !== assigneeID) {
            setisAssigneChange(true)
        } 
        // eslint-disable-next-line eqeqeq
        if(editTaskStatusCheck != status){
            setIsTaskStatusChange(true)
        }
        if (filesArr.length > 0) {
            let sizeArray = [...filesArr]
            let filesize = sizeArray.map(e => e.size ? e.size : 0)
            const totalSize = filesize.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0)

            if (totalSize / (1024 * 1024) > 1) {
                // File size exceeds the maximum allowed size
                SetMessage(t(`Uploaded File  exceeds the maximum size of 1MB`));
                SetType("warning")
                setOpenSnack(true);
                // You may choose to reset the file input here if needed
                
                return false;
            }

        }
        
        setLoading(true);
        // NOSONAR
        if(status === 3 || status === 21){
            setOpenConfirmDialog(true)
        }else{
            FinalUpdate()
        }  
        props.filtertype("All")
    }

    function FinalUpdate(){
        let datas1;
        // NOSONAR
        if (status === 3){
        datas1={
            taskId:taskPrimaryID,
            title:titleRef.current.value,
            type:type,
            priority:priority,
            status: status,
            entity:assetID,
            assignee:assigneeID,
            description:descRef.current.value,
            dueDate:dueDate,
            userid:currUser.id,
            actionTaken:actionTakenID ? actionTakenID : "601ea23d-e209-4a86-8f63-6b2937f05df5",
            actionRecommended:actionRecommendedRef.current.value,
            faultModeID:faultModeID,
            instrumentStatusID:instrumentStatusID,
            mcc_id: mainComponentID,
            scc_id: subComponentID,
            reportedDate: reportedDate,
            task_closed_by: currUser.id
        } 
    } else {
          const existIdCheck=props.taskListData.filter(x=> x.id !==taskPrimaryID);
        const formattedReportedDate = moment(new Date(reportedDate)).format('YYYY-MM-DD');
        const existingRecord = existIdCheck.some(item => {
          const formattedItemReportedDate = moment(new Date(item.reported_date)).format('YYYY-MM-DD');
          return (
            item.entity_id === assetID &&
            item.instrument?.id === instrumentID &&
            item.mcc_id === mainComponentID &&
            item.scc_id === subComponentID &&
            item.faultModeByFaultMode?.id === faultModeID &&
            item.action_recommended === actionRecommendedRef.current.value &&
            item.userByObservedBy?.id === observedByID 
            &&
            formattedItemReportedDate === formattedReportedDate
          );
        });
    if(existingRecord){
        SetMessage("Task Already Exist")
        SetType("warning")
        setOpenSnack(true);
        setLoading(false);
    }
     else{
        datas1={
            taskId:taskPrimaryID,
            title:titleRef.current.value,
            type:type,
            priority:priority,
            status: status,
            entity:assetID,
            assignee:assigneeID,
            description:descRef.current.value,
            dueDate:dueDate,
            userid:currUser.id,
            actionTaken:actionTakenID ? actionTakenID : "601ea23d-e209-4a86-8f63-6b2937f05df5",
            actionRecommended:actionRecommendedRef.current.value,
            faultModeID:faultModeID,
            instrumentStatusID:instrumentStatusID,
            mcc_id: mainComponentID,
            scc_id: subComponentID,
            reportedDate: reportedDate
        } 
     }
       
    }
       getEditTask(datas1,commentsRef.current.value, actionTakenDate, observedDate, observedByID,reportedByID, instrumentID)
            setOpenConfirmDialog(false)

    }
    const updatingFiles = async () => {
        const pureFiles = filesArr.filter(file => !file.hasOwnProperty('image_path'));
        if (pureFiles.length > 0 || deletedFiles.length > 0) {
            const formData = new FormData();
            if (pureFiles.length > 0) {
                // eslint-disable-next-line array-callback-return
                //Because of forEach , no need of return statement
                pureFiles.forEach(file => {
                    formData.append(`taskFiles[]`, file, file.name);
                   
                  });
                  
            }
            let obj = { id: taskPrimaryID };
            if (deletedFiles.length > 0) {
                obj['deletedFiles'] = deletedFiles;
            }
            formData.append('tasks', JSON.stringify(obj))
            const url = '/tasks/editUpload';
            
                configParam.RUN_REST_API(url, formData,'','',"POST",true)
                .then(result => {
                    if (result) {
                        console.log("success");
                        props.changeSec('Overview');
                        SetMessage(t(`Task edited succesfully`))
                        SetType("success")
                        setOpenSnack(true);
                    }
                })
                .catch(error => console.log(error));
        } else {
            props.changeSec('Overview');
            SetMessage(t(`Task edited succesfully`))
            SetType("success")
            setOpenSnack(true);
        }

    }
    // NOSONAR
    const renderCardImage =(valut)=>{
        if(valut.name){
            if(valut.name.split('.')[1] === 'pdf'){
                return(
                    <PDF style={{ verticalAlign: "middle" }}></PDF>
                )
            }else if((valut.name.split('.')[1] === 'png' || valut.name.split('.')[1] === 'jpeg' || valut.name.split('.')[1] === 'jpg')){
                return(
                    <Image style={{ verticalAlign: "middle" }}></Image>
                )

            }else if((valut.name.split('.')[1] === 'xls' || valut.name.split('.')[1] === 'xlsx' || valut.name.split('.')[1] === 'csv')){
                return(
                    <Excel style={{ verticalAlign: "middle" }}></Excel> 
                )
            }else if(valut.name.split('.')[1] === 'docx'){
                return(
                    <Document style={{ verticalAlign: "middle" }}></Document>
                    )
            }else{
                return(
                    <FileIcon stroke={'#0084FF'} />
                )
            }
        }else{
            if(valut && valut.image_path && valut.image_path.split('.')[1] === 'pdf'){
                return(
                    <PDF style={{ verticalAlign: "middle" }}></PDF>
                )

            }else if(valut && valut.image_path && (valut.image_path.split('.')[1] === 'png' || valut.image_path.split('.')[1] === 'jpeg' || valut.image_path.split('.')[1] === 'jpg')){
                return (
                    <Image style={{ verticalAlign: "middle" }}></Image>
                )
            }else if(valut && valut.image_path && (valut.image_path.split('.')[1] === 'xls' || valut.image_path.split('.')[1] === 'xlsx' || valut.image_path.split('.')[1] === 'csv')){
                return(
                    <Excel style={{ verticalAlign: "middle" }}></Excel> 
                    
                    )
            }else if(valut && valut.image_path && valut.image_path.split('.')[1] === 'docx'){
                return(
                    <Document style={{ verticalAlign: "middle" }}></Document>
                    )
            }else{
                return(
                    <FileIcon stroke={'#0084FF'} />
                    )
            }
        }
    }
    const trigertitleErrorMsg = ()=>{
      
            if(isName && titleRef.current.value === '' ){
                setIsName(true)
            }else{
                setIsName(false)
            }
       
    }
   
    const trigeractionRecommendedErrMsg =()=>{
        if(isActionTaken && descRef.current.value === ''){
            setIsActionTaken(true);
        }else{
            setIsActionTaken(false);
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
            props.changeSec('Overview','Cancel')
            localStorage.setItem("createTaskFromAlarm",'')
        }
     }

     const handleCloseDialog=()=> {
        setOpenConfirmDialog(false); 
    } 

    const ActionTakenBy =()=>{
        if(isTaskCompleted && taskCompletedBy && UserOption.length> 0){
            return UserOption.filter(f=> f.id === taskCompletedBy).length > 0 && UserOption.filter(f=> f.id === taskCompletedBy)[0].name
        } else if (isTaskCompleted && !taskCompletedBy){
            return "-"
        } else {
           return UserOption.filter(f=> f.id === currUser.id).length > 0 && UserOption.filter(f=> f.id === currUser.id)[0].name
        }
    }

    // console.log(IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false,'hhhhhh')
    return ( 
            <div>
                 <div className='py-2 px-4 h-[48px] flex justify-between bg-Background-bg-primary dark:bg-Background-bg-primary-dark' >
                                <Breadcrumbs breadcrump={listArr} onActive={handleActiveIndex} />
                                <div className='flex gap-2'>
                                    {IsEditable && (props.section === "edit" && !isTaskCompleted) ?
                                    <Button type="ghost" onClick={() => setIsEditable(false)}
                                    // icon={EditIcon}
                                    value={t('Edit')}/>
                                    :
                                    <React.Fragment>
                                    <Button  id='reason-update' type="secondary" value={t('Cancel')} onClick={() => {props.changeSec('Overview','Cancel');localStorage.setItem("createTaskFromAlarm",'')}}></Button>
                                    <Button id='reason-update' type="primary" loading={loading} style={{  display: props.section === "edit" && isTaskCompleted ? "none" : "block" }} value={props.section === "create" ? t('Save') : t('Update')} onClick={() => props.section === 'create' ? saveTask() : editTask()}></Button>
                                    </React.Fragment>
                                    }
                                     
                                    
                                </div>
 
                        </div>
                        <HorizontalLine variant="divider1" />

            <Grid container className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ' >
                <Grid sm={12} > 
                       
                        <Grid container >
                            <Grid sm={props.section === 'edit' ? 8 : 12} disabled={props.section === "edit" && isTaskCompleted ? true : false} style={{borderRight: props.section === 'edit' ? (curTheme === 'light' ? '1px solid #e8e8e8' : '1px solid #2a2a2a')  : '0px solid'}}>
                                <div style={{padding:'16px'}}>
                                    <ParagraphText value={t('Basic Info')} variant={"heading-02-xs"}></ParagraphText>
                                    <div className='mb-4' />
                                    <Grid container spacing={4}>
                                        <Grid item lg={12} sm={12}> 
                                                <InputFieldNDL
                                                    id="ins-freq-val"
                                                    label={t("taskName")} 
                                                    inputRef={titleRef}
                                                    required={true}
                                                    placeholder={t('typeTitle')}
                                                    onChange={trigertitleErrorMsg}
                                                    disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false}
                                                    error={isName}
                                                    helperText={isName ? t('Please enter task name') : undefined}
                                                /> 
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <div className={"flex items-end"}>
                                                <SelectBox
                                                    id='select-sort-priority'
                                                    value={priority}
                                                    label={t('priority')}
                                                    onChange={(e) => handlePriority(e)}
                                                    auto={false}
                                                    options={!PriorityListLoading && !PriorityListError && PriorityListData && PriorityListData.length > 0 ? PriorityListData : []}
                                                    isMArray={true}
                                                    keyId={"id"}
                                                    keyValue={"task_level"}
                                                    error={isPriority}
                                                    msg={isPriority ? t('Please select priority') : undefined}
                                                    disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                                ></SelectBox>
                                            </div>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-assigne'
                                                value={assigneeID}
                                                onChange={(e, option) => handleAssignee(e, option)}
                                                auto={true}
                                                options={UserOption}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                label={t('Assignee')}
                                                error={isAssignee}
                                                msg={isAssignee ? t('Please select assignee') : undefined}
                                                disabled={IsEditable || (props.section === "edit" && isTaskCompleted)}
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <div style={classes.root}>
                                                <ParagraphText value={t('DueDate')} variant={"paragraph-xs"}></ParagraphText>

                                                <DatePickerNDL
                                                    id="Date-picker"
                                                    onChange={(e) => {
                                                        handleDueDate(e, "from");
                                                    }}
                                                    startDate={new Date(dueDate)}
                                                    dateFormat="dd-MM-yyyy"
                                                    customRange={false}
                                                    disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 

                                                />
                                            </div>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-asset'
                                                value={assetID}
                                                onChange={(e) => handleAsset(e)}
                                                auto={true}
                                                options={!EntityListLoading && !EntityListError && EntityListData && EntityListData.length > 0 ? EntityListData : []}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                label={t('Asset')}
                                                error={isAsset}
                                                msg={isAsset ? t('PlsSelectAsset') : undefined}
                                                dynamic={EntityInstrumentsListData}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) } 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-Intrument'
                                                value={instrumentID}
                                                label={t('Instruments')}
                                                onChange={(e) => handleInstruments(e)}
                                                auto={true}
                                                options={entityInstrumentArr && entityInstrumentArr.length > 0 ? entityInstrumentArr : []}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                error={isInstrument}
                                                msg={isInstrument ? t('Please Select Instrument') : undefined}
                                                dynamic={assetID}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                           <InputFieldNDL
                                                    id="ins-freq-val"
                                                    label={t("Instrument Type")} 
                                                    required={true}
                                                    value={instype}
                                                    placeholder={t('Instrument Type')}
                                                    disabled={true}
                                                /> 
                                        </Grid>
                                    </Grid>
                                    <div className='mb-4' />

                                    <HorizontalLine variant="divider1" />
                                    <div className='mb-4' />

                                    <ParagraphText value={t('Lables')} variant={"heading-02-xs"}></ParagraphText>
                                    <div className='mb-4' />
                                    <Grid container spacing={4}>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <div className={"flex items-end"}>
                                                <SelectBox
                                                    id='select-sort-task_type'
                                                    value={type}
                                                    label={t("type")}
                                                    onChange={(e) => handleType(e)}
                                                    auto={false}
                                                    options={!TypeListLoading && !TypeListError && TypeListData && TypeListData.length > 0 ? TypeListData : []}
                                                    isMArray={true}
                                                    keyId={"id"}
                                                    keyValue={"task_type"}
                                                    error={isType}
                                                    msg={isType ? t('Please select type') : undefined}
                                                    disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                                ></SelectBox>
                                            </div>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-Intrument'
                                                value={instrumentStatusID}
                                                label={t('InstrumentStatus')}
                                                onChange={(e) => handleInstrumentStatusType(e)}
                                                auto={false}
                                                options={!InstrumentStatusLoading && !InstrumentStatusError && InstrumentStatusData && InstrumentStatusData.length > 0 ? InstrumentStatusData : []}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"status_type"}
                                                error={isInstrumentStatus}
                                                msg={isInstrumentStatus ? t('Please Select Instrument Status') : undefined}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <div className={"flex items-end"}>
                                                <SelectBox
                                                    id='select-sort-status'
                                                    value={status}
                                                    label={t("TaskStatus")}
                                                    //inputRef={category}
                                                    onChange={(e) => handleStatus(e)}
                                                    auto={false}
                                                    options={!StatusListLoading && !StatusListError && StatusListData && StatusListData.length > 0 ? StatusListData : []}
                                                    isMArray={true}
                                                    keyId={"id"}
                                                    keyValue={"status"}
                                                    error={isStatus}
                                                    msg={isStatus ? t('Please select task status') : undefined}
                                                    disabled={IsEditable || (props.section === "edit" && isTaskCompleted)}
                                                ></SelectBox>
                                            </div>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                                <SelectBox
                                                id='select-sort-Main'
                                                value={mainComponentID}
                                                label={t('Main Component')}
                                                onChange={(e, option) => handleMainComponent(e)}
                                                auto={true}
                                                options={!MainComponentListLoading && !MainComponentListError && MainComponentListData && MainComponentListData.length > 0 ? MainComponentListData : []}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"description"}
                                                error={isMainComponent}
                                                msg={isMainComponent ? t('Please Select Main Component') : undefined}
                                                dynamic={SubComponentListData}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                                <SelectBox
                                                id='select-sort-Sub'
                                                value={subComponentID}
                                                label={t('Sub Component')}
                                                onChange={(e, option) => handleSubComponent(e)}
                                                auto={true}
                                                options={subComponentListOptions && subComponentListOptions.length > 0 ? subComponentListOptions : []}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"description"}
                                                error={isSubComponent}
                                                msg={isSubComponent ? t('Please Select Sub Component') : undefined}
                                                dynamic={mainComponentID}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-Fault'
                                                value={faultModeID}
                                                label={t('FaultMode')}
                                                onChange={(e, option) => handleFaultMode(e)}
                                                auto={true}
                                                options={faultOption}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                error={isFaultMode}
                                                msg={isFaultMode ? t('Please Select Fault Mode') : undefined}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        
                                        
                                    </Grid>
                                    <div className='mb-4' />

                                    <HorizontalLine variant="divider1" />
                                    <div className='mb-4' />
                                    <ParagraphText value={t('Observations')} variant={"heading-02-xs"}></ParagraphText>
                                    <div className='mb-4' />
                                    <Grid container spacing={4}>
                                        <Grid item lg={6} sm={6}>
                                            <InputFieldNDL
                                                id="ins-freq-val"
                                                label={t('observationDescription')}
                                                onBlur={{}}
                                                inputRef={descRef}
                                                //required={true}
                                                multiline={true}
                                                maxRows={2}
                                                onChange={{}}
                                                placeholder={t('typeDescription')}
                                                error={isDescription}
                                                helperText={isDescription ? t('observationDescription') : undefined}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            />
                                        </Grid>
                                        <Grid item lg={6} sm={6}
                                            style={{ paddingRight: '5px' }}>
                                            <InputFieldNDL
                                                id="ins-freq-val"
                                                label={t("ActionRecommended")} 
                                                inputRef={actionRecommendedRef}
                                                //required={true}
                                                multiline={true}
                                                onChange={trigeractionRecommendedErrMsg}
                                                maxRows={2}
                                                placeholder={t('typeTitle')}
                                                error={isActionTaken}
                                                helperText={isActionTaken ? t('TypeActiontaken') : undefined}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted)}
                                            />
                                        </Grid>
                                        {isShowDatacollectedDetails &&
                                        <>
                                        <Grid item lg={6} sm={6}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-Observe'
                                                value={observedByID}
                                                label={t("Data collected by")}
                                                onChange={(e, option) => handleObservedUser(e, option)}
                                                auto={true}
                                                options={UserOption}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={6} sm={6}
                                            style={{ paddingRight: '5px' }}>
                                            <div style={classes.root}>
                                                <ParagraphText value={t('Data collection date')} variant={"paragraph-xs"}></ParagraphText>
                                                <DatePickerNDL
                                                    id="Date-picker"
                                                    onChange={(e) => {
                                                        handleObservedDate(e, "from");
                                                    }}
                                                    startDate={new Date(observedDate)}
                                                    dateFormat="dd-MM-yyyy"
                                                    customRange={false}
                                                    disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 

                                                />

                                            </div>
                                        </Grid>
                                        </>
                                        }
                                        <Grid item lg={6} sm={6}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-reported'
                                                value={reportedByID}
                                                label={t('ReportedBy')}
                                                onChange={(e, option) => handleReportedUser(e, option)}
                                                auto={true}
                                                options={UserOption}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={6} sm={6}>
                                            <div style={classes.root}>
                                                <ParagraphText value={t('Reported Date')} variant={"paragraph-xs"}></ParagraphText>
                                                <DatePickerNDL
                                                    id="Date-picker"
                                                    onChange={(e) => {
                                                        setreportedDate(moment(e).format('YYYY-MM-DDTHH:mm:ssZ'))
                                                    }}
                                                    startDate={new Date(reportedDate)}
                                                    dateFormat="dd-MM-yyyy"
                                                    customRange={false}
                                                    disabled={IsEditable || (createdByName && (createdByName !== currUser.name)) || (props.section === "edit" && isTaskCompleted) ? true : false} 

                                                />

                                            </div>
                                        </Grid>

                                    </Grid>
                                    <div className='mb-4' />

                                    <HorizontalLine variant="divider1" />
                                    <div className='mb-4' />

                                    <ParagraphText value={t('Actions')} variant={"heading-02-xs"}></ParagraphText>
                                    <div className='mb-4' />
                                    <Grid container spacing={4}>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <SelectBox
                                                id='select-sort-actionTakenID'
                                                value={actionTakenID}
                                                label={t("ActionTaken")}
                                                onChange={(e, option) => handleActionRecommended(e)}
                                                auto
                                                options={taskActions && taskActions.length > 0 ? taskActions.filter(f=> f.fm_id === faultModeID) : []}
                                                isMArray={true}
                                                keyId={"id"}
                                                keyValue={"name"}
                                                disabled={IsEditable || (props.section === "edit" && isTaskCompleted) ? true : false} 
                                            ></SelectBox>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                            style={{ paddingRight: '5px' }}>
                                            <div style={classes.root}>
                                                <ParagraphText value={t("ActionTakenDate")} variant={"paragraph-xs"}></ParagraphText>

                                                <DatePickerNDL
                                                    id="Date-picker"
                                                    onChange={(e) => {
                                                        handleActionTakenDate(e, "from");
                                                    }}
                                                    startDate={new Date(actionTakenDate)}
                                                    dateFormat="dd-MM-yyyy"
                                                    customRange={false}
                                                    disabled={IsEditable || (props.section === "edit" && isTaskCompleted)} 
                                                    minDate={new Date(reportedDate)}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item lg={4} sm={4}
                                        style={{ paddingRight: '5px' }}>
                                            <InputFieldNDL
                                                    id="ins-freq-val"
                                                    label={t("Action Taken By")}
                                                    value={ActionTakenBy()} 
                                                    required={true}
                                                    placeholder={t('Action Taken By')}
                                                    disabled={true}
                                                    error={isName}
                                                /> 
                                        </Grid>
                                        <Grid item lg={12} sm={12}>
                                            <InputFieldNDL
                                                id="ins-freq-val"
                                                label={t("Comments")}
                                                onBlur={{}}
                                                inputRef={commentsRef}
                                                //required={true}
                                                multiline={true}
                                                maxRows={2}
                                                placeholder={t('typeTitle')}
                                                error={false}
                                                helperText={''}
                                                disabled={IsEditable || (props.section === "edit" && isTaskCompleted)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} >
                                            <div style={classes.imageField}    >
                                                <div className='flex items-center cursor-pointer' >
                                                <Grid container spacing={4}>
                                                    {ViewFilesLoading ? (
                                                        <LoadingScreenNDL style={{ width: "100%" }} />
                                                    ) : (
                                                        filesArr.length > 0 &&
                                                        !attachmentloading &&
                                                        filesArr.map((val, index) => {
                                                        let textName = val.name ? val.name : "";

                                                        return (
                                                            <Grid key={index + 1} item lg={4} sm={4}>
                                                            <KpiCards style={{ minHeight: "80px", cursor: "pointer" }}>
                                                                <div style={{ minHeight: "80px", display: "flex", alignItems: "center" }}>
                                                                <div style={{ width: "80%", display: "flex", alignItems: "center" }}>
                                                                    {renderCardImage(val)}
                                                                    <ToolTip title={val.image_path ? val.image_path : val.name} placement="bottom" arrow>
                                                                    <ParagraphText
                                                                        onClick={() => openFile(val.base64, val.image_path)}
                                                                        style={{
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        cursor: "pointer",
                                                                        textAlign: "left",
                                                                        marginLeft: "5px",
                                                                        width: "225px"
                                                                        }}
                                                                        value={val.image_path ? val.image_path : textName}
                                                                        variant={"Caption1"}
                                                                    />
                                                                    </ToolTip>
                                                                </div>

                                                                <div
                                                                    style={{
                                                                    display: "flex",
                                                                    marginLeft: "auto",
                                                                    marginRight: "5px",
                                                                    alignItems: "center",
                                                                    width: "20%",
                                                                    justifyContent: "flex-end"
                                                                    }}
                                                                >
                                                                    {val.image_path && (
                                                                    <Download
                                                                        style={{ cursor: "pointer" }}
                                                                        stroke={"#0084FF"}
                                                                        onClick={() => downloadImage(val.base64, val.image_path)}
                                                                    />
                                                                    )}
                                                                    {!IsEditable && (
                                                                    <Delete
                                                                        style={{ cursor: "pointer" }}
                                                                        stroke={"#FF0D00"}
                                                                        onClick={(e) =>
                                                                        val.type ? removeFiles(index, e) : removeExistingFiles(index, val)
                                                                        }
                                                                    />
                                                                    )}
                                                                </div>
                                                                </div>
                                                            </KpiCards>
                                                            </Grid>
                                                        );
                                                        })
                                                    )}
                                                    </Grid>
                                                </div>
                                                <br></br>
                                                <label for="file-input" className="cursor-pointer" >
                                                    <div className='mb-3'>
                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.5 17V19C4.5 19.5304 4.71071 20.0391 5.08579 20.4142C5.46086 20.7893 5.96957 21 6.5 21H18.5C19.0304 21 19.5391 20.7893 19.9142 20.4142C20.2893 20.0391 20.5 19.5304 20.5 19V17M7.5 9L12.5 4M12.5 4L17.5 9M12.5 4V16" stroke="#646464" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    </div>

                                              
                                                <div className='flex flex-col gap-0.5'>
                                                                                <ParagraphText  value={'Drag and drop your files here or Browse'} variant={"label-01-s"}></ParagraphText>
                                                                                <ParagraphText  value={'System Supports SVG, PNG, PDF, JPG files only.'} color="tertiary" variant={"paragraph-xs"}></ParagraphText>
                                                                                <ParagraphText  value={'Max Size of each file is 1MB.'} color="tertiary" variant={"paragraph-xs"}></ParagraphText>
                                                                                </div>
                                                                                </label>

                                                <input id="file-input" className="task-upload" type="file"  disabled={IsEditable || (props.section === "edit" && isTaskCompleted)}  multiple accept="image/x-png,image/gif,image/jpeg,.pdf" ref={dropzoneRef} onChange={(e) => updateImage(e)} style={{ backgroundColor: 'transparent', color: '#fcfcfc', position: 'relative', width: '100%', height: '10px', left: '0', opacity: 0 }} />
                                            </div>
                                        </Grid>
                                    </Grid> 
                                </div>
                            </Grid>
                            {
                            props.section === 'edit' &&
                            <Grid sm={4} style={{padding:"16px"}}>
                                <ParagraphText value={t('Timeline')} variant={"heading-02-xs"}></ParagraphText>
                                <ParagraphText value={t('History of your tasks activities')} color='tertiary'  variant={"paragraph-xs"} ></ParagraphText>
                                <TaskHistory ref={historyRef} />
                            </Grid>
                            }
                        </Grid>
                </Grid>
                
                
            </Grid> 
            <ModalNDL onClose={handleCloseDialog}  open={OpenConfirmDialog}>
                <ModalContentNDL>
                <ParagraphText  variant='paragraph-s' color='secondary'>
                    “Do you really want to update the status of this task? This action confirms that you are aware of this status, This action cannot be undone.” 
                </ParagraphText>
                
                </ModalContentNDL>
                <ModalFooterNDL>
                <Button   value={t('Cancel')} type={'secondary'} onClick={()=>{setOpenConfirmDialog(false);setLoading(false);}}/>
                <Button   value={props.section === "create" ? t('Save') : t('Update')} onClick={()=>FinalUpdate()}/>

                </ModalFooterNDL>
            </ModalNDL>
         </div>
    )
})
export default TaskForm;