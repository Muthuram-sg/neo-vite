import React,{useState, useEffect, useRef} from 'react'
import {useNavigate,useParams,useLocation} from 'react-router-dom'
import Grid from 'components/Core/GridNDL'
import useTheme from 'TailwindTheme'; 
import KpiCards from 'components/Core/KPICards/KpiCardsNDL'
import HorizontalLine from 'components/Core/HorizontalLine/HorizontalLineNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import Filter from 'assets/neo_icons/Charts/filter.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL';
import Select from 'components/Core/DropdownList/DropdownListNDL'
import { useRecoilState } from 'recoil'
import { selectedPlant, customdates,snackToggle,snackType,snackMessage,ErrorPage,themeMode, faultRange } from 'recoilStore/atoms'
import TableIcon from 'assets/neo_icons/Dashboard/table2.svg?react';
import TileIcon from 'assets/neo_icons/Dashboard/layout-grid.svg?react';
import useTaskList from './hooks/useTaskList'
import moment from 'moment'
import Bar from 'components/Charts_new/bar'
import TaskDateRange from './components/TaskDateRange'
import { useTranslation } from 'react-i18next'
import TaskForm from './NewTaskForm'
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Search from 'assets/neo_icons/Menu/newTableIcons/search_table.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import Button from "components/Core/ButtonNDL";
import TagNDL from 'components/Core/Tags/TagNDL'
import TaskUser from 'assets/neo_icons/TaskUser.svg?react'; 
import useInstrumentStatusList from './hooks/useInstrumentStatusList';
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useEditLastTime from './hooks/useEditLastTime'
import useTaskPriority from './hooks/useTaskPriority';
import useTaskStatus from './hooks/useTaskStatus';
import useFaultModeList from './hooks/useFaultModeList'; 
import EnhancedTable from "components/Table/Table";
import useGetDueDateExpiredTask from './hooks/useGetDueDateExpiredTask'
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useDueDateSendEmail from './hooks/useDueDateSendEmail' 
import PriorityBreakDown from "./Recharts/PriorityBreakDown"
import FaultStatusOverview from "./Recharts/FaultStatusOverview"
import TaskFileUploadModel from './components/taskFileUploadModel';
import useFaultClassification from './hooks/usefaultClassification'
import useSuspectFaultList from './hooks/useSuspectFaultList';
import LoadingScreenNDL from 'LoadingScreenNDL';
import ClickAwayListener from 'react-click-away-listener'
import OverDueModal from './OverDueModal';
import Download from 'assets/neo_icons/Tasks/download.svg?react';
import Upload from 'assets/File_Upload.svg?react';
import SortAscending from 'assets/neo_icons/Arrows/SortAscending.svg?react';
import SortDescending from 'assets/neo_icons/Arrows/SortDescending.svg?react';
import TaskIcon from 'assets/neo_icons/newUIIcons/Tasks.svg?react';
import OverDueTask from 'assets/neo_icons/newUIIcons/Overdue.svg?react';
import Status from 'components/Core/Status/StatusNDL'
import TaskImageUploadModel from './components/TaskImageUploadModel';
import useInstrumentCategory from "Hooks/useInstrumentCategory";
import useInstrumentType from "Hooks/useInstrumentType";
import useAssetType from 'components/layouts/NewSettings/Asset/hooks/useAssetType.jsx'
import useGetZoneByLine from 'components/layouts/AssetHealth/hooks/useGetZoneByLine'
import useGetAssetByZone from 'components/layouts/AssetHealth/hooks/useGetAssetByZone'
import * as XLSX from 'xlsx';
// NOSONAR
const NewTask = () => {
    const [headPlant] = useRecoilState(selectedPlant);
  const [currTheme] = useRecoilState(themeMode);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let taskId = queryParams.get('taskid'); 
    //10-07-2024 10:15:55;16-07-2024 10:15:55
    const [Customdatesval, setCustomdatesval] = useRecoilState(customdates)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [airleakdatapresent, setairleakdatapresent]= useState(false);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType); 
    const [,setErrorPage] = useRecoilState(ErrorPage) 
    const { t } = useTranslation();
    const [anchorEl,setAnchorEl] = useState(null);
    const [selected, setSelected] = useState("tile"); 
    const [, setFaultRange] = useRecoilState(faultRange);
    const [anchorOvEl,setAnchorOvEl] = useState(null);
    const [tabledata, settabledata] = useState([])
    const [rawtabledata, setrawtabledata] = useState([])
    const [open,setOpen] = useState(false); 
    const [totalairleakcount, settotalairleakcount] = useState(); 
    const [openCount, setopenCount] = useState(); 
    const [closeCount, setcloseCount] = useState(); 
    const [Overallopen,setOverallOpen] = useState(false); 
    const [nameArr,setNameArr]=useState([])
    const [popperOption,setpopperOption ] = useState([{id: "priority",name:"Priority",checked:false},{id: "status",name:"Task Type",checked:false},{id: "userID",name:"Assignee",checked:false},{id: "faultModeID",name:"Fault Mode",checked:false},{id: "instID",name:"Instrument Status",checked:false},{id: "assettype",name:"Asset Type",checked:false},{id: "zone",name:"Zone",checked:false}])
    const [popperOverallOption,setpopperOverallOption ] = useState([{id: "task type",name:"Task Type",checked:false},{id: "instrument type",name:"Instrument Type",checked:false}])
     const [priorityCheck,setPriorityCheck]=useState(false)
    const [chartselected, setchartselected]= useState("tile"); 
    const [priority,setPriority]=useState([])
    const [assetTypeCheck,setAssetTypeCheck]=useState(false)
    const [assetType,setAssetType]=useState([])
    const [zoneCheck,setZoneCheck]=useState(false)
    const [zone,setZone]=useState([])
    const [cattype,setcattype]=useState([])
    const [category,setcategory]=useState([])
    const [UserOption, setUserOption] = useState([])
    const [taskType,setTaskType]=useState([])
    const [,setOverallTaskType]=useState([])
    const [taskTypeCheck,setTaskTypeCheck]=useState(false)
    const [overalltaskTypeCheck,setOverallTaskTypeCheck]=useState(false)
    const [assigneeCheck,setAssigneeCheck]=useState(false) 
    const [overallInsType,setoverallInsType]=useState(false) 
    const [assignee,setAssignee]=useState([])
    const [,setinsType]=useState([])
    const [faultModeCheck,setFaultModeCheck]=useState(false)
    const [faultMode,setFaultMode]=useState([])
    const [dateRange,] = useState('')
    const [instrumentStatusCheck,setInstrumentStatusCheck]=useState(false)
    const [instrumentStatus,setInstrumentStatus]=useState('')
    const [input, setInput] = useState(false);
    const [search,setSearch]=useState('')
    const [taskList,setTaskList]=useState([])
    const [temptasklist,setTempTaskList]=useState([])
    const [tempTaskListSorted, setTempTaskListSorted]= useState(temptasklist || []);
    const [countVal,setCountVal]=useState([])
    const [tempCountVal,setTempCountVal]=useState([])
    const [airleaktask, setairleaktask]=useState([])
    const [openList,setOpenList]=useState(false)
    const [page,setPage]=useState('Overview') 
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const { SuspectFaultListLoading, SuspectFaultListData, SuspectFaultListError, getSuspectFaultList } = useSuspectFaultList();
    const { InstrumentStatusLoading, InstrumentStatusData, InstrumentStatusError, getInstrumentStatusList } = useInstrumentStatusList();
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const { FaultClassificationLoading, FaultClassificationData, FaultClassificationError, getFaultClassification }=useFaultClassification()
    const { PriorityListLoading, PriorityListData, PriorityListError, getPriorityList } = useTaskPriority();
    const { StatusListLoading, StatusListData, StatusListError, getStatusList } = useTaskStatus();
    const { TaskListLoading, TaskListData, TaskListError, getTaskList } = useTaskList();
    const  {  EditLastTimeLoading, EditLastTimeError, EditLastTimeData, getEditLastTime } = useEditLastTime()
    const { getFaultModeList } = useFaultModeList();
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType()
    const { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType } = useAssetType(); 
    const { zoneByLineLoading, zoneByLineData, zoneByLineError, getZonesByLine } = useGetZoneByLine();
    const { assetByZoneData, getAssetsByzone } = useGetAssetByZone();
    const [taskData, setTaskData] = useState([])
    const [openTaskData, setOpenTaskData] = useState(0)
    const [ ,setnaTaskData] = useState(0)
    const [closedTaskData, setClosedTaskData] = useState(0)
    const [closedTaskPercent, setClosedTaskPercent] = useState(0)
    const [expiredTaskGT60, setExpiredTaskGT60] = useState(0)
    const [dueDateExpiredList, setDueDateExpiredList] = useState([])
    const [dataPrior,setData]=useState([])
    const [percentagesArray,setPercentage]=useState([])
    const [faultModeData,setFaultModeData]=useState([])
    const [faultClassification,setFaultClassification]=useState([])
    const { TaskDueDateExpiredLoading, TaskDueDateExpiredData, TaskDueDateExpiredError, getDueDateExpiredTask } = useGetDueDateExpiredTask();
    
    const [isOnline, setisOnline]=useState(false)
    const [isOffline, setisOffline]=useState(false)
    const [isConnectivity, setisConnectivity]=useState(false)
    const navigate = useNavigate();
    const ImageUploadRef = useRef();
    const formRef = useRef();
    const OverdueRef = useRef();
    const [section, setSection] = useState('table');
    const [loading, setLoading] = useState(false);
    const [ filtertype, setfiltertype ] = useState('All');
    const [sortOrders, setSortOrders] = useState({});
    const [status, setStatus] = useState(null);
    const { DueDateSendEmailLoading, DueDateSendEmailError, DueDateSendEmailData, getDueDateSendEmail } = useDueDateSendEmail();
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 
    const fileUploadRef = useRef();
    let {moduleName,queryParam} = useParams()
    const schema = headPlant.plant_name; 
    


    let appUrl = window.location.href;

    const headCells = [

        {
            id: 'SNo',
            label: 'S.No',
            disablePadding: false,
        },
        {
            id: 'TaskID',
            numeric: false,
            disablePadding: false,
            label: t('Task ID'),
            colSearch: true,
        }, {
            id: 'Task',
            numeric: false,
            disablePadding: false,
            label: t("Task"),
            colSearch: true,
        },
        {
            id: 'Type',
            numeric: false,
            disablePadding: false,
            label: t("Type"),
            colSearch: true,
        },
        {
            id: 'Createdon',
            numeric: false,
            disablePadding: false,
            label: t("Created On"),
            colSearch: true,
        },
        {
            id: 'Severity',
            numeric: false,
            disablePadding: false,
            label: t("Severity"),
            colSearch: true,
        },
        {
            id: 'Assignee',
            numeric: false,
            disablePadding: false,
            label: t("Assignee"),
            colSearch: true,
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: false,
            label: t("Status"),
            colSearch: true,
        },
    ]
   
    const changeSection = (sect, value) => {
        console.log(sect,"sect")
        setPage(sect); 
        if(sect === 'Overview'){
            navigate(`/${schema}/Tasks`);
        }
        if(value !== 'Cancel'){
            setTimeout(() => { 
                getTaskList(headPlant.id, Customdatesval.StartDate, new Date(moment().format("YYYY-MM-DDTHH:mm:ssZ")));
                let due_Date = moment(moment().subtract(60, 'day')).startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone); 
                getDueDateExpiredTask(headPlant.id, due_Date) 
                
            }, [1000]) 
        } 
        else {
            const schema = headPlant.plant_name; 
            navigate(`/${schema}/Tasks`); 
        }
     
    }

    useEffect(() => {
        processedrows();
    
        const filteredData = tempTaskListSorted.filter(
            (x) => x.instrument?.instrumentTypeByInstrumentType?.id === 13
        );
        if(filteredData && filteredData.length > 0){
            setairleakdatapresent(true)
        } else {
            setairleakdatapresent(false)
        }
        const openCount = filteredData.filter(task => 
            task.taskStatus?.status !== "Completed" && task.taskStatus?.status !== "No Action Required"
        ).length;
        
        const closeCount = filteredData.filter(task => 
            task.taskStatus?.status === "Completed" || task.taskStatus?.status === "No Action Required"
        ).length;        
    
        const taskSummary = [
            { name: "Pending", count: openCount },
            { name: "Completed", count: closeCount }
        ];
        settotalairleakcount(openCount + closeCount)
        setcloseCount(closeCount)
        setopenCount(openCount)
        setairleaktask(taskSummary)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tempTaskListSorted,UsersListForLineData]);

    const getStatusColor = (statusType) => {
        switch (statusType) {
            case "Critical":
                return "error-alt";
            case "Warning":
                return "warning02-alt";
            case "Normal":
                return "success-alt";
            default:
                return "";
        }
    };

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case "Completed":
                return "#ADDDC0";
            case "Not Assigned":
            case "No Action Required":
                return "#F0F0F0";
            case "Assigned":
                return "#FFEE9C";
            case "Planned":
                return "#C2E5FF";
            default:
                return "";
        }
    };    

    const getStatusTextColor = (status) => {
        switch (status) {
            case "Completed":
                return "#2B9A66";
            case "Not Assigned":
            case "No Action Required":
                return "#202020";
            case "Assigned":
                return "#AB6400";
            case "Planned":
                return "#0066CC";
            default:
                return "";
        }
    };

    useEffect(()=>{
        if(airleaktask && airleaktask.length > 0){
        if(airleaktask[0].count === 0 && airleaktask[1].count === 0){
            setchartselected("tile")
        }
    }
    },[airleaktask])

    const processedrows = () => {
        let temptabledata = [];
        let rawtemptabledata = [];
        if (tempTaskListSorted.length > 0 && UsersListForLineData && UsersListForLineData.length > 0) {
            temptabledata = tempTaskListSorted.map((val, index) => {
                const taskType = val.taskType.task_type.toLowerCase();

                const task_type = taskType.includes("online")
                ? "Online"
                : taskType.includes("offline")
                ? "Offline"
                : val.taskType.task_type;
                let user = UsersListForLineData.filter(user => user.userByUserId?.id === val.assingee);
                user = user[0]?.userByUserId?.name || ""
                rawtemptabledata.push({
                    "SNo": index + 1,
                    "TaskID": val.task_id,
                    "Task": val.title,
                    "Type": task_type,
                    "Createdon": moment(val.created_ts).format("DD/MM/YYYY"),
                    "Severity": val.instrument_status_type ? val.instrument_status_type.status_type : "",
                    "Assignee": val.userByAssignedFor ? val.userByAssignedFor.name : "",
                    "Status": val.taskStatus.status
                });

                return [
                    index + 1,
                    val.task_id,
                    val.title,
                    task_type,
                    moment(val.created_ts).format("DD/MM/YYYY"),     
                    <Status
                        key={index+1}
                        style={{ 
                            color: "#FFFFFF", 
                            textAlign: "center" 
                        }} 
                        colorbg={ val.instrument_status_type ? getStatusColor(val.instrument_status_type.status_type) : ""}    
                        name={val.instrument_status_type ? val.instrument_status_type.status_type: ""} 
                    />,
                    val.userByAssignedFor ? val.userByAssignedFor.name : "",
                    <Status
                    key={index+1}
                    style={{ 
                        width: "100px",
                        textAlign: "center",
                        backgroundColor: getStatusBackgroundColor(val.taskStatus.status),
                        color:  getStatusTextColor(val.taskStatus.status)
                    }}
                    name={val.taskStatus.status} 
                />,
                ];
            });
        }
    
        settabledata(temptabledata);
        setrawtabledata(rawtemptabledata)
    };
    
    useEffect(() => {
        let filteredTasks = taskList.filter(t =>
             t.title.toLowerCase().includes(search.toLowerCase())
          );
          let filteredStatusList= countVal.map( c=> {
            return {...c,count: filteredTasks.filter(f=>f.status === c.status).length.toString()}
        })
        setTempCountVal(filteredStatusList);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [search]);

    useEffect(() => { 
        getFaultClassification()
        getSuspectFaultList() 
        getInstrumentCategory()
        getZonesByLine(headPlant.id)
        getAssetType() 
        setisOffline(true)
        setisOnline(true)
        setisConnectivity(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])
    // NOSONAR
    useEffect(() => {
        if(moduleName === 'newtask'){
                setPage('New Task')
                setSection('create');
                setOpenList(false)
                setTimeout(() => {
                    let alarmTask = localStorage.getItem("createTaskFromAlarm") ? JSON.parse(localStorage.getItem("createTaskFromAlarm")) : ''
                    if(alarmTask){
                        formRef.current.createTask(alarmTask.state) 
                    } else {
                    formRef.current.breadCrumbHandler("New Task")
                    }
                }, [100])
        }
        else if(moduleName === "overview" && queryParam){
            const paramsArray = queryParam.split('&'); 
            const queryParamss = {};
            paramsArray.forEach(param => {   
                const [key, value] = param.split('=');   
                queryParamss[key] = value;
            });
            console.log(paramsArray,queryParamss,"check")
            const taskID = queryParamss['taskid'];
                if(taskID ){ 
                    if(taskList.length>0){
                        const filteredTask = taskList.filter(task => task.task_id === taskID);
                        if(filteredTask.length > 0){
                            
                            setTimeout(() => {
                                formRef.current.bindValue(filteredTask[0])
                            }, [200])
                            setPage('New Task')
                            setSection('edit')
                        }
                        else{
                            console.log('hi navigate',window.location)
                        setErrorPage(true)
                        }
                    }
                    
                }else{
                    setErrorPage(true)
                }
    
        
        
    }
    else if(moduleName && !['overview','newtask','editform'].includes(moduleName) && !((moduleName.includes('&') || moduleName.includes('=')) && moduleName.includes('range'))){
        setErrorPage(true)
    }else if(moduleName && ((moduleName.includes('&') || moduleName.includes('=')) && moduleName.includes('range')) && queryParam){
        setErrorPage(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
 },[moduleName,taskId,taskList])
    useEffect(()=>{
        if(!zoneByLineLoading && zoneByLineData && !zoneByLineError){
        const idArray = zoneByLineData.map(item => item.id);
        getAssetsByzone(idArray);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[zoneByLineLoading, zoneByLineData, zoneByLineError])
        
    
    useEffect(() => {
        if (temptasklist && temptasklist.length > 0) {
          if (sortOrders && Object.keys(sortOrders).length > 0) {
            const sortTaskListByMultipleStatuses = (tasks, sortOrders) => {
              let sortedTasks = [];
              let usedTaskIds = new Set();
      
              Object.entries(sortOrders).forEach(([statusKey, order]) => {
                const status = parseInt(statusKey);
                const filteredTasks = tasks.filter(task => task.status === status);
                const sortedTasksForStatus = filteredTasks.sort((a, b) => {
                  const dateA = new Date(a.reported_date).setHours(0, 0, 0, 0);
                  const dateB = new Date(b.reported_date).setHours(0, 0, 0, 0);
                  const dateComparison = dateA - dateB;
      
                  if (dateComparison === 0) {
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                  } else {
                    return order === "Ascending" ? dateComparison : -dateComparison;
                  }
                });
      
                sortedTasks.push(...sortedTasksForStatus);
                sortedTasksForStatus.forEach(task => usedTaskIds.add(task.id));
              });
      
              const remainingTasks = tasks.filter(task => !usedTaskIds.has(task.id));
      
              const defaultSortedRemainingTasks = remainingTasks.sort((a, b) => {
                const dateA = new Date(a.reported_date).setHours(0, 0, 0, 0);
                const dateB = new Date(b.reported_date).setHours(0, 0, 0, 0);
                const dateComparison = dateB - dateA;
      
                if (dateComparison === 0) {
                  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                } else {
                  return dateComparison;
                }
              });
      
              sortedTasks.push(...defaultSortedRemainingTasks);
      
              return sortedTasks;
            };
      
            const combinedSortedTasks = sortTaskListByMultipleStatuses(temptasklist, sortOrders);
            setTempTaskListSorted(combinedSortedTasks);
          } else if (status && sortOrders && sortOrders[status]) {
            const sortOrder = sortOrders[status];
            const filteredTasks = temptasklist.filter(task => task.status === status);
            const tasksWithoutStatus = temptasklist.filter(task => task.status !== status);
      
            const sortedTasksWithStatus = filteredTasks.sort((a, b) => {
              const dateA = new Date(a.reported_date).setHours(0, 0, 0, 0);
              const dateB = new Date(b.reported_date).setHours(0, 0, 0, 0);
              const dateComparison = dateA - dateB;
      
              if (dateComparison === 0) {
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
              } else {
                return sortOrder === "Ascending" ? dateComparison : -dateComparison;
              }
            });
      
            const sortedTasksWithoutStatus = tasksWithoutStatus.sort((a, b) => {
              const dateA = new Date(a.reported_date).setHours(0, 0, 0, 0);
              const dateB = new Date(b.reported_date).setHours(0, 0, 0, 0);
              const dateComparison = dateB - dateA;
      
              if (dateComparison === 0) {
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
              } else {
                return dateComparison;
              }
            });
      
            const combinedSortedTasks = [...sortedTasksWithStatus, ...sortedTasksWithoutStatus];
            setTempTaskListSorted(combinedSortedTasks);
          } else {
            const sortedTasks = [...temptasklist].sort((a, b) => {
              const dateA = new Date(a.reported_date).setHours(0, 0, 0, 0);
              const dateB = new Date(b.reported_date).setHours(0, 0, 0, 0);
              const dateComparison = dateB - dateA;
      
              if (dateComparison === 0) {
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
              } else {
                return dateComparison;
              }
            });
      
            setTempTaskListSorted(sortedTasks);
          }
        } else {
          setTempTaskListSorted(temptasklist);
        }
      }, [temptasklist, sortOrders, status]);       

      setFaultRange(14)
      console.log(dateRange,"null check")
    useEffect(() => {
        setLoading(true);
        getTaskList(headPlant.id, Customdatesval.StartDate, Customdatesval.EndDate);
        let due_Date = moment(moment().subtract(60, 'day')).startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone); 
        getDueDateExpiredTask(headPlant.id, due_Date) 
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant, Customdatesval])


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
        if( !FaultClassificationLoading && FaultClassificationData && !FaultClassificationError){
        
            setFaultClassification(FaultClassificationData)
        }
    },[ FaultClassificationLoading, FaultClassificationData, FaultClassificationError])
    useEffect(() => {
        if( !SuspectFaultListLoading && SuspectFaultListData && !SuspectFaultListError){
   
           setFaultModeData(SuspectFaultListData)
        }
    },[ SuspectFaultListLoading, SuspectFaultListData, SuspectFaultListError])
    useEffect(() => {
        if(!DueDateSendEmailLoading && !DueDateSendEmailError && DueDateSendEmailData){
          
            if (DueDateSendEmailData.failure !== 0) {
                setSnackMessage(`Failed to send ${DueDateSendEmailData.failure} emails`)
                setSnackType("error")
                setOpenSnack(true)
            } 
                setSnackMessage(`Successfully sent ${DueDateSendEmailData.success} emails`)
                setSnackType("success")
                setOpenSnack(true)
              
            
        }
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DueDateSendEmailLoading, DueDateSendEmailError, DueDateSendEmailData])

    useEffect(() => {
      
        getFaultModeList();
        getInstrumentStatusList();
        getUsersListForLine(headPlant.id);
        getPriorityList();
        getStatusList();
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])

    useEffect(() => {
        let online, offline, connectivity
        if (!TaskListLoading && !TaskListError && TaskListData) {
            if(filtertype === "Connectivity")
                {connectivity = true} else  
            if(filtertype === "Offline")
                {offline = true} else 
            if(filtertype === "Online")
                {online = true} else 
            if(filtertype === "All")
                {online = true
                    offline = true 
                    connectivity = true
                }
            let tempTaskListData = TaskListData;
        
            const selectedCatTypes = cattype.map(c => c.name);
            if (online && !offline && !connectivity) {
                tempTaskListData = TaskListData.filter(
                    task => (task.taskType.id === 15 || task.taskType.id === 20 || task.taskType.id === 28) &&
                            (selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
                );
            } else if (offline && !online && !connectivity) {
                tempTaskListData = TaskListData.filter(
                    task => (task.taskType.id === 27 || task.taskType.id === 29) &&
                            (selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
                );
            } else if (connectivity && !online && !offline) {
                tempTaskListData = TaskListData.filter(
                    task => task.taskType.id === 30 &&
                            (selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
                );
            } else if (online && offline && !connectivity) {
                tempTaskListData = TaskListData.filter(
                    task => (task.taskType.id === 15 || task.taskType.id === 20 || task.taskType.id === 28 || task.taskType.id === 27 || task.taskType.id === 29) &&
                            (selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
                );
            } else if (online && connectivity && !offline) {
                tempTaskListData = TaskListData.filter(
                    task => (task.taskType.id === 15 || task.taskType.id === 20 || task.taskType.id === 28 || task.taskType.id === 30) &&
                            (selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
                );
            } else if (offline && connectivity && !online) {
                tempTaskListData = TaskListData.filter(
                    task => (task.taskType.id === 27 || task.taskType.id === 29 || task.taskType.id === 30) &&
                            (selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
                );
            } else if (online && offline && connectivity) {
                tempTaskListData = TaskListData.filter(
                    task => selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name)
                );
            } else if (!online && !offline && !connectivity) {
                tempTaskListData = TaskListData.filter(
                    task => selectedCatTypes.length === 0 || selectedCatTypes.includes(task.instrument?.instrumentTypeByInstrumentType?.name))
            }
            if (tempTaskListData.length > 0) {
                setTaskData(tempTaskListData.filter((x) =>  x.status !== 21 ))

                let objTotalTaskCount = tempTaskListData.filter((x) =>  x.status !== 21 ).length
                let objOpenTaskList = tempTaskListData.filter((x) => x.status !== 3 && x.status !== 21 )
                let objClosedTaskList = tempTaskListData.filter((x) =>  x.status === 3 )
                let objnaTaskList = tempTaskListData.filter((x) =>  x.status === 21 )
             
                let objDueDateExpiredList = objOpenTaskList.filter((x) => (moment().diff(moment(x.due_date), 'days') > 0) && (moment().diff(moment(x.due_date), 'days') < 60) ).map(t => {
                    let diffInDays = Math.abs(moment().diff(moment(t.last_remainded_time), 'days'));
                    let diffInHours = diffInDays < 2 || (diffInDays === 2 && moment().hours() < moment(t.last_remainded_time).hours());
                    let lastTime = t.last_remainded_time ? diffInHours : false;
                    return {...t, disabled: lastTime};
                });
                
                  const priorityCount = { High: 12, Medium: 11, Low: 14 };
                  const colors = { High: '#CE2C31', Medium:"#EF5F00",Low:"#ffC53D"};
                  const priorityOrder = ['High', 'Medium', 'Low'];
                  const priorityCounts = {};

                  Object.keys(priorityCount).forEach(key => {
                    const count = tempTaskListData.reduce((acc, task) => {
                      return task.priority === priorityCount[key] ? acc + 1 : acc;
                    }, 0);
                    priorityCounts[key] = count;
                  });
                const sortedCounts = Object.entries(priorityCounts)
                .sort((a, b) => priorityOrder.indexOf(a[0]) - priorityOrder.indexOf(b[0]))
                .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
                }, {});
                  const data = Object.values(sortedCounts);
                  const names = Object.keys(sortedCounts);
               
                  const rearrangedColors = names.map(name => colors[name]);
                  
                        const combinedArray = combineArraysIntoObjects(names, rearrangedColors, data);
                        setData(combinedArray)
          
                            const faultClassMap = {};
                            faultModeData.forEach(({ fault_class_id }) => {
                            const classification = faultClassification.find(item => item.id === fault_class_id);
                            if (classification) {
                                faultClassMap[fault_class_id] = classification.name;
                            }
                            });
                            const resultArray = [];
                            const namesArray = [];
                            faultClassification.forEach(({ id, name }) => {
                            const count = tempTaskListData.reduce((total, obj) => {
                                const classification = faultModeData.find(item => item?.id === obj?.faultModeByFaultMode?.id);
                                if (classification && classification.fault_class_id === id) {
                                return total + 1;
                                }
                                return total;
                            }, 0);
                            if (count > 0 && name !== 'No Fault') {
                                resultArray.push(count);
                                namesArray.push(name);
                            }
                            });
                        setPercentage(resultArray)
                        setNameArr(namesArray)


                setOpenTaskData(objOpenTaskList.length)
                setnaTaskData(objnaTaskList.length)
                setClosedTaskData(objClosedTaskList.length)
                setClosedTaskPercent(parseInt((objClosedTaskList.length/objTotalTaskCount)*100))
                setDueDateExpiredList(objDueDateExpiredList)
                

                let tasklist = tempTaskListData;
               
                tasklist.sort((a, b) => a.status - b.status);
                setTaskList(tasklist)

                const uniqueStatusCode = [...new Set(tasklist.map(item => item.status))];
                const statusCodes = [1, 3, 5, 16, 21]
                let mergedStatusCodes = [...new Set([...uniqueStatusCode, ...statusCodes])].sort((a, b) => a - b);
                const statusCountArray = mergedStatusCodes.map(status => {
                    const count = tasklist.filter(item => item.status === status).length;
                    const formattedCount = count < 10 ? `0${count}` : count.toString();
                    return {
                        status: status,
                        count: formattedCount
                    };
                });

                let popOption = popperOption.filter(x => x.checked)
                if(popOption.length > 0){
                    if(popOption[0].id === "priority"){
                    FilterByStatus(priority,popOption[0].id,tasklist,statusCountArray)
                    } else if(popOption[0].id === "status"){
                            FilterByStatus(taskType,popOption[0].id,tasklist,statusCountArray)
                            } else if(popOption[0].id === "userID"){
                                FilterByStatus(assignee,popOption[0].id,tasklist,statusCountArray)
                                } else if(popOption[0].id === "faultModeID"){
                                    FilterByStatus(faultMode,popOption[0].id,tasklist,statusCountArray)
                                    } else if(popOption[0].id === "assettype"){
                                        FilterByStatus(assetType,popOption[0].id,tasklist,statusCountArray)
                                        } else if(popOption[0].id === "zone"){
                                            FilterByStatus(zone,popOption[0].id,tasklist,statusCountArray)
                                            } else if(popOption[0].id === "instID"){
                                                FilterByStatus(instrumentStatus,popOption[0].id,tasklist,statusCountArray)
                                                } 
                } else {
                    setTempTaskList(tasklist)
                    setTempCountVal(statusCountArray)
                    setCountVal(statusCountArray)
                }
               
            }
            else{
                setTaskData([])
                setOpenTaskData(0)
                setClosedTaskData(0)
                setnaTaskData(0)
                setClosedTaskPercent(0)
                setDueDateExpiredList([])
                setTaskList([])
                setTempTaskList([])
                setPercentage([])
                setData([])
               
                const uniqueStatusCode = [...new Set(tempTaskListData.map(item => item.status))];
                const statusCodes = [1, 3, 5, 16, 21]
                let mergedStatusCodes = [...new Set([...uniqueStatusCode, ...statusCodes])].sort((a, b) => a - b);
                const statusCountArray = mergedStatusCodes.map(status => {
                    const count = tempTaskListData.filter(item => item.status === status).length;
                    const formattedCount = count < 10 ? `0${count}` : count.toString();
                    return {
                        status: status,
                        count: formattedCount
                    };
                });
                setCountVal(statusCountArray)
                setTempCountVal(statusCountArray)
            }



        }
        else {
            setTaskData([])
            setOpenTaskData(0)
            setClosedTaskData(0)
            setnaTaskData(0)
            setClosedTaskPercent(0)
            setDueDateExpiredList([])
            setTaskList([])
            setTempTaskList([])
            setPercentage([])
            setData([])
           
            tempCountVal.forEach(obj => {
                obj.count = "00";
            });
            
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskListData, cattype ,filtertype, overalltaskTypeCheck])  

    const handleSwitch = (type) => {
        setSelected(type);
    };

    const handleChartSwitch = (type) => {
        setchartselected(type);
    };

   function handleDownloadTasks(downloaddata) {
        let newData = downloaddata.map((downloaddata, index) => ({
            SNo: index + 1,
            Task_Id: downloaddata?.task_id || "",
            Task_Name: downloaddata?.title || "",
            Priority: downloaddata?.taskPriority?.task_level || "",
            Assigne: downloaddata?.userByAssignedFor?.name || "",
            Due_Date: formatDate(downloaddata?.due_date),
            Asset: downloaddata?.entityId?.name || "",
            Instruments: downloaddata?.instrument?.name || "",
            Type: downloaddata?.taskType?.task_type || "",
            Instrument_Status: downloaddata?.instrument_status_type?.status_type || "",
            Task_Status: downloaddata?.taskStatus?.status || "",
            Main_Component: downloaddata?.task_main_component_master?.description || "",
            Sub_Component: downloaddata?.task_sub_component_master?.description || "",
            Fault_Mode: downloaddata?.faultModeByFaultMode?.name || "",
            Observation: downloaddata?.description || "",
            Action_Recommended: downloaddata?.action_recommended || "",
            Observed_By: downloaddata?.userByObservedBy?.name || "",
            Observed_Date: formatDate(downloaddata?.observed_date),
            Reported_By: downloaddata?.userByReportedBy?.name || "",
            Reported_Date: formatDate(downloaddata?.reported_date),
            Action_Taken: downloaddata?.task_feedback_action?.feedback_action || "",
            Action_Taken_Date: formatDate(downloaddata?.action_taken_date),
            Comments: downloaddata?.comments || "",
        }));

        downloadExcel(newData, "TaskData - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'));
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        return new Date(dateString);
    }

    function getColumnLetter(data, colName) {
        const headerKeys = Object.keys(data[0]);
        const colIndex = headerKeys.indexOf(colName);
        return String.fromCharCode(65 + colIndex);
    }

    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data, { cellDates: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const dateColumns = ['Due_Date', 'Observed_Date', 'Reported_Date', 'Action_Taken_Date'];

        dateColumns.forEach(col => {
            const colLetter = getColumnLetter(data, col);
            Object.keys(worksheet).forEach(cell => {
                if (cell.startsWith(colLetter)) {
                    if (worksheet[cell].t === 'd') {
                        worksheet[cell].z = 'dd/mm/yyyy hh:mm:ss';
                    }
                }
            });
        });

        XLSX.writeFile(workbook, name + ".xlsx");
    };

// NOSONAR
    useEffect(() => {
        if (!TaskDueDateExpiredLoading && TaskDueDateExpiredData && !TaskDueDateExpiredError) {
            let totalOfflineCount = 0;
            let totalOnlineCount = 0;
            let totalCount = 0;
    
            for (const taskTypeId in TaskDueDateExpiredData) {
                const count = TaskDueDateExpiredData[taskTypeId];
                totalCount += count;
    
                if (taskTypeId === "27") {
                    totalOfflineCount = count;
                } else if (taskTypeId === "15" || taskTypeId === "20") {
                    totalOnlineCount += count;
                }
            }
    
            if (isOffline === true && isOnline === false) {
                setExpiredTaskGT60(totalOfflineCount);
            } else if (isOnline === true && isOffline === false) {
                setExpiredTaskGT60(totalOnlineCount);
            } else if (isOnline === false && isOffline === false) {
                setExpiredTaskGT60(totalCount);
            } else if (isOnline === true && isOffline === true) {
                setExpiredTaskGT60(totalCount);
            }
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskDueDateExpiredData, isOnline, isOffline]);      
  

    function combineArraysIntoObjects(arr1, arr2, arr3) {
        // Check if all arrays have the same length
        if (arr1.length !== arr2.length || arr1.length !== arr3.length) {
            throw new Error("Arrays must have the same length.");
        }
    
        // Initialize an empty array to store objects
        const combinedArray = [];
    
        // Iterate over the arrays and create objects
        for (let i = 0; i < arr1.length; i++) {
            // Create an object with elements from each array at the same index
            const obj = {
                name: arr1[i],
                color: arr2[i],
                data: arr3[i]
            };
            // Push the object to the combined array
            combinedArray.push(obj);
        }
    
        // Return the combined array
        return combinedArray;
    } 
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open)
    };
    const handleOverallClick = (event) => {
        setAnchorOvEl(event.currentTarget);
        setOverallOpen(!open)
    };
    const handleTask = (event) => {
      if(event){
        setNotificationAnchorEl(event.currentTarget);
        setOpenList(true)
      }else{
        setNotificationAnchorEl(null);
        setOpenList(false)
      }
     
    }
    const AddOption = [
        { id: "Upload File", name: "Upload File" },
        { id: "Upload Image", name: "Upload Image" }

    ]

    const toggleSortOrder = (status) => {
        setStatus(status);
        setSortOrders(prevSortOrders => ({
            ...prevSortOrders,
            [status]: prevSortOrders[status] === 'Ascending' ? 'Descending' : 'Ascending'
        }));
    };    
      

    const clickAwaySearch = () => {
        if (search === '')
            setInput(false)
        else
            setInput(true)
    }
    const handleClose = () =>{setAnchorEl(null);setOpen(false)};
    const handleOverallClose = () =>{setAnchorOvEl(null);setOverallOpen(false)};
    const handleCloseTask = () =>{setNotificationAnchorEl(null);
        setOpenList(false)}; 

        const handleSendReminder = (dueDateList) => { 
    
            // Disable the checked items after clicking send reminder
                const updatedTasks = dueDateList.map(item => {
                    if (item.checked) {
                        return { ...item, disabled: true ,last_remainded_time:moment().format("YYYY-MM-DDTHH:mm:ssZ")};
                    }
                    return item;
                });

                let filteredTasks = updatedTasks.filter(t => t.checked === true);

                // Reset the checked state for items that are disabled
                const updatedTasksWithUnchecked = updatedTasks.map(item => {
                    if (item.disabled) {
                        return { ...item, checked: false };
                    }
                    return item;
                });
                  

            setDueDateExpiredList(updatedTasksWithUnchecked);
            const mailJson ={
                task_create: "3",
                payload:filteredTasks.length > 0 && filteredTasks.map(task => ({
                    email: task.userByAssignedFor.email,
                    line_name: headPlant ? headPlant.name : "--",
                    mail_date: moment().format("DD/MM/YYYY"),
                    task_name: task.title ? task.title : "--",
                    description: task.description ? task.description : "--",
                    priority: task.priority ? getPriority(task.priority) : "--",
                    created_by: task.userByCreatedBy ? task.userByCreatedBy.name : "--",
                    observed_by: task.userByObservedBy ? task.userByObservedBy.name : "--",
                    reported_by: task.userByReportedBy ? task.userByReportedBy.name : "--",
                    due_date: moment(task.due_date).format("DD/MM/YYYY"),
                    completed_date: Number(task.status) === 3 ? moment().format("DD/MM/YYYY") : "--",
                    header: "Task Overdue Reminder: Action Required!",
                    description_text: "This is a reminder regarding the overdue deadline for your task"
                }))
            };
          
            getDueDateSendEmail(mailJson);
            const currentDate = new Date();
            const currentDateTime = currentDate.toISOString(); // Format: YYYY-MM-DDTHH:MM:SS.mmmZ
            filteredTasks.forEach(task => getEditLastTime(task.id,currentDateTime)) 
              
        };

        
        //NOSONAR 
    function optionChange(e,data) {

        let value = data.map(v => {
            if (v.id === e.id) {
                return { ...v, checked: !v.checked }
                
            } else {
                return { ...v }
            }
        })
        setpopperOption(value)
        if(e.name === "Asset Type" && e.checked === false){
            setAssetTypeCheck(true)
        }
        else if(e.name === "Asset Type" && e.checked === true){
            FilterByStatus([],"assettype")
            setAssetType([])
           setAssetTypeCheck(false)
           
        }
        if(e.name === "Zone" && e.checked === false){
            setZoneCheck(true)
        }
        else if(e.name === "Zone" && e.checked === true){
            FilterByStatus([],"zone")
            setZone([])
            setZoneCheck(false)
           
        }
        if(e.name === "Priority" && e.checked === false){
            setPriorityCheck(true)
        }
        else if(e.name === "Priority" && e.checked === true){
            FilterByStatus([],"priority")
           setPriority([])
            setPriorityCheck(false)
           
        }
        if(e.name === "Task Type" && e.checked === false){
            setTaskTypeCheck(true)
        }
        else if(e.name === "Task Type" && e.checked === true){
            setTaskType([])
            setTaskTypeCheck(false)
            FilterByStatus([],"status")
        }
        if(e.name === "Assignee" && e.checked === false){
            setAssigneeCheck(true)
        }
        else if(e.name === "Assignee" && e.checked === true){
            setAssignee([])
            setAssigneeCheck(false)
            FilterByStatus([],"userID")
        }
        if(e.name === "Fault Mode" && e.checked === false){
            setFaultModeCheck(true)
        }
        else if(e.name === "Fault Mode" && e.checked === true){
            setFaultMode([])
            setFaultModeCheck(false)
            FilterByStatus([],"faultModeID")
        }
        if(e.name === "Instrument Status" && e.checked === false){
            setInstrumentStatusCheck(true)
        }
        else if(e.name === "Instrument Status" && e.checked === true){
          setInstrumentStatus('')
            setInstrumentStatusCheck(false)
            FilterByStatus({target:{value:""}},"instID")
        } 
    } 

            
    function optionOverallChange(e,data) {

        let value = data.map(v => {
            if (v.id === e.id) {
                return { ...v, checked: !v.checked }
                
            } else {
                return { ...v }
            }
        })
        setpopperOverallOption(value)
       
        if(e.name === "Task Type" && e.checked === false){
            setOverallTaskTypeCheck(true)
        }
        else if(e.name === "Task Type" && e.checked === true){
            setOverallTaskType([])
            setOverallTaskTypeCheck(false)
            setfiltertype("All")
            FilterByStatus([],"tasks")
        }
        if(e.name === "Instrument Type" && e.checked === false){
            setoverallInsType(true)
        }
        else if(e.name === "Instrument Type" && e.checked === true){
            setinsType([])
            setoverallInsType(false)
            setcategory([])
            setcattype([])
            FilterByStatus([],"insType")
        }
    } 

    const handleCreateTask = ()=>{
        setPage("New Task")
        setSection('create') 
        setOpenList(false)
        setTimeout(() => {
            formRef.current.breadCrumbHandler("New Task")
        }, [200])

         // Navigate to the new route with the submodule name
    const schema = headPlant.plant_name; // Replace with the appropriate schema value
    
    navigate(`/${schema}/Tasks/newtask`);
       

    }
    
    useEffect(() => {
        if (appUrl.includes("editform")) {
            let dataFromAH = localStorage.getItem("openTaskFromAH");
    
            if (dataFromAH) { 
                try {
                    let data = JSON.parse(dataFromAH); 
                    let matchedTask = tempTaskListSorted.find(task => task?.id === data?.id);
    
                 if (matchedTask) {
                    optionChangeTask('edit', matchedTask);
                    
                    const startOfMonth = moment(matchedTask?.reported_date).startOf('month').toDate();
                    const endOfMonth = moment(matchedTask?.reported_date).endOf('month').toDate();

                    setCustomdatesval({ StartDate: startOfMonth, EndDate: endOfMonth });
                } else {
                    const startOfMonth = moment(data?.reported_date).startOf('month').toDate();
                    const endOfMonth = moment(data?.reported_date).endOf('month').toDate();

                    setCustomdatesval({ StartDate: startOfMonth, EndDate: endOfMonth });
                }

                } catch (error) {
                    console.error("Error parsing dataFromAH", error);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tempTaskListSorted, appUrl]);
    

    function optionChangeTask(e,data){
        if(data.Createdon){
            let datas = tempTaskListSorted.filter(x => x.task_id === data.TaskID)
            data = datas[0]
        }
          if(e === 'edit'){
            console.log(data,"data")
            setTimeout(() => {
                formRef.current.bindValue(data)
            }, [200])
            setPage('New Task')
            setSection(e)  
            localStorage.setItem('openTaskFromAH', "");
         }
         else if(e === 'Upload File'){
            setOpenList(false)
            fileUploadRef.current.openDialog();
         }else if (e === 'Upload Image'){
            setOpenList(false)
            ImageUploadRef.current.openDialog();
         }
    }

    const TagFilter = (type) => {
        setfiltertype(type)
        if(type === "All"){
            setisOnline(true)
            setisOffline(true)
            setisConnectivity(true)
        }
        else if(type === "Online"){
            setisOnline(true)
            setisOffline(false)
            setisConnectivity(false)
        }
        else if (type === "Offline"){
            setisOffline(true)
            setisOnline(false)
            setisConnectivity(false)
        }  
        else if (type === "Connectivity"){
            setisOffline(false)
            setisOnline(false)
            setisConnectivity(true)
        }  
    }
    // NOSONAR
    const FilterByStatus = (e,type,task,count) => {
        if (type === "inscat") {
            setcategory(e.target.value);
            getInstrumentType(e.target.value);
        } else {
        if (type === "priority") {
            setPriority(e);
        } else if (type === "status") {
            setTaskType(e);
        } else if (type === "userID") {
            setAssignee(e);
        } else if (type === "faultModeID") {
            setFaultMode(e);
        } else if (type === "instID") {
           if(typeof e === "object"){
            setInstrumentStatus(e.target.value)
           } else {
            setInstrumentStatus(e)
           }
        } else if (type === "assettype") {
            setAssetType(e);
        } else if (type === "zone") {
            setZone(e);  
        }  else if (type ===  "cattype") {
            setcattype(e);  
        }
        let selectedZones,assetIds
        if (type === "zone") {
        selectedZones = e.map((zone) => zone.id);
                
        assetIds = assetByZoneData
            .filter((zone) => selectedZones.includes(zone.entity_id))
            .flatMap((zone) => zone.asset_id.map((asset) => asset.id));

        } else {
            selectedZones = zone.map((zone) => zone.id);
                
            assetIds = assetByZoneData
                .filter((zone) => selectedZones.includes(zone.entity_id))
                .flatMap((zone) => zone.asset_id.map((asset) => asset.id));
    
        }
    
        let taskarray = task ? task : taskList
        const updatedTaskList = taskarray.map(task => ({
            ...task,
            faultModeID: task.faultModeByFaultMode ?task.faultModeByFaultMode.id:'',
            userID: task.userByAssignedFor?task.userByAssignedFor.id:'',
            instID: task.instrument_status_type?task.instrument_status_type.id:''
        }));
        let filteredTaskList = (type !== "assettype" && type !== "zone") ? ((type !== "instID")  ? (e.length > 0 ? updatedTaskList.filter(f => e.map(t => t.id).includes(f[type])) : updatedTaskList) : (e.target && e.target.value ? updatedTaskList.filter(f => e.target.value === f[type]) : updatedTaskList)) : updatedTaskList ; 
    
          
            if(((taskTypeCheck && taskType.length) || (assetTypeCheck && assetType.length) || (zoneCheck && zone.length) || (assigneeCheck && assignee.length) || (faultModeCheck && faultMode.length) || instrumentStatusCheck || isOnline || isOffline || isConnectivity) && type === "priority"){         
            filteredTaskList = filteredTaskList.filter(f => (taskType.length > 0 ? taskType.map(t => t.id).includes(f["status"]) : true)   && (zone.length === 0 || assetIds.includes(f.entityId.id)) && (assetType.length === 0 || assetType.some((asset) => asset.name === f.entityId.asset_type.name)) && (assignee.length > 0 ? assignee.map(t => t.id).includes(f["userID"]) : true) && (faultMode.length > 0 ? faultMode.map(t => t.id).includes(f["faultModeID"]) : true) && (instrumentStatus ?(instrumentStatus === f.instID):true));
            }
            if(((priorityCheck && priority.length) || (assetTypeCheck && assetType.length) || (zoneCheck && zone.length) || (assigneeCheck && assignee.length) || (faultModeCheck && faultMode.length) || instrumentStatusCheck || isOnline || isOffline || isConnectivity) && type === "status"){
                filteredTaskList = filteredTaskList.filter(f =>(priority.length > 0 ? priority.map(t => t.id).includes(f["priority"]) : true)   && (zone.length === 0 || assetIds.includes(f.entityId.id)) && (assetType.length === 0 || assetType.some((asset) => asset.name === f.entityId.asset_type.name)) && (assignee.length > 0 ? assignee.map(t => t.id).includes(f["userID"]) : true) && (faultMode.length > 0 ?  faultMode.map(t => t.id).includes(f["faultModeID"]): true) && (instrumentStatus ?(instrumentStatus === f.instID):true));
            }
            if(((priorityCheck && priority.length) || (assetTypeCheck && assetType.length) || (zoneCheck && zone.length) || (taskTypeCheck && taskType.length) || (faultModeCheck && faultMode.length) || instrumentStatusCheck || isOnline || isOffline || isConnectivity) && type === "userID"){
                filteredTaskList = filteredTaskList.filter(f => (priority.length > 0 ? priority.map(t => t.id).includes(f["priority"]) : true)   && (zone.length === 0 || assetIds.includes(f.entityId.id)) && (assetType.length === 0 || assetType.some((asset) => asset.name === f.entityId.asset_type.name)) && (taskType.length > 0?taskType.map(t => t.id).includes(f["status"]):true) &&(faultMode.length > 0 ?  faultMode.map(t => t.id).includes(f["faultModeID"]): true) && (instrumentStatus ?(instrumentStatus === f.instID):true));
            }
            if(((priorityCheck && priority.length) || (assetTypeCheck && assetType.length) || (zoneCheck && zone.length) || (taskTypeCheck && taskType.length) || (assigneeCheck && assignee.length)  || instrumentStatusCheck || isOnline || isOffline || isConnectivity) && type === "faultModeID"){
                filteredTaskList = filteredTaskList.filter(f => (priority.length > 0 ? priority.map(t => t.id).includes(f["priority"]) : true)   && (zone.length === 0 || assetIds.includes(f.entityId.id)) && (assetType.length === 0 || assetType.some((asset) => asset.name === f.entityId.asset_type.name)) && (taskType.length > 0?taskType.map(t => t.id).includes(f["status"]):true) && (assignee.length > 0 ? assignee.map(t => t.id).includes(f["userID"]) : true) && (instrumentStatus ?(instrumentStatus === f.instID):true));
            }
            if(((priorityCheck && priority.length) || (assetTypeCheck && assetType.length) || (zoneCheck && zone.length) || (taskTypeCheck && taskType.length) || (assigneeCheck && assignee.length) || faultModeCheck || isOnline || isOffline || isConnectivity) && type === "instID"){
            filteredTaskList = filteredTaskList.filter(f => (priority.length > 0 ? priority.map(t => t.id).includes(f["priority"]) : true)  && (zone.length === 0 || assetIds.includes(f.entityId.id)) && (assetType.length === 0 || assetType.some((asset) => asset.name === f.entityId.asset_type.name)) && (taskType.length > 0?taskType.map(t => t.id).includes(f["status"]):true) && (assignee.length > 0 ? assignee.map(t => t.id).includes(f["userID"]) : true) && (faultMode.length > 0 ?  faultMode.map(t => t.id).includes(f["faultModeID"]): true));  
            }    
            if (((priorityCheck && priority.length) || (zoneCheck && zone.length) || (taskTypeCheck && taskType.length) || instrumentStatusCheck || (assigneeCheck && assignee.length) || (faultModeCheck && faultMode.length) || isOnline || isOffline || isConnectivity) && type === "assettype") {
                    const matchesFilters = (task) =>
                        (!taskType.length || taskType.some((t) => t.id === task["status"])) &&
                        (!assignee.length || assignee.some((t) => t.id === task["userID"])) &&
                        (!faultMode.length || faultMode.some((t) => t.id === task["faultModeID"])) &&
                        (!instrumentStatus || instrumentStatus === task.instID) &&
                        (!priority.length || priority.some((t) => t.id === task["priority"])) &&
                        (zone.length === 0 || assetIds.includes(task.entityId.id)) &&
                        (e.length === 0 || e.some((asset) => asset.name === task.entityId.asset_type.name));
                
                    filteredTaskList = (filteredTaskList?.length > 0 && filteredTaskList).filter(matchesFilters);
            }                           
            if (((priorityCheck && priority.length) || (assetTypeCheck && assetType.length) || (taskTypeCheck && taskType.length) || instrumentStatusCheck || (assigneeCheck && assignee.length) || (faultModeCheck && faultMode.length) || isOnline || isOffline || isConnectivity) && type === "zone") {
                    const matchesFilters = (task) =>
                        (!taskType.length || taskType.some((t) => t.id === task["status"])) &&
                        (!assignee.length || assignee.some((t) => t.id === task["userID"])) &&
                        (!faultMode.length || faultMode.some((t) => t.id === task["faultModeID"])) &&
                        (!instrumentStatus || instrumentStatus === task.instID) &&
                        (!priority.length || priority.some((t) => t.id === task["priority"])) &&
                        (assetType.length === 0 || assetType.some((asset) => asset.name === task.entityId.asset_type.name)) &&
                        (e.length === 0 || assetIds.includes(task.entityId.id));
                
                    filteredTaskList = (filteredTaskList?.length > 0 && filteredTaskList).filter(matchesFilters);
            }                                          

            if(type === "online"){
            filteredTaskList = filteredTaskList.filter(f => (taskType.length > 0 ? taskType.map(t => t.id).includes(f["status"]) : true) && (assignee.length > 0 ? assignee.map(t => t.id).includes(f["userID"]) : true) && (faultMode.length > 0 ? faultMode.map(t => t.id).includes(f["faultModeID"]) : true) && (instrumentStatus ? (instrumentStatus === f.instID) : true) && (priority.length > 0 ? priority.map(t => t.id).includes(f["priority"]) : true))
            }
        
            if(type === "offline"){
                filteredTaskList = filteredTaskList.filter(f => (taskType.length > 0 ? taskType.map(t => t.id).includes(f["status"]) : true) && (assignee.length > 0 ? assignee.map(t => t.id).includes(f["userID"]) : true) && (faultMode.length > 0 ? faultMode.map(t => t.id).includes(f["faultModeID"]) : true) && (instrumentStatus ? (instrumentStatus === f.instID) : true) && (priority.length > 0 ? priority.map(t => t.id).includes(f["priority"]) : true))
                }

                setTempTaskList(filteredTaskList);  
                let new_count = count ? count : countVal
                let filteredStatusList= new_count.map( c=> {
                    return {...c,count: filteredTaskList.filter(f=>f.status === c.status).length.toString()}
                })

        if(type === "status" || type === "tasks" || type === "insType" ){
                 
        filteredStatusList= e.length > 0 ? filteredStatusList.filter(p => e.map(t => t.id).includes(p["status"])) : filteredStatusList 
            
        filteredStatusList= e.length > 0 ? filteredStatusList.filter(p => e.map(t => t.id).includes(p["status"])) : filteredStatusList 
            
        
        }else{
            if(taskType.length){
                filteredStatusList= taskType.length > 0 ? filteredStatusList.filter(p => taskType.map(t => t.id).includes(p["status"])) : filteredStatusList 
            }
        }
        setTempCountVal(filteredStatusList)
        setLoading(false);
    }
}
            
    const clearSearch = () => {
        setSearch('');
        setInput(true)
    }
    const updateSearch = (e) => {
        setSearch(e.target.value);
    }
    function getPriority(val){
        
        if(val === 11){
           return "Medium"
        }
       
        else if(val === 12){
            return "High"
        }
        else if(val === 14){
            return "Low"
        }
        else if(val === 17){
            return "NA"
        }
        else{
            return "NA"
        }
    }
    function getColorCode(val){
        if(val === 11){
            return "warning02-alt"
         }
        
         else if(val === 12){
             return "error-alt"
         }
         else if(val === 14){
             return "warning01-alt"
         }
         else{
             return "success-alt"
         }
    }
    function getStatusCode(val){
        if(val === 1){
            return "Not Assigned"
         }
         else if(val === 3){
             return "Completed"
         }
         else if(val === 5){        
             return "Planned"
         }
         else if(val === 16){
             return "Assigned"
         }
         else if(val === 21){
             return "No Action Required"
         }
         
    } 
    const handleClickCard = () => {
        OverdueRef.current.handleOverDialog() 
    } 

    const isAnyOptionChecked = popperOverallOption.some(option => option.checked);

        return (
           <React.Fragment>
            <div style={{display: page === "Overview" ? 'block' : 'none'}} >
                  {loading && <LoadingScreenNDL />}
                  <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-b border-Border-border-50 dark:border-Border-border-dark-50" >
                  <Grid container style={{ zIndex: '20',padding: "8px 16px 8px 16px",width: "100%",alignItems:"center", display: "flex",}}>
                  <Grid item style={{ flex: "0 0 auto" }}>
                  <Typography variant="heading-02-xs">{t("tasks")}</Typography>
  </Grid>

  <Grid
    item
    style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginLeft: "auto", 
    }}
  >
    <Button type={"ghost"} icon={Filter} onClick={handleOverallClick} >
        </Button>
        <ListNDL 
                                    options={popperOverallOption}  
                                    Open={Overallopen} 
                                    optionChange={(e,data)=>optionOverallChange(e,data)}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    id={"popper-Parts"}
                                    onclose={handleOverallClose}
                                    anchorEl={anchorOvEl}
                                    width="200px"
                                    multiple={true}
                                />
    <div
      style={{
        minWidth: "260px", 
      
      }}
    >
      <TaskDateRange />
    </div>
  </Grid>
</Grid>
                  </div>
                

                  {(overalltaskTypeCheck || overallInsType) && (
                <Grid
  container className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'
   style={{
     padding: "8px 8px"
  }}
>
  {overalltaskTypeCheck && (
    <Grid item sm={2} md={2} style={{ paddingRight: '8px' }}>
      <Select
        labelId="hierarchyView"
        id="hierarchy-condition"
        value={filtertype}
        options={[
          { id: 'All', status_type: 'All' },
          { id: 'Online', status_type: 'Online' },
          { id: 'Offline', status_type: 'Offline' },
          { id: 'Connectivity', status_type: 'Connectivity' },
        ]}
        placeholder={"Select Type"}
        onChange={(e) => { TagFilter(e.target.value) }}
        multiple={false}
        isMArray={true}
        auto
        keyValue={"status_type"}
        keyId="id"
      />
    </Grid>
  )}

  {overallInsType && (
    <>
      <Grid item xs={2}  style={{ paddingRight: '8px' }}>
        <Select
          labelId="hierarchyView"
          id="hierarchy-condition"
          value={category}
          options={
            !InstrumentCategoryListLoading &&
            !InstrumentCategoryListError &&
            InstrumentCategoryListData &&
            InstrumentCategoryListData.length > 0
              ? InstrumentCategoryListData
            
              : []
          }
          placeholder={"Select Instrument Category"}
          onChange={(e) => FilterByStatus(e, "inscat")}
          selectAllText={"Select All"}
          isMArray={true}
          auto
          keyValue={"name"}
          keyId="id"
        />
      </Grid>

      <Grid item sm={2} md={2} >
        <Select
          labelId="hierarchyView"
          id="hierarchy-condition"
          value={cattype}
          options={
            !InstrumentTypeListLoading &&
            !InstrumentTypeListError &&
            InstrumentTypeListData &&
            InstrumentTypeListData.length > 0
              ? InstrumentTypeListData
           
              : []
          }
          placeholder={"Select Instrument Type"}
          onChange={(e) => FilterByStatus(e, "cattype")}
          multiple={true}
          selectAll={true}
          selectAllText={"Select All"}
          isMArray={true}
          auto
          keyValue={"name"}
          keyId="id"
        />
      </Grid>
    </>
  )}
</Grid>
 )}
{isAnyOptionChecked === true &&
        <HorizontalLine variant="divider1" /> 
}
            <div className='p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark '>
                <Grid container spacing={4}>
               
                                                            <Grid item xs={12} sm={3}>
                                                                      <div className='flex flex-col gap-4 '>
                                                                        <KpiCards style={{height:"158px"}}>
                                                                        <div style={{
                                                                          height: "100%"
                                                                      }}>
                                                                        <div className='flex items-center justify-between mb-1'>
                                                                            <div>
                                                                            <Typography variant="label-01-s" color='secondary' value='Task' />
                                                                            <Typography variant="label-01-s" color='secondary' value='Overview' />
                                                                            </div>
                                                                            <TaskIcon  />
                                                                      
                                                                        </div>
                                                                       
                                                                        <Typography mono  variant="display-lg">
                                                                                    {taskData && taskData.length}
                                                                        </Typography>
                                                                        <div className='flex justify-between items-center w-full'>
                                                                        <div className='flex flex-col gap-0.5'>
                                                                            <Typography variant="paragraph-xs" color='secondary'>Completed</Typography>
                                                                            <Typography mono variant="paragraph-xs">{closedTaskData}</Typography>
                                                                        </div>
                                                                        <div className='flex flex-col gap-0.5'>
                                                                            <Typography variant="paragraph-xs" color='secondary'>Open</Typography>
                                                                            <Typography mono variant="paragraph-xs">{openTaskData}</Typography>
                                                                        </div>
                                                                       
                                                                        <div className='flex flex-col gap-0.5'>
                                                                            <Typography variant="paragraph-xs" color='secondary'>Completion</Typography>
                                                                            <Typography mono variant="paragraph-xs">{closedTaskPercent + '%'}</Typography>
                                                                        </div>
                                                                    </div>
                                                                        </div>
                                                                        </KpiCards>
        
                                                                        <KpiCards style={{height:"158px"}} onClick={handleClickCard}>
                                                                        <div style={{
                                                                          height: "100%",
                                                                          cursor:"pointer"
                                                                      }}>
                                                                        <div className='flex justify-between items-center mb-1'>
                                                                            <div>
                                                                            <Typography variant="label-01-s" color='secondary' value='Overdue' />
                                                                            <Typography variant="label-01-s" color='secondary' value='Tasks' />
                                                                            </div>
                                                                            <OverDueTask />
                                                                        </div>
                                                                        

                                                                        <Typography  mono  variant="display-lg">
                                                                                    {dueDateExpiredList.length}
                                                                        </Typography>
                                                                        <div className='flex gap-0.5  flex-col'>
                                                                        <Typography variant="paragraph-xs" color='secondary'>
                                                                                   More than 60 days
                                                                        </Typography>
                                                                        <Typography variant="paragraph-xs" mono>
                                                                                    {expiredTaskGT60}
                                                                        </Typography>
                                                                        </div>
                                                                    
                                                                                    </div>
                                                                        </KpiCards>
                                                                      
                                                                     </div>
        
                                                                
                                                                </Grid>
                                                               
                                                            
                                                                
                                                           
                                                                <Grid item xs={12} sm={4}>
                                                                <KpiCards style={{height:"332px"}}>
                                                                <div className="flex items-center justify-between py-1">
                                                                {chartselected === "tile" && (
                                                                    <Typography variant="heading-01-s" color="secondary" value="Task Status Overview" />
                                                                )}
                                                                 {chartselected === "table" && (
                                                                    <Typography variant="heading-01-s" color="secondary" value="CFM Status Overview" />
                                                                )}
                                                                {airleakdatapresent &&
                                                                    <div className="flex items-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark rounded-lg w-fit">
                                                                        <button
                                                                            className={`flex items-center justify-center px-2 py-1 transition ${
                                                                                chartselected === "tile" ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm" : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                                                            } rounded-md`}
                                                                            onClick={() => handleChartSwitch("tile")}
                                                                        >
                                                                            <Typography value="Status" stroke={chartselected === "tile" ? (currTheme === "dark" ? "#FFFFFF" : "#202020") : "#646464"} />
                                                                        </button>
                                                                        <button
                                                                            className={`flex items-center justify-center px-2 py-1 transition ${
                                                                                chartselected === "table" ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm" : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                                                            } rounded-md`}
                                                                            onClick={() => handleChartSwitch("table")}
                                                                        >
                                                                            <Typography value="CFM" stroke={chartselected === "table" ? (currTheme === "dark" ? "#FFFFFF" : "#202020") : "#646464"} />
                                                                        </button>
                                                                    </div>
                                                                }
                                                                </div>
                                                                      
                                                                      {chartselected === "tile" && (
                                                                            <div className="py-2">
                                                                                {dataPrior.some(val => val.data !== 0) ? (
                                                                                    <div className="flex items-center justify-center">
                                                                                        <PriorityBreakDown data={dataPrior} />
                                                                                    </div>
                                                                                ) : (
                                                                                    <Typography value="No Data" variant="paragraph-s" />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {chartselected === "table" && (
                                                                            <div className="py-2 pt-8">
                                                                                {airleaktask.some(val => val.count !== 0) ? (
                                                                                    <div className="flex items-center justify-center">
                                                                                         <div className="flex">
                                                                                            <div className="width-[212px] height-[212px]">
                                                                                                <Bar
                                                                                                height={212}
                                                                                                id={"donut"}
                                                                                                type={"donut"}
                                                                                                data={airleaktask}
                                                                                                showLegend={false}
                                                                                                colors={["#8E4EC6", "#3E63DD"]}
                                                                                            />
                                                                                            </div>

                                                                                            <div className="flex flex-col gap-8 ">
                                                                                                <div className="flex flex-col  gap-1">
                                                                                                    <Typography variant="label-01-xs"  color="secondary">
                                                                                                        Total
                                                                                                        </Typography>
                                                                                                    <Typography  style={{marginTop:"4px"}}variant="label-02-xl" mono>{totalairleakcount}</Typography>
                                                                                                </div>
                                                                                                <div className="flex flex-col  gap-1">
                                                                                                    <Typography variant="label-01-xs"  color="secondary">
                                                                                                        Completed
                                                                                                        </Typography>
                                                                                                    <Typography  variant="label-02-xl" style={{marginTop:"4px"}} mono>{closeCount}</Typography>
                                                                                                </div>
                                                                                                <div className="flex flex-col gap-1">
                                                                                                    <Typography variant="label-01-xs"  color="secondary">  
                                                                                                        Pending
                                                                                                        </Typography>
                                                                                                    <Typography variant="label-02-xl" mono>{openCount}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <Typography value="No Data" variant="paragraph-s" />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        </KpiCards>
                                                                        <OverDueModal 
                                                                            dueDateExpiredList={dueDateExpiredList}
                                                                            ref={OverdueRef}
                                                                            DueDateExpiredList={(val)=>setDueDateExpiredList(val)}
                                                                            handleSendReminder={(data)=>handleSendReminder(data)}
                                                                        />
        
                                                                </Grid>     
                                                                <Grid item xs={12} sm={5}>
                                                                <KpiCards style={{height:"332px"}}>
                                                                <div className='py-1'>
                                                                <Typography variant="heading-01-s" color='secondary' value='Fault Status Overview' />
                                                                </div>
    
                                                                        {(percentagesArray.length>0) ? 
                                                                        
                                        <div  style={{ height: "calc(100% - 40px)" }}  className="overflow-auto py-2"> 
                                            <div  className="pr-8">
                                                <FaultStatusOverview data={percentagesArray} names={nameArr} />
                                            </div> 
                                        </div>
                                        :<Typography value="No Data" variant='paragraph-s' />
                                                                        
                                                                                }
                                                                                
        
                                                                        </KpiCards>
        
        
                                                                </Grid>
                                                                
                </Grid>
                </div>
                <div className='flex items-center justify-between px-4 py-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
                            <div style={{display: "flex "}}>
                                {selected === "tile"&&
                            <Typography value="Tasks Board"variant="heading-02-xs"/> }
                              {selected === "table" &&
                            <Typography value="Tasks Table"variant="heading-02-xs"/> }
                            </div>
                            <div style={{display: 'flex' , alignItems: "center", gap: "8px" }}>
                           
                            {selected === "tile" && (
                                <div className="flex justify-between items-center">
                                    <div>
                                    <ClickAwayListener onClickAway={clickAwaySearch}>
                                        {input ? (
                                        <InputFieldNDL
                                            autoFocus
                                            id="Table-search"
                                            placeholder={t("Search")}
                                            size="small"
                                            value={search}
                                            type="text"
                                            onChange={(e) => updateSearch(e)}
                                            disableUnderline={true}
                                            startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} />}
                                            endAdornment={search !== '' && <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} onClick={clearSearch} />}
                                        />
                                        ) : (
                                        <div className='pt-2'>
                                        <Button type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />
                                        </div>
                                        )}
                                    </ClickAwayListener>
                                    </div>

                                    <Button
                                    type={"ghost"}
                                    icon={Download}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDownloadTasks(tempTaskListSorted)}
                                    />
                                </div>
                                )}               
                          
                          <Button
                                type={'ghost'}
                                icon={Filter}
                                onClick={handleClick}>
                                </Button>
                                <ListNDL 
                                    options={popperOption}  
                                    Open={open} 
                                    optionChange={(e,data)=>optionChange(e,data)}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    id={"popper-Parts"}
                                    onclose={handleClose}
                                    anchorEl={anchorEl}
                                    width="200px"
                                    multiple={true}
                                />
                          
                              
                                
                                <Button
                                type={'ghost'}
                                icon={Upload}
                                onClick={handleTask}>
                                </Button>
                                
                            {/* <Download stroke="#0F6FFF" style={{ float: "right", cursor: "pointer" }} onClick={handleTask} /> */}
                            <ListNDL
                                    options={AddOption}
                                    Open={openList}
                                    optionChange={(e)=>optionChangeTask(e,'create')}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    id={"popper-Alarm-add"}
                                    onclose={handleCloseTask}
                                    anchorEl={notificationAnchorEl}
                                    width="150px"
                                />
                                 <div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  rounded-lg">
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                 selected === "tile" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleSwitch("tile")}
                                           >
                                               <TileIcon stroke={selected === "tile" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                 selected === "table" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleSwitch("table")}
                                           >
                                              <TableIcon stroke={selected === "table" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           </div>
                                <Button
                                        type={"tertiary"}
                                        value={"New Task"}
                                        icon={Plus}
                                        onClick={handleCreateTask}></Button>
                                        </div>
                            
                                
                            
                        </div>
                        {
                          (priorityCheck ||   taskTypeCheck || assigneeCheck || faultModeCheck || instrumentStatusCheck || assetTypeCheck || zoneCheck) && 

                          (
                            <div className='flex   px-4 py-2 gap-4'>
                                {priorityCheck &&
                                <div style={{width:'200px' }}>
                                    <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={priority}
                                    options={!PriorityListLoading && !PriorityListError && PriorityListData && PriorityListData.length > 0 ? PriorityListData : []}
                                    placeholder={'Select Priority'}
                                    onChange={(e) => FilterByStatus(e, "priority")}
                                    multiple={true}
                                    selectAll  ={true}
                                    selectAllText={"Select All"}
                                    isMArray={true}
                                    auto
                                    keyValue={"task_level"}
                                    keyId="id"
                                    />
                                </div>
                                }
                                {assetTypeCheck && 
                                <div style={{width:'200px' }}>
                                <Select
                                labelId="hierarchyView"
                                id="hierarchy-condition"
                                value={assetType}
                                options={!AssetTypeLoading && !AssetTypeError && AssetTypeData && AssetTypeData.length > 0 ? AssetTypeData : []}
                                placeholder={'Select Asset Type'}
                                onChange={(e) => FilterByStatus(e, "assettype")}
                                multiple={true}
                                selectAll  ={true}
                                selectAllText={"Select All"}
                                isMArray={true}
                                auto
                                keyValue={"name"}
                                keyId="id"
                                />
                                 </div>
                                }
                                {zoneCheck &&
                                 <div style={{width:'200px' }}>
                                 <Select
                                 labelId="hierarchyView"
                                 id="hierarchy-condition"
                                 value={zone}
                                 options={!zoneByLineLoading && !zoneByLineError && zoneByLineData && zoneByLineData.length > 0 ? zoneByLineData : []}
                                 placeholder={'Select Zone'}
                                 onChange={(e) => FilterByStatus(e, "zone")}
                                 multiple={true}
                                 selectAll  ={true}
                                 selectAllText={"Select All"}
                                 isMArray={true}
                                 auto
                                 keyValue={"name"}
                                 keyId="id"
                                 />
                                  </div>
                                }
                                {taskTypeCheck &&
                                <div style={{width:'200px' }}>
                                    <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={taskType}
                                    options={!StatusListLoading && !StatusListError && StatusListData && StatusListData.length > 0 ? StatusListData : []}
                                    placeholder={'Select Task Type'}
                                    onChange={(e) => FilterByStatus(e, "status")}
                                    multiple={true}
                                    selectAll  ={true}
                                    selectAllText={"Select All"}
                                    isMArray={true}
                                    auto
                                    keyValue={"status"}
                                    keyId="id"
                                    />
                                </div>
                                }
                                {assigneeCheck &&
                                <div style={{width:'250px' }}>
                                    <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={assignee}
                                    options={UserOption}
                                    placeholder={'Select Assignee'}
                                    onChange={(e) => FilterByStatus(e, "userID")}
                                    multiple={true}
                                    isMArray={true}
                                    selectAll  ={true}
                                    selectAllText={"Select All"}
                                    auto
                                    keyValue={"name"}
                                    keyId="id"
                                    />
                                </div>
                                }
                                {faultModeCheck &&
                                <div style={{width:'250px' }}>
                                    <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={faultMode}
                                    options={!SuspectFaultListLoading && SuspectFaultListData && !SuspectFaultListError && SuspectFaultListData.length > 0 ? SuspectFaultListData : []} 
                                    placeholder={'Select Fault Mode'}
                                    onChange={(e) => FilterByStatus(e, "faultModeID")}
                                    multiple={true}
                                    selectAll  ={true}
                                    selectAllText={"Select All"}
                                    isMArray={true}
                                    auto
                                    keyValue="name"
                                    keyId="id"
                                    />
                                </div>
                                }
                                {instrumentStatusCheck &&
                                <div style={{ width:'250px' }}>
                                    <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={instrumentStatus}
                                    options={!InstrumentStatusLoading && !InstrumentStatusError && InstrumentStatusData && InstrumentStatusData.length > 0 ? InstrumentStatusData : []} 
                                    placeholder={'Select Instrument Status'}
                                    onChange={(e) => FilterByStatus(e, "instID")}
                                    multiple={false}
                                    isMArray={true}
                                    auto
                                    keyValue={"status_type"} 
                                    keyId="id"
                                    />
                                </div>
                                } 
                        </div>
                          )
                        }
                       
                {selected === "tile" &&
                 <div className=" flex w-full overflow-x-auto gap-4 p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark " >
                    
                {tempCountVal.map((statusVal,index) => (
               <div key={index+1}> 
                    <div key={statusVal.status} >
                    <KpiCards  style={{padding:0,borderRadius:'12px',width:"477px"}}>
                        <div className='h-14 ' >
                        <Typography variant="heading-02-xs">
                                <div className='flex items-center h-14 p-4 '>
                                    <div className='flex items-center gap-2 w-[88%]'>
                                    <Typography variant="label-02-lg">{getStatusCode(statusVal.status)}</Typography>
                                  
            <span className="bg-Neutral-neutral-base-alt dark:bg-Neutral-neutral-base-alt-dark min-w-[33px] text-Neutral-neutral-text-alt dark:text-Neutral-neutral-text-alt-dark  px-2 text-center py-1 font-geist-mono font-normal rounded-[12px] text-[14px] leading-[16px]">
            {statusVal.count}
                </span>
                                
                                    </div>
                                  
                                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                                   {statusVal.status in sortOrders && sortOrders[statusVal.status] === 'Ascending' ? (
                                            <SortAscending stroke={currTheme === 'dark' ? "#eeeeee" :"#202020"} onClick={() => toggleSortOrder(statusVal.status)} style={{ cursor: "pointer" }} />
                                        ) : (
                                            <SortDescending stroke={currTheme === 'dark' ? "#eeeeee" :"#202020"} onClick={() => toggleSortOrder(statusVal.status)} style={{ cursor: "pointer" }} />
                                        )}
                                    </div>
                                </div>
                            </Typography>
                        </div>
                       
                        <div style={{borderEndStartRadius:"12px",borderEndEndRadius:"12px"}} className='h-[760px] overflow-y-auto p-2 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark ' >
                        {tempTaskListSorted.map(task => {
                            if (task.status === statusVal.status && task.title.toLowerCase().includes(search.toLowerCase())) {
                                let modifiedTitle = task.title;
                                if (task.taskType.id === 27) {
                                    const onIndex = task.title.indexOf(" On ");
                                    if (onIndex !== -1) {
                                        modifiedTitle = task.title.substring(0, onIndex);
                                    }
                                }

                                return (
                                    <div className='flex flex-col mb-2 gap-4 ' key={task.id}>
                                        <KpiCards style={{ height: "auto" }} onClick={() => optionChangeTask("edit", task)}>
                                        <div className='mb-1' style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography mono variant="paragraph-xs">
                                                {"#" + task.task_id}
                                            </Typography>
                                            <Typography mono variant="paragraph-xs">
                                                {moment(task.reported_date).format('DD/MM/YYYY')}
                                            </Typography>
                                        </div>
                                            <Typography variant="label-02-s">
                                                <span className='hover:underline hover:text-interact-accent-hover cursor-pointer'>{modifiedTitle}</span>
                                            </Typography>
                                            <Typography variant="paragraph-xs">
                                                {task?.faultModeByFaultMode?.name}
                                            </Typography>
                                            <div className='flex flex-row gap-2' style={{ marginTop: "8px" }}>
                                                
                                                <TagNDL
                                                lessHeight
                                                    name={
                                                        task.taskType.task_type 
                                                    }
                                                    colorbg={"neutral"}
                                                    // style={{ backgroundColor: "#F0F0F0" }}
                                                     />
                                                <Status
                                                lessHeight
                                                    name={
                                                        getPriority(task.priority)
                                                    }
                                                    colorbg={getColorCode(task.priority)}
                                                    // style={{ backgroundColor: getColorCode(task.priority), color: "white" }}
                                                     />
                                            </div>
                                            <div className='flex flex-row gap-1' style={{ marginTop: "8px" }}>
                                                <TaskUser />
                                                <Typography color='secondary' variant="paragraph-s">{task.userByAssignedFor ? task.userByAssignedFor.name : ''}</Typography>
                                            </div>
                                        </KpiCards>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                      </div>  
                    </KpiCards>
                    </div> 
                </div>
                ))} 
                    </div>       
                }
                { selected === "table" &&
                <div className='p-4'>
 <EnhancedTable
                heading={'Task Details'}
                headCells={headCells}
                data={tabledata}
                rawdata={rawtabledata}
                search={true}
                download={true}  
                rowSelect={true}  
                checkBoxId={"SNo"}
                verticalMenu={true}    
                tasktable={true}
                groupBy={'alert_table'}     
                defaultvisibleColumn
                enableview={true}    
                actionenabled={true}
                handleview={(id, value) => optionChangeTask("edit", value)}
                tagKey={["Severity", "Status"]}              
                />
                </div>
               
                }
            
            <TaskFileUploadModel handleTask={handleTask} getTaskList={() => changeSection('Overview')} ref={fileUploadRef} />
            <TaskImageUploadModel handleTask={handleTask} getTaskList={() => changeSection('Overview')} ref={ImageUploadRef} />
            </div>
    
            <div style={{display: (page === "New Task" || moduleName === 'newtask') ? 'block' : 'none'}}> 
                {(page === "New Task" || moduleName === 'newtask') &&
                  <TaskForm ref={formRef} changeSec={changeSection} section={section} filtertype={setfiltertype} taskListData={TaskListData}/>}
            </div>
            </React.Fragment> 
           ) 
 
}

export default NewTask
