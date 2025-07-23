import React, { useRef, useState, useEffect, createRef, useImperativeHandle, forwardRef } from 'react';
import {useNavigate} from "react-router-dom"
import moment from 'moment';
import useTheme from 'TailwindTheme';
import Button from 'components/Core/ButtonNDL';
import { useTranslation } from 'react-i18next';
import configParam from 'config';
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import FileIcon from 'assets/neo_icons/Menu/File_icon.svg?react';
import Plus from 'assets/neo_icons/Menu/plus_icon.svg?react';
import { useRecoilState } from 'recoil';
import { selectedPlant, snackToggle, snackMessage, snackType, userData,themeMode } from 'recoilStore/atoms';
import useEntityList from '../hooks/useEntityList';
import useTaskTypeList from '../hooks/useTaskTypeList';
import useTaskPriority from '../hooks/useTaskPriority';
import useTaskStatus from '../hooks/useTaskStatus';
import useDownloadFiles from '../hooks/useDownloadFiles';
import useActionTakenList from '../hooks/useActionTaken';
import useAddTask from '../hooks/useAddTask';
import useEditTask from '../hooks/useEditTask';
import useViewFiles from '../hooks/useViewFiles';
import CreateType from './CreateType';
import CreatePriority from './CreatePriority';
import CreateStatus from './CreateStatus';
import useGetEntityInstrumentsList from '../hooks/useGetEntityInstrumentsList.jsx'
import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import Image from "components/Core/Image/ImageNDL";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useFaultModeList from '../hooks/useFaultModeList';
import useInstrumentStatusList from '../hooks/useInstrumentStatusList';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import Delete from 'assets/neo_icons/Notification/Delete.svg?react';
import Document from 'assets/neo_icons/Explore/doc.svg?react';
import PDF from 'assets/neo_icons/Explore/pdf.svg?react';
import Excel from 'assets/neo_icons/Explore/xls.svg?react';
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import Grid from 'components/Core/GridNDL'
// NOSONAR
const TaskForm = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const [headPlant] = useRecoilState(selectedPlant);
    const [curTheme]=useRecoilState(themeMode)
    const [taskPrimaryID, setTaskPrimaryID] = useState('') 
    const [assetID, setAssetID] = useState('');
    const [instrumentID, setInstrumentID] = useState(''); 
    const [assigneeID, setAssigneeID] = useState(''); 
    const [observedByID, setObservedByID] = useState(null); 
    const [reportedByID, setReportedByID] = useState(null);
    const [isInstrument, setIsInstrument] = useState(false);
    const [observedDate, setObservedDate] = useState(new Date());
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [createdDate, setCreatedDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [filesArr, setFilesArr] = useState([]);
    const [entityInstrumentArr, setEntityInstrumentArr] = useState([]);
    const [attachmentloading, setAttachmentLoading] = useState(false)
    const [actionTakenDate, setActionDate] = useState(new Date());
    const [deletedFiles, setDeleteFiles] = useState([]);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [taskActions, setTaskActions] = useState(null);
    const [actionTakenID, setActionTakenID] = useState('');
    const [faultModeID, setFaultModeID] = useState('');
    const [isFaultMode, setIsFaultMode] = useState(false);
    const [instrumentStatusID, setInstrumentStatusID] = useState('');
    const [isInstrumentStatus, setIsInstrumentStatus] = useState(false);
    const [isName, setIsName] = useState(false);
    const [isDescription, setIsDescription] = useState(false);
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
    const [observerName,setobserverName] = useState('')
    const [reporterName,setreporterName] = useState('')
    const [isTaskCompleted,setisTaskCompleted] = useState(false)
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
    const { FaultModeListLoading, FaultModeListData, FaultModeListError, getFaultModeList } = useFaultModeList();
    const { InstrumentStatusLoading, InstrumentStatusData, InstrumentStatusError, getInstrumentStatusList } = useInstrumentStatusList();
    const titleRef = useRef();
    const descRef = useRef();
    const taskIDRef = useRef();
    const createdByRef = useRef();
    const commentsRef = useRef();
    const actionRecommendedRef = useRef();
    const fileLength = 5;
    const dropzoneRef = createRef();
    const typeCreationRef = useRef();
    const priorityCreationRef = useRef();
    const statusCreationRef = useRef();
    const { t } = useTranslation();
    const theme= useTheme()
    const borderStyle = curTheme === 'dark' ? '2px dashed white' : '2px dashed rgba(0, 0, 0, 0.12)';
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
            borderRadius: '4px',
            
            textAlign: 'center',
            padding: '10px'
        }
    }
    useImperativeHandle(ref, () => ({
        bindValue: (value) => bindValue(value),
        createTask: (e) => {
            titleRef.current.value = e.title;
            descRef.current.value = e.desc;
            setObservedDate(moment(e.date).format('YYYY-MM-DDTHH:mm:ssZ'));
            setActionDate(moment(e.date).format('YYYY-MM-DDTHH:mm:ssZ'))
            setDueDate(moment(e.date).format('YYYY-MM-DDTHH:mm:ssZ'))
            if (e.additional) {
                setAssetID(e.additional.entity_id) 
            }
            localStorage.setItem("createTaskFromAlarm", "")
        }
    }))
    useEffect(() => {
        getEntityList(headPlant.id)
        getEntityInstrumentsList(headPlant.id);
        getFaultModeList();
        getInstrumentStatusList();
        getTypeList();
        getPriorityList();
        getStatusList();
        getUsersListForLine(headPlant.id);
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
        if (!ActionTakenListLoading && !ActionTakenListError && ActionTakenListData && ActionTakenListData.length > 0) {
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
                props.changeSec('table');
                SetMessage(t(`Task created succesfully`))
                SetType("success")
                setOpenSnack(true);
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

                props.changeSec('table');
                SetMessage(t(`Task edited succesfully`))
                SetType("success")
                setOpenSnack(true);
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
    // NOSONAR
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
                let obsName = UserOption.filter(e=>value.userByObservedBy.id === e.id)[0].name
                setobserverName(obsName)
        
            }
            setType(value.type);
            if (value.userByReportedBy && value.userByReportedBy.id) {
                let obsName = UserOption.filter(e=>value.userByReportedBy.id === e.id)[0].name
                setreporterName(obsName)
                setReportedByID(value.userByReportedBy.id);
            }
            setObservedDate(value.observed_date);
            if (value.priority) {
                setPriority(value.priority)
            }
            if (value.status) {
                setStatus(value.status);
                setEditTaskStatusCheck(value.status)
                if(value.status === 3){
                    setisTaskCompleted(true)
                }
            }
            taskIDRef.current.value = value.task_id;
            createdByRef.current.value = value.userByCreatedBy.name;
            setCreatedDate(value.created_ts);
            actionRecommendedRef.current.value = value.action_recommended;
            if (value.action_recommended) {
                let terms = value.action_recommended.trim().split(/\s+/)
                let hashcode = terms.filter((val) => val.includes("#"))[0]
                if (hashcode && hashcode.length > 0) {

                    hashcode = hashcode.slice(1, hashcode.length)
                    let codes = hashcode.split("_").map(function (x) { return x.toUpperCase(); })
                    getActionTakenList(codes[0], codes[1], codes[2])
                }
            }
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
        let repoName = option.filter(a=> a.id === e.target.value )[0].name
        setreporterName(repoName)
    }
    const handleObservedUser = (e, option) => {
        setObservedByID(e.target.value)
        let obsName = option.filter(a=>a.id === e.target.value )[0].name
        setobserverName(obsName)

    }
    const handleType = (e) => {
        if(e.target.value){
          setIsType(false)
          setType(e.target.value)
        }
    }
    const handlePriority = (e) => {
        if(e.target.value){
            setIsPriority(false)
            setPriority(e.target.value)
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
        }
    }
    const handleInstrumentStatusType = (option) => {
        if(option.target.value){
            setIsInstrumentStatus(false)
            setInstrumentStatusID(option.target.value)

        }
    }
    const fetchactiontaken = (actionTaken) => {
        let terms = actionTaken.trim().split(/\s+/)
        let hashcode = terms.filter((val) => val.includes("#"))[0]
        if (hashcode && hashcode.length > 0) {

            hashcode = hashcode.slice(1, hashcode.length)
            let codes = hashcode.split("_").map(function (x) { return x.toUpperCase(); })
            getActionTakenList(codes[0], codes[1], codes[2])
        }
        else {

            setTaskActions([{ "id": "8c47d281-cfdc-4672-8189-292084fe15dc", "name": "Others" }])
        }
    }
    const downloadImage = async (file_name) => {
        if (file_name) {
            getDownloadFiles(file_name);
        }
    }

    const openFile = async (file_base64, file_name) => {
        if (file_name && file_name !== undefined) {
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
    }

    
    const updateImage = async (e) => {
        const currentLength = e.target.files.length;
        const existLength = filesArr.length;
        const totalLen = currentLength + existLength;
      
        if (totalLen > fileLength) {
            SetMessage(`${t("You can upload only")} ${fileLength} ${t("files")}`)
            SetType("warning")
            setOpenSnack(true);
        }
        else {
            setAttachmentLoading(true)
            const results = await readAllFiles(Array.from(e.target.files))
            const filetoArr = Array.from(results);
            const existArr = [...filesArr, ...filetoArr];
            setFilesArr(existArr);
            setAttachmentLoading(false)
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
        if (!descRef.current.value) {
            setIsDescription(true);
            return false;
        } else {
            setIsDescription(false)
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
        if (!actionRecommendedRef.current.value) {
            setIsActionTaken(true)
            return false;
        } else {
            setIsActionTaken(false);
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
       
        let datas={
            title:titleRef.current.value,
            description:descRef.current.value,
            entity:assetID,
            instrumentID:instrumentID,
            assignee:assigneeID,
            observedDate:observedDate,
            observedBy:observedByID,
            reportedBy:reportedByID,
            dueDate:dueDate,
            type:type,
            priority:priority,
            status:status,
            userid:currUser.id
        }
        getAddTask(datas, actionRecommendedRef.current.value, faultModeID, instrumentStatusID, actionTakenID ? actionTakenID : "601ea23d-e209-4a86-8f63-6b2937f05df5", actionTakenDate, commentsRef.current.value ? commentsRef.current.value : "")
        const schema = headPlant.plant_name; 
        navigate(`/${schema}/Tasks`);
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
        const url ='/mail/sentmail'
        let userName =  currUser ? currUser.name : "--" 
        let UserRefValue =createdByRef.current ? createdByRef.current.value : "--"
     
        const mailJson = {
            task_create: isCreate ? "1" : "0",
            payload:{
            email: reporterEmail && reporterEmail.length > 0 ? removeduplicate.join(",") : assigneMailID.join(","),
            line_name: headPlant ? headPlant.name : "--",
            mail_date:  moment().format("DD/MM/YYYY"),
            task_name: titleRef.current ? titleRef.current.value : "--",
            description: descRef.current ? descRef.current.value : "--",
            priority:  priority ? PriorityListData.filter(e=>e.id ===priority)[0].task_level : "--",
            created_by: isCreate ? userName : UserRefValue,
            observed_by: observerName ? observerName : "--",
            reported_by: reporterName ? reporterName : "--", 
            due_date: moment(dueDate).format("DD/MM/YYYY"),
            // eslint-disable-next-line eqeqeq
            completed_date: Number(status) === 3 ? moment().format("DD/MM/YYYY") : "--"
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
                    props.changeSec('table');
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
        if (!descRef.current.value) {
            setIsDescription(true);
            return false;
        } else {
            setIsDescription(false)
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
        if (!actionRecommendedRef.current.value) {
            setIsActionTaken(true)
            return false;
        } else {
            setIsActionTaken(false);
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
                //   fileInput.value = '';
                return false;
            }

        }
        
        setLoading(true);
        //taskId, title, type, priority, status, entity, assignee,
       // description,dueDate,userid,
       // actionTaken, actionRecommended, faultModeID, instrumentStatusID
       let datas1={
        taskId:taskPrimaryID,
        title:titleRef.current.value,
        type:type,
        priority:priority,
        status: closed ? 3 : status,
        entity:assetID,
        assignee:assigneeID,
        description:descRef.current.value,
        dueDate:dueDate,
        userid:currUser.id,
        actionTaken:actionTakenID,
        actionRecommended:actionRecommendedRef.current.value,
        faultModeID:faultModeID,
        instrumentStatusID:instrumentStatusID,
       }
        getEditTask(datas1,
            commentsRef.current.value, actionTakenDate, observedDate, observedByID,
            reportedByID, instrumentID)
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
                        props.changeSec('table');
                        SetMessage(t(`Task edited succesfully`))
                        SetType("success")
                        setOpenSnack(true);
                    }
                })
                .catch(error => console.log(error));
        } else {
            props.changeSec('table');
            SetMessage(t(`Task edited succesfully`))
            SetType("success")
            setOpenSnack(true);
        }

    }
    const handleCreateType = () => {
        typeCreationRef.current.openDialog()
    }
    const handleCreatePriority = () => {
        priorityCreationRef.current.openDialog()
    }
    const handleCreateStatus = () => {
        statusCreationRef.current.openDialog()
    }

    // SOSONAR
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
    const trigerDescriptionErrorMsg = ()=>{
        if(isDescription && descRef.current.value === ''){
            setIsDescription(true)
        }else{
            setIsDescription(false)
        }
    }

    const trigeractionRecommendedErrMsg =()=>{
        if(isActionTaken && descRef.current.value === ''){
            setIsActionTaken(true);
        }else{
            setIsActionTaken(false);
        }
    }
    return (
        <React.Fragment>
            <div className='p-4'>
            <CreateType ref={typeCreationRef} refreshTypeList={getTypeList} />
            <CreatePriority ref={priorityCreationRef} refreshPriorityList={getPriorityList} />
            <CreateStatus ref={statusCreationRef} refreshStatusList={getStatusList} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <ParagraphText value={props.section === "create" ? t('newTask') : t('Edit Task')} variant={"heading-01-lg"}></ParagraphText>
                </div>
                <div style={{ display: 'flex' }}>
                    {props.section === "edit" && Number(status) !== 3 && <Button type={"ghost"} style={{ marginRight: 10 }} onClick={() => editTask(true)} value={t('Close')} />}
                    <Button style={{width:"100px",marginRight: 10}} id='reason-update' type="secondary" value={t('Cancel')} onClick={() => props.changeSec('table')}></Button>
                    <Button id='reason-update' type="primary" loading={loading} disabled={props.section === "edit" && isTaskCompleted ? true : false} style={{ width:"100px"}} value={props.section === "create" ? t('Save') : t('Update')} onClick={() => props.section === 'create' ? saveTask() : editTask()}></Button>
               
                </div>
            </div>
            <Grid container>
                <Grid item lg={12} sm={12}>
                    <InputFieldNDL
                        id="ins-freq-val"
                        label={t("taskName")}
                        onBlur={{}}
                        inputRef={titleRef}
                        required={true}
                        placeholder={t('typeTitle')}
                        onChange={trigertitleErrorMsg}
                        error={isName}
                        helperText={isName ? t('Please enter task name') : undefined}
                    />
                </Grid>
                <Grid item lg={12} sm={12}>
                    <InputFieldNDL
                        id="ins-freq-val"
                        label={t('observationDescription')}
                        onBlur={{}}
                        inputRef={descRef}
                        //required={true}
                        multiline={true}
                        maxRows={2}
                        onChange={trigerDescriptionErrorMsg}
                        placeholder={t('typeDescription')}
                        error={isDescription}
                        helperText={isDescription ? t('observationDescription') : undefined}
                    />
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
                    ></SelectBox>
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
                    ></SelectBox> 
                </Grid> 
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
                        ></SelectBox>
                        <Button id='reason-update' type={"ghost"} icon={AddLight} onClick={() => handleCreateType()}></Button>
                    </div>
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
                        ></SelectBox>
                        <Button id='reason-update' type={"ghost"} icon={AddLight} onClick={() => handleCreatePriority()}></Button>
                    </div>
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
                        ></SelectBox>
                        <Button id='reason-update' type={"ghost"} icon={AddLight} onClick={() => handleCreateStatus()}></Button>
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
                        label={t('Assigne')}
                        error={isAssignee}
                        msg={isAssignee ? t('Please select assignee') : undefined}
                    ></SelectBox>
                </Grid>
                <Grid item lg={4} sm={4}
                    style={{ paddingRight: '5px' }}>
                    <SelectBox
                        id='select-sort-Observe'
                        value={observedByID}
                        label={t("ObservedBy")}
                        onChange={(e, option) => handleObservedUser(e,option)}
                        auto={true}
                        options={UserOption}
                        isMArray={true}
                        keyId={"id"}
                        keyValue={"name"}
                    ></SelectBox>
                </Grid>
                <Grid item lg={4} sm={4}
                    style={{ paddingRight: '5px' }}>
                    <SelectBox
                        id='select-sort-reported'
                        value={reportedByID}
                        label={t('ReportedBy')}
                        onChange={(e, option) => handleReportedUser(e,option)}
                        auto={true}
                        options={UserOption}
                        isMArray={true}
                        keyId={"id"}
                        keyValue={"name"}
                    ></SelectBox>
                </Grid>
                <Grid item lg={4} sm={4}
                    style={{ paddingRight: '5px' }}>
                    <div style={classes.root}>
                        <ParagraphText value={t('DueDate')} variant={"Caption1"}></ParagraphText>

                        <DatePickerNDL
                            id="Date-picker"
                            onChange={(e) => {
                                handleDueDate(e, "from");
                            }}
                            startDate={new Date(dueDate)}
                            dateFormat="dd-MM-yyyy"
                            customRange={false}

                        />
                    </div>
                </Grid>
                <Grid item lg={4} sm={4}
                    style={{ paddingRight: '5px' }}>
                    <div style={classes.root}>
                        <ParagraphText value={t('Observed Date')} variant={"Caption1"}></ParagraphText>

                        <DatePickerNDL
                            id="Date-picker"
                            onChange={(e) => {
                                handleObservedDate(e, "from");
                            }}
                            startDate={new Date(observedDate)}
                            dateFormat="dd-MM-yyyy"
                            customRange={false}

                        />

                    </div>
                </Grid>
                <Grid item lg={4} sm={4}
                    style={{ paddingRight: '5px' }}>
                    <div style={classes.root}>
                        <ParagraphText value={t("ActionTakenDate")} variant={"Caption1"}></ParagraphText>

                        <DatePickerNDL
                            id="Date-picker"
                            onChange={(e) => {
                                handleActionTakenDate(e, "from");
                            }}
                            startDate={new Date(actionTakenDate)}
                            dateFormat="dd-MM-yyyy"
                            customRange={false}

                        />
                    </div>
                </Grid>
                <Grid item lg={4} sm={4} 
                    style={{ paddingRight: '5px' }}> 
                    <SelectBox 
                        id='select-sort-Fault' 
                        value={faultModeID} 
                        label={t('FaultMode')}
                        onChange={(e, option) => handleFaultMode(e)} 
                        auto={true} 
                        options={!FaultModeListLoading && !FaultModeListError && FaultModeListData && FaultModeListData.length > 0 ? FaultModeListData : []} 
                        isMArray={true} 
                        keyId={"id"} 
                        keyValue={"name"} 
                        error={isFaultMode} 
                        msg={isFaultMode ? t('Please Select Fault Mode') : undefined} 
                    ></SelectBox> 
                </Grid> 
                <Grid item lg={4} sm={4}
                    style={{ paddingRight: '5px' }}>
                    <SelectBox
                        id='select-sort-actionTakenID'
                        value={actionTakenID}
                        label={t("ActionTaken")}
                        onChange={(e, option) => handleActionRecommended(e)}
                        auto={false}
                        options={taskActions && taskActions.length > 0 ? taskActions : []}
                        isMArray={true}
                        keyId={"id"}
                        keyValue={"name"}
                    ></SelectBox>
                </Grid>
                <Grid item lg={6} sm={6}
                    style={{ paddingRight: '5px' }}>
                    <InputFieldNDL
                        id="ins-freq-val"
                        label={t("ActionRecommended")}
                        onBlur={(e) => fetchactiontaken(e.target.value)}
                        inputRef={actionRecommendedRef}
                        multiline={true}
                        onChange={trigeractionRecommendedErrMsg}
                        maxRows={2}
                        placeholder={t('typeTitle')}
                        error={isActionTaken}
                        helperText={isActionTaken ? t('TypeActiontaken') : undefined}
                    />
                </Grid>
                <Grid item lg={6} sm={6}>
                    <InputFieldNDL
                        id="ins-freq-val"
                        label={t("Comments")}
                        onBlur={{}}
                        inputRef={commentsRef}
                        multiline={true}
                        maxRows={2}
                        placeholder={t('typeTitle')}
                        error={false}
                        helperText={''}
                    />
                </Grid>
                {
                    props.section === 'edit' && <React.Fragment>

                        <Grid item lg={4} sm={4}
                            style={{ paddingRight: '5px' }}>
                            <InputFieldNDL
                                id="ins-freq-val"
                                label={t("TaskID")}
                                disabled
                                onBlur={{}}
                                inputRef={taskIDRef}
                                required={true}
                                placeholder={t('typeTitle')}
                                error={false}
                                helperText={''}
                            />
                        </Grid>
                        <Grid item lg={4} sm={4}
                            style={{ paddingRight: '5px' }}>
                            <InputFieldNDL
                                id="ins-created-val"
                                label={t("CreatedBy")}
                                disabled
                                onBlur={{}}
                                inputRef={createdByRef}
                                required={true}
                                placeholder={t('typeTitle')}
                                error={false}
                                helperText={''}
                            />
                        </Grid>
                         
                        <Grid item lg={4} sm={4}>   
                        <div style={classes.root}>       
                            <InputFieldNDL
                                id="ins-freq-val"
                                label={t('Created Date')}
                                value={createdDate?moment(createdDate).format('DD-MM-YYYY'):""}
                                disabled  
                                required={true}
                                error={false}
                                helperText={''}
                            />   
                        </div>
                        </Grid> 
                    </React.Fragment>
                }
                <Grid item xs={12} >
                    <ParagraphText  value={t("image")} variant="heading-02-sm" />
                    <div style={classes.imageField}    >

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container spacing={1}>
                                {
                                    filesArr.length > 0 && !attachmentloading && filesArr.map((val, index) => {
                                        let textName = val.name ? val.name : ""
                                        return (
                                            <Grid key={index+1} item lg={4} sm={4}>
                                                <KpiCards style={{ minHeight: "80px" ,cursor:"pointer"}}>
                                                    <div style={{ minHeight: "80px", display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ width: "80%", display: "flex", alignItems: "center" }}>
                                                        {renderCardImage(val)}                                                            <ToolTip title={val.image_path ? val.image_path : val.name} placement="top" arrow>
                                                                <ParagraphText onClick={(e) => openFile(val.base64, val.image_path)} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", textAlign: "left", marginLeft: "5px", width: "85%" }} value={val.image_path ? val.image_path : textName} variant={"Caption1"}></ParagraphText>
                                                            </ToolTip>
                                                        </div>

                                                        <div style={{ display: 'flex', marginLeft: "auto", marginRight: "5px", alignItems: "center", width: "20%", justifyContent: "flex-end" }}>
                                                            {val.image_path &&
                                                                <Download style={{cursor:"pointer"}} stroke={'#0084FF'} onClick={(e) => downloadImage(val.image_path)} />
                                                            }
                                                            <Delete style={{cursor:"pointer"}} onClick={(e) => val.type ? removeFiles(index, e) : removeExistingFiles(index, val)} />
                                                        </div>
                                                    </div>
                                                </KpiCards>
                                            </Grid>
                                        )
                                    })
                                }
                                {
                                    filesArr.length < fileLength && !attachmentloading ? (

                                        <Grid item lg={4} sm={4}>
                                            <label for="file-input" >
                                                <KpiCards style={{ minHeight: "80px", display: "flex", alignItems: "center",cursor:"pointer" }}>
                                                   

                                                        <div className="flex items-center px-8 py-4 align-middle">
                                                        <Plus stroke={curTheme === 'dark' ? '#ffff' : '#000000'} />

                                                            <ParagraphText style={{ paddingLeft: "5px" }} value={t("ClickHereToAddFiles")} variant={"Body2Reg"}></ParagraphText>
                                                        </div>

                                                   
                                                </KpiCards>
                                            </label>
                                        </Grid>
                                    ) : (<React.Fragment></React.Fragment>)
                                }

                            </Grid>
                        </div>
                        <br></br>
                        <div style={{ paddingLeft: "10px" }}>
                            <ParagraphText  value={t("FileFormat")} variant="heading-02-sm"></ParagraphText>
                            <ParagraphText  value={t("MaxSize")} variant="heading-02-sm"></ParagraphText>
                        </div>

                        <input id="file-input" className="task-upload" type="file" multiple accept="image/x-png,image/gif,image/jpeg,.pdf" ref={dropzoneRef} onChange={(e) => updateImage(e)} style={{ backgroundColor: 'transparent', color: '#fcfcfc', position: 'relative', width: '100%', height: '10px', left: '0', opacity: 0 }} />
                    </div>
                </Grid>
            </Grid>
            </div>
        </React.Fragment>
    )
})
export default TaskForm;