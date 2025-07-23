import React, { useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";
import useTheme from 'TailwindTheme';
import moment from 'moment';
import Grid from "components/Core/GridNDL";
import Charts from "./EnergyDashboard/components/ChartJS/Chart";
import KpiCardsNDL from "components/Core/KPICards/KpiCardsNDL"
import Typography from "components/Core/Typography/TypographyNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import { selectedPlant, CMSDashboardRange } from "recoilStore/atoms"; // Recoil variables 
import useInstrumentType from "Hooks/useInstrumentType";
import useGetAllTaskListByRange from "./hooks/useGetAllTaskListByRange";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from "components/Core/ButtonNDL";
import Tag from "components/Core/Tags/TagNDL";
import useGetEntityAssetByCategory from "./hooks/useGetEntityAssetByCategory";
import useTaskStatus from "components/layouts/Tasks/hooks/useTaskStatus";
import useGetAllTaskBySpecificRange from "./hooks/useGetAllTaskBySpecificRange";
import useGetTaskOpenGT3M from "./hooks/useGetTaskOpenGT3M";
import useGetHighPriorityAssetGT1M from "./hooks/useGetHighPriorityAssetGT1M";
import html2canvas from 'html2canvas';   
export default function CmsDashboard(props) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [headPlant] = useRecoilState(selectedPlant);
    const [taskStatusPieData, setTaskStatusPieData] = useState({ label: [], Data: [], BGcolor: [] })
    const [assetTypePieData, setAssetTypePieData] = useState({ label: [], Data: [], BGcolor: [] })
    const [CmsDashboardRange] = useRecoilState(CMSDashboardRange);
    const [loadingpanel, setLoadingPanel] = useState(false);
    const [overAllTasks, setOverAllTasks] = useState();
    const [closedTasks, setClosedTasks] = useState();
    const [openTasks, setOpenTasks] = useState();
    const [last3MonthsOverAllTasks, setLast3MonthsOverAllTasks] = useState();
    const [last3MonthsClosedTasks, setLast3MonthsClosedTasks] = useState();
    const [currMonthOverAllTasks, setCurrMonthOverAllTasks] = useState();
    const [closedTaskPercentage, setClosedTaskPercentage] = useState();
    const [openTaskPercentage, setOpenTaskPercentage] = useState();
    const [highPriorityPercentage, setHighPriorityPercentage] = useState();
    const [highPriorityAsset, setHighPriorityAsset] = useState();
    const [taskOpenGT3MCount, setTaskOpenGT3MCount] = useState(0);
    const [highPriorityGT1MCount, setHighPriorityGT1MCount] = useState(0);
    const [offlineTypesData, setOfflineTypesData] = useState([]);
    const [taskStatusList, setTaskStatusList] = useState([]);  
    const [taskListData, setTaskListData] = useState([]);
    const [highPriorityAssetData, sethighPriorityAssetData] = useState([]);
    const [taskStatusListSpecific, setTaskStatusListSpecific] = useState([]);
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType();
    const { TaskListByRangeLoading, TaskListByRangeData, TaskListByRangeError, getAllTaskListByRange } = useGetAllTaskListByRange();
    const [HighPriorityDialog, setHighPriorityDialog] = useState(false);
    const { entityAssetByCategoryLoading, entityAssetByCategoryData, entityAssetByCategoryError, getEntityAssetByCategory } = useGetEntityAssetByCategory();
    const { StatusListLoading, StatusListData, StatusListError, getStatusList } = useTaskStatus();
    const { TaskBySpecificRangeLoading, TaskBySpecificRangeData, TaskBySpecificRangeError, getAllTaskBySpecificRange } = useGetAllTaskBySpecificRange();
    const { TaskOpenGT3MLoading, TaskOpenGT3MData, TaskOpenGT3MError, getTaskOpenGT3M } = useGetTaskOpenGT3M();
    const { HighPriorityAssetGT1MLoading, HighPriorityAssetGT1MData, HighPriorityAssetGT1MError, getHighPriorityAssetGT1M } = useGetHighPriorityAssetGT1M();
     

    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight

    const COLORS = [
        "#5FDD74", "#F35E6F", "#FFE066", "#82BAF8", "#0D70DE", "#856A00",
        "#EF253C", "#25B13D", "#9A25EF", "#6E0EB4", "#E01FE0", "#751075",
        "#CF97F7", "#145D20", "#7B0916", "#854D00", "#073F7D",
        "#4C097B", "#ED78ED", "#FFB752",
    ];

    useEffect(() => {

        if (CmsDashboardRange.start !== null && CmsDashboardRange.end !== null) {
            setLoadingPanel(true);
            setTaskListData([]);
            setTaskStatusListSpecific([]);  
            setTaskOpenGT3MCount(0)
            setHighPriorityGT1MCount(0)
            setTaskStatusPieData({ label: [], Data: [], BGcolor: [] })
            setAssetTypePieData({ label: [], Data: [], BGcolor: [] })
            getInstrumentType(3); // Category is Health (id --3)
            getStatusList();

            let Last3MonthsStart = moment().subtract(3, 'month').startOf('month').startOf('day').format("YYYY-MM-DDTHH:mm:ss" + TZone);
            let before90Day = moment().subtract(90, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ss" + TZone);
            let before30Day = moment().subtract(30, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ss" + TZone);
            let currentDay = moment().format("YYYY-MM-DDTHH:mm:ss" + TZone);
            let fromDate = moment(CmsDashboardRange.start).startOf('month').format("YYYY-MM-DDTHH:mm:ss" + TZone);
            let toDate = moment(CmsDashboardRange.end).endOf('month').format("YYYY-MM-DDTHH:mm:ss" + TZone);
            getAllTaskListByRange(headPlant.id, fromDate, toDate)
            getAllTaskBySpecificRange(headPlant.id, Last3MonthsStart, currentDay)
            getEntityAssetByCategory(headPlant.id)
            getTaskOpenGT3M(headPlant.id, before90Day)
            getHighPriorityAssetGT1M(headPlant.id, before30Day)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant, CmsDashboardRange])

    useEffect(() => {
        if (!InstrumentTypeListLoading && InstrumentTypeListData && !InstrumentTypeListError) {
            setOfflineTypesData(InstrumentTypeListData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [InstrumentTypeListData])

    useEffect(() => {
        if (!StatusListLoading && StatusListData && !StatusListError) {
            setTaskStatusList(StatusListData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [StatusListData])

    useEffect(() => {
        if (!TaskOpenGT3MLoading && TaskOpenGT3MData && !TaskOpenGT3MError) {

            // eslint-disable-next-line array-callback-return
            let objSelectedTypeData = TaskOpenGT3MData.filter((x) =>
                x.instrument && x.instrument.instrumentTypeByInstrumentType && x.instrument.instrumentTypeByInstrumentType.id && props.selectedOfflineType.includes(x.instrument.instrumentTypeByInstrumentType.id)
            )

            let objTaskOpenGT3MData = objSelectedTypeData.length > 0 ? objSelectedTypeData.length : 0
            setTaskOpenGT3MCount(objTaskOpenGT3MData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskOpenGT3MData, props.selectedOfflineType])

    useEffect(() => {
        if (!HighPriorityAssetGT1MLoading && HighPriorityAssetGT1MData && !HighPriorityAssetGT1MError) {

            // eslint-disable-next-line array-callback-return
            let objSelectedTypeData = HighPriorityAssetGT1MData.filter((x) =>
                x.instrument && x.instrument.instrumentTypeByInstrumentType && x.instrument.instrumentTypeByInstrumentType.id && props.selectedOfflineType.includes(x.instrument.instrumentTypeByInstrumentType.id)
            )

            let objHighPriorityAssetGT1MData = objSelectedTypeData.length > 0 ? objSelectedTypeData.length : 0
            setHighPriorityGT1MCount(objHighPriorityAssetGT1MData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HighPriorityAssetGT1MData, props.selectedOfflineType])

    useEffect(() => {
        if (!TaskListByRangeLoading && !TaskListByRangeError && TaskListByRangeData) {

            // eslint-disable-next-line array-callback-return
            let objSelectedTypeData = TaskListByRangeData.filter((x) =>
                x.instrument && x.instrument.instrumentTypeByInstrumentType && x.instrument.instrumentTypeByInstrumentType.id && props.selectedOfflineType.includes(x.instrument.instrumentTypeByInstrumentType.id)
            )
            setTaskListData(objSelectedTypeData)
           
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskListByRangeData, props.selectedOfflineType])

    useEffect(() => {
        if (!TaskBySpecificRangeLoading && !TaskBySpecificRangeError && TaskBySpecificRangeData) {

            TaskBySpecificRangeData.sort((a, b) => new Date(b.created_ts) - new Date(a.created_ts));

            //eslint-disable-next-line array-callback-return
            let objSelectedTypeData = TaskBySpecificRangeData.filter((x) =>
                x.instrument && x.instrument.instrumentTypeByInstrumentType && x.instrument.instrumentTypeByInstrumentType.id && props.selectedOfflineType.includes(x.instrument.instrumentTypeByInstrumentType.id)
            )
            setTaskStatusListSpecific(objSelectedTypeData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskBySpecificRangeData, props.selectedOfflineType])

    useEffect(() => {

        let objOpenTask = taskListData.filter((x) => x.taskStatus.id !== 3 && x.taskStatus.id !== 21)
        let objClosedTask = taskListData.filter((x) => x.taskStatus.id === 3)
        let uniqueEntities = {};
        let objHighPriorityAsset = taskListData.filter((x) => {
            if (x.taskPriority.id === 12 && x.taskStatus.id !== 3 && x.taskStatus.id !== 21) {
                if (!uniqueEntities[x.entity_id]) {
                    uniqueEntities[x.entity_id] = true;
                    return true;
                }
            }
            return false;
        });
        let overAllTasksCount = taskListData.length > 0 ? taskListData.length : 0
        let closedTasksCount = objClosedTask.length > 0 ? objClosedTask.length : 0
        let openTaskCount = objOpenTask.length > 0 ? objOpenTask.length : 0
        let highPriorityAssetCount = objHighPriorityAsset.length > 0 ? objHighPriorityAsset.length : 0
        let objClosedTaskPercent = isNaN(closedTasksCount / overAllTasksCount) ? 0 : ((closedTasksCount / overAllTasksCount) * 100).toFixed(2)
        let objOpenTaskPercent = isNaN(openTaskCount / overAllTasksCount) ? 0 : ((openTaskCount / overAllTasksCount) * 100).toFixed(2)
        let objHighPriorityPercent = isNaN(highPriorityAssetCount / overAllTasksCount) ? 0 : ((highPriorityAssetCount / overAllTasksCount) * 100).toFixed(2)
        sethighPriorityAssetData(objHighPriorityAsset)
        setOverAllTasks(overAllTasksCount)
        setClosedTasks(closedTasksCount)
        setOpenTasks(openTaskCount)
        setHighPriorityAsset(highPriorityAssetCount)
        setClosedTaskPercentage(objClosedTaskPercent)
        setOpenTaskPercentage(objOpenTaskPercent)
        setHighPriorityPercentage(objHighPriorityPercent)


        let TaskType = []
        let TaskCount = []

        // eslint-disable-next-line array-callback-return
        taskStatusList.forEach((j) => {

            let objTaskTypeArr = taskListData.filter((x) => x.taskStatus.id === j.id)
            TaskType.push(j.status)
            TaskCount.push(objTaskTypeArr.length)
        })
        setTaskStatusPieData({ label: TaskType, Data: TaskCount, BGcolor: COLORS })

        let EntityDetails = taskListData.filter((x) => x.instrument_status_type && x.instrument_status_type.id).map((x) => ({ id: x.entityId.id, name: x.entityId.name }));

        let EntityData = EntityDetails.filter((obj, index) => { // Filter Unique Asset
            return index === EntityDetails.findIndex(o => obj.id === o.id);
        });

        let assetHealth = []
        for (let i of EntityData) {
            let objStatusID = 0
            let entity_Id = ""
            let task_Status = ""
            let observed_Date = ""

            let filteredAsset = taskListData.filter((x) => x.entityId.id === i.id)

            for (const asset of filteredAsset) {
                if (asset.instrument_status_type && asset.instrument_status_type.id > objStatusID) {
                    objStatusID = asset.instrument_status_type.id;
                    entity_Id = asset.entityId.id;
                    task_Status = asset.instrument_status_type.status_type;
                    observed_Date = asset.observed_date;
                }
            }
            assetHealth.push({ entityId: entity_Id, taskStatusID: objStatusID, taskStatus: task_Status, observedDate: observed_Date, taskCount: 1 })
        }

        assetHealth.sort((a, b) => new Date(b.observedDate) - new Date(a.observedDate));

        // Organize the data into month-wise categories
        const monthData = {};
        assetHealth.forEach(item => {
            const month = moment(item.observedDate).format("MMM-YY");
            if (!monthData[month]) {
                monthData[month] = { labels: [], criticalData: [], warningData: [], normalData: [] };
            }
            monthData[month].labels.push(item.observedDate);
            if (item.taskStatus === "Critical") {
                monthData[month].criticalData.push(item.taskCount);
                monthData[month].warningData.push(0); // Add 0 for warning if no warning data for the month
                monthData[month].normalData.push(0); // Add 0 for normal if no normal data for the month
            } else if (item.taskStatus === "Warning") {
                monthData[month].warningData.push(item.taskCount);
                monthData[month].criticalData.push(0); // Add 0 for critical if no critical data for the month
                monthData[month].normalData.push(0); // Add 0 for normal if no normal data for the month
            } else if (item.taskStatus === "Normal") {
                monthData[month].normalData.push(item.taskCount);
                monthData[month].criticalData.push(0); // Add 0 for critical if no critical data for the month
                monthData[month].warningData.push(0); // Add 0 for warning if no warning data for the month
            }
        });

        let labels = Object.keys(monthData)
        let datasets = [
            {
                label: 'Critical',
                backgroundColor: '#DA1E28', // Set the color for critical status
                data: Object.values(monthData).map(item => item.criticalData.reduce((acc, val) => acc + val, 0)),
                barThickness: 30, // Set the bar width for this dataset
            },
            {
                label: 'Warning',
                backgroundColor: '#FF815A', // Set the color for warning status
                data: Object.values(monthData).map(item => item.warningData.reduce((acc, val) => acc + val, 0)),
                barThickness: 30, // Set the bar width for this dataset
            },
            {
                label: 'Normal',
                backgroundColor: '#76A43D', // Set the color for normal status
                data: Object.values(monthData).map(item => item.normalData.reduce((acc, val) => acc + val, 0)),
                barThickness: 30, // Set the bar width for this dataset
            }
        ] 


        setLoadingPanel(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskListData])

    useEffect(() => {

        // Filter tasks for the current month based on observed_date
        const currentMonthTasks = taskStatusListSpecific.filter(task => {
            const observedDate = new Date(task.observed_date);
            const currentMonth = new Date().getMonth();
            return observedDate.getMonth() === currentMonth;
        });

        // Filter tasks for other months based on observed_date
        const otherMonthTasks = taskStatusListSpecific.filter(task => {
            const observedDate = new Date(task.observed_date);
            const currentMonth = new Date().getMonth();
            return observedDate.getMonth() !== currentMonth;
        });

        let last3MonthsClosedTaskslet = otherMonthTasks.filter((x) => x.taskStatus.id === 3)

        setLast3MonthsOverAllTasks(otherMonthTasks.length)
        setLast3MonthsClosedTasks(last3MonthsClosedTaskslet.length)
        setCurrMonthOverAllTasks(currentMonthTasks.length)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskStatusListSpecific])

    useEffect(() => {
        if (!entityAssetByCategoryLoading && !entityAssetByCategoryError && entityAssetByCategoryData) {

            let AssetType = []
            let AssetCount = []

            // eslint-disable-next-line array-callback-return
            let objOfflineTypesData = offlineTypesData.filter((x) => {
                return props.selectedOfflineType.includes(x.id)
            })

            // eslint-disable-next-line array-callback-return
            objOfflineTypesData.forEach((o) => {

                let objEntityAssetsType = entityAssetByCategoryData.filter((x) => {

                    return x.entity_instruments && x.entity_instruments.some((entityInstrument) => {
                        return (
                            entityInstrument.instrument &&
                            entityInstrument.instrument.instrumentTypeByInstrumentType &&
                            entityInstrument.instrument.instrumentTypeByInstrumentType.id &&
                            entityInstrument.instrument.instrumentTypeByInstrumentType.id === o.id
                        );
                    });

                })

                AssetType.push(o.name)
                AssetCount.push(objEntityAssetsType.length)
            })
            setAssetTypePieData({ label: AssetType, Data: AssetCount, BGcolor: COLORS })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityAssetByCategoryData, offlineTypesData, props.selectedOfflineType])


    function handleHighpriorityDialogClose() {
        setHighPriorityDialog(false)
    }

    function handleHighpriorityDialogOpen() {
        setHighPriorityDialog(true)
    }
    const downloadDivAsPNG = (charttype) => {
        const divElement = document.getElementById(charttype);
        let ChartTypeDownload = ''
        if(charttype === "stackedBar"){
            ChartTypeDownload = 'Asset Health Staus Evolution.png'
        }else if(charttype === "pie1"){
            ChartTypeDownload =  "Task Status - Campaignwise.png"
        }else{
            ChartTypeDownload = "Equipment Overview"
        }
        if (divElement) {
            html2canvas(divElement).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = ChartTypeDownload;
                link.href = imgData;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    };
     
    const renderPieChart = () =>{
        if(taskStatusPieData.Data.length ){
        return(
            < Charts
            charttype={"pie"}
            hidelegend={false}
            title={''}
            labels={taskStatusPieData.label}
            data={taskStatusPieData.Data}
            colors={taskStatusPieData.BGcolor}
        />
        )
        }else{
            return(
                <div className="flex justify-center">
            <Typography variant="heading-02-xs" value={t("No Data")} />
        </div>
            )

        }
    }

    const renderAssetTypePieChart =()=>{
        if(assetTypePieData.Data.length){
            return(
                <Charts
                charttype={"pie"}
                hidelegend={false}
                title={''}
                labels={assetTypePieData.label}
                data={assetTypePieData.Data}
                colors={assetTypePieData.BGcolor}
            />
            )

        }else{
            return(
                <div className="flex justify-center">
                                            <Typography variant="heading-02-xs" value={t("No Data")} />
                                        </div>
            )
        }
    }

    const renderhighPriorityAssetData = () => { //NOSONAR
        if (highPriorityAssetData.length > 0) {
                return (
                    highPriorityAssetData.map((x, index) => {
                        return(
                            <div key={x.entityId.name}  >
                            <KpiCardsNDL style={{ borderLeft: '5px solid #DA1E28', paddingLeft: '16px',marginBottom:"8px" }}>
                                <div className="flex items-center justify-between">
                                    <Typography variant="heading-02-xs" value={x.entityId.name} />
                                    <Tag style={{ color: "#FFFFFF", backgroundColor: "#DA1E28", width: "100px", textAlign: "-webkit-center" }} name={t("Severe")} />
                                </div>
    
                                <div className="flex items-baseline gap-2 py-2">
                                    <div className="flex-shrink-0 w-[150px]">
                                        <Typography className="whitespace-nowrap flex-shrink-0" variant="label-02-m" value={t("Analyst Remarks")} />
    
                                    </div>
    
                                    <div className="font-geist-sans text-[16px] font-normal">:</div>
                                    <div className="break-all">
                                        <Typography variant="lable-01-m" color={"secondary"} value={x.action_recommended} />
                                    </div>
    
                                </div>
    
                                <div className="flex items-baseline  gap-2 py-2">
                                    <div className="flex-shrink-0 w-[150px]">
                                        <Typography className="whitespace-nowrap" variant="label-02-m" value={t("Inspection Date")} />
                                    </div>
                                    <div className="font-geist-sans text-[16px] font-normal">:</div>
    
                                    <div className="whitespace-normal">
                                        <Typography variant="lable-01-m" color={"secondary"} value={moment(x.observed_date).format('DD/MM/YYYY')} />
                                    </div>
                                </div>
                            </KpiCardsNDL>
                        </div>
                        )
                   
                    }
                    )
                    )

            
            

        } else {
            return (
                <div style={{ marginBottom: '10px' }}>
                    <Typography
                        style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                        value={t("No Data")}>
                    </Typography>
                </div>
            )
        }
    }
    return (
        <React.Fragment>

            {loadingpanel ?
                <LoadingScreenNDL />
                :
                <React.Fragment>
                    <Grid container spacing={4} style={{ padding: "16px" }}>
                        <Grid item xs={3} >
                            <KpiCardsNDL style={{ height: "170px" }}  >
                            <div className='flex flex-col gap-1'>
                                                                            <Typography variant="label-01-s" color='secondary' value='Overall' />
                                                                            <Typography variant="label-01-s" color='secondary' value='Tasks' />
                                                                            </div>
                                <React.Fragment>
                                    <div>
                                        <div className="flex items-center py-4" >
                                            <Typography  mono  variant="display-lg" color='secondary' > {overAllTasks} </Typography>
                                        </div>
                                        <div >
                                            <div className="flex justify-between ">
                                                <Typography  variant="paragraph-xs"color="secondary" value={t("Last 3 Months")} />
                                                <Typography  variant="paragraph-xs" color="secondary" value={t("This Month")} />
                                            </div>
                                            <div className="flex justify-between ">
                                                <div className="flex">
                                                    <Typography  variant="paragraph-xs" mono > {last3MonthsOverAllTasks + " tasks"} </Typography>
                                                </div>
                                                <Typography  variant="paragraph-xs" mono> {currMonthOverAllTasks + " tasks"} </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>

                            </KpiCardsNDL>

                        </Grid>
                        <Grid item xs={3} >
                            <KpiCardsNDL style={{ height: "170px" }}  >
                            <div className='flex flex-col gap-1'>
                                                                            <Typography variant="label-01-s" color='secondary' value='Closed' />
                                                                            <Typography variant="label-01-s" color='secondary' value='Tasks' />
                                                                            </div>

                                <React.Fragment>
                                    <div >
                                        <div className="flex items-center py-4" >
                                            <Typography  mono  variant="display-lg" color='secondary' > {closedTasks} </Typography>
                                        </div>
                                        <div>
                                            <div className="flex justify-between ">
                                                <Typography variant="paragraph-xs" color="secondary" value={t("Last 3 Months")} />
                                                <Typography variant="paragraph-xs" color="secondary" value={t("Overall Percentage")} />
                                            </div>
                                            <div className="flex justify-between ">
                                                <div className="flex ">
                                                    <Typography  variant="paragraph-xs" mono  > {last3MonthsClosedTasks + " tasks"} </Typography>
                                                </div>
                                                <Typography  variant="paragraph-xs" mono  > {closedTaskPercentage + " %"} </Typography>
                                            </div>
                                        </div>
                                    </div>

                                </React.Fragment>

                            </KpiCardsNDL>

                        </Grid>
                        <Grid item xs={3} >
                            <KpiCardsNDL style={{ height: "170px" }}  >
                            <div className='flex flex-col gap-1'>
                                                                            <Typography variant="label-01-s" color='secondary' value='Open' />
                                                                            <Typography variant="label-01-s" color='secondary' value='Tasks' />
                                                                            </div>

                                <React.Fragment>
                                    <div>
                                        <div className="flex items-center py-4" >
                                            <Typography  mono  variant="display-lg" color='secondary' > {openTasks} </Typography>
                                        </div>
                                        <div >
                                            <div className="flex justify-between ">
                                                <Typography variant="paragraph-xs" color="secondary" value={t("Open > 3 Months")} />
                                                <Typography variant="paragraph-xs" color="secondary" value={t("Overall Percentage")} />
                                            </div>
                                            <div className="flex justify-between ">
                                                <div className="flex">
                                                    <Typography variant="paragraph-xs" mono  > {taskOpenGT3MCount + " tasks"} </Typography>
                                                </div>
                                                <Typography variant="paragraph-xs" mono  > {openTaskPercentage + " %"} </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>

                            </KpiCardsNDL>
                        </Grid>
                        <Grid item xs={3} >
                            <KpiCardsNDL style={{ height: "170px", cursor: "pointer" }} onClick={handleHighpriorityDialogOpen} >
                            <div className='flex flex-col gap-1'>
                                                                            <Typography variant="label-01-s" color='secondary' value='High' />
                                                                            <Typography variant="label-01-s" color='secondary' value='Priority Assets' />
                                                                            </div>
                                <React.Fragment>
                                    <div >
                                        <div className="flex items-center py-4" >

                                            <Typography mono  variant="display-lg" color='secondary' > {highPriorityAsset} </Typography>
                                        </div>
                                        <div >
                                            <div className="flex justify-between ">
                                                <Typography variant="paragraph-xs" color="secondary" value={t("Open > 1 Month")} />
                                                <Typography variant="paragraph-xs" color="secondary" value={t("Overall Percentage")} />
                                            </div>
                                            <div className="flex justify-between ">
                                                <div className="flex ">
                                                    <Typography variant="paragraph-xs" mono  > {highPriorityGT1MCount + " tasks"} </Typography>
                                                </div>
                                                <Typography  variant="paragraph-xs" mono > {highPriorityPercentage + " %"} </Typography>
                                            </div>
                                        </div>
                                    </div>

                                </React.Fragment>

                            </KpiCardsNDL>
                        </Grid>

                    </Grid>


                    <Grid container spacing={4} style={{ padding: "0px 16px 16px 16px " }}>
                        

                        <Grid item xs={6} >
                            <KpiCardsNDL style={{ height: "450px" }}>
                                <div className="flex p-2 items-center justify-between" >
                                    <Typography  variant="heading-01-xs" color='secondary'
                                        value={t("Task Status - Campaignwise")} />
                                </div>
                                 

                                <div id="pie1" style={{ height: "375px", padding: 10 }}>
                                    {renderPieChart()}
                                </div>
                            </KpiCardsNDL>
                        </Grid>

                        <Grid item xs={6} >
                            <KpiCardsNDL style={{ height: "450px" }}>
                                <div className="flex p-2 items-center justify-between" >
                                    <Typography  variant="heading-01-xs" color='secondary'
                                        value={t("Equipment Overview")} />
                                </div>
                                {/* <ClickAwayListener onClickAway={() => setOpen2(null)}>
                                    <div style={{ display: 'flex', justifyContent: 'end', height: '20px' }}>
                                        <div style={{ minWidth: 30, float: 'right',cursor:"pointer" }} onClick={(e) => togglePopper(e, "pie2")}>
                                            <MenuList />
                                        </div>
                                        <ListNDL
                                            options={menuOption}
                                            Open={open2}
                                            optionChange={optionChange2}
                                            keyValue={"name"}
                                            keyId={"id"}
                                            id={"popper-chart-menu"}
                                            onclose={(e) => { setOpen2(null) }}
                                            anchorEl={open2}
                                            width="150px"
                                        />

                                    </div>

                                </ClickAwayListener> */}
                                <div id="pie2" style={{ height: "375px", padding: 10 }}>
                                    {renderAssetTypePieChart()}
                                </div>
                            </KpiCardsNDL>
                        </Grid>
                    </Grid>

                    <ModalNDL open={HighPriorityDialog}>
                        <ModalHeaderNDL>
                            <div className="flex p-2 items-center justify-between">
                                <Typography variant="heading-02-xs" value={t("High Priority Assets")} />
                            </div>
                        </ModalHeaderNDL>
                        <ModalContentNDL>
                            {renderhighPriorityAssetData()}
                        </ModalContentNDL>
                        <ModalFooterNDL>
                            <Button id='reason-update' type={"secondary"} value={t('Close')} onClick={handleHighpriorityDialogClose}></Button>
                        </ModalFooterNDL>
                    </ModalNDL>

                </React.Fragment>
            }
        </React.Fragment>
    )
}
