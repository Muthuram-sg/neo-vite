import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import useTheme from 'TailwindTheme' 
import Grid from 'components/Core/GridNDL'
import Chart from "react-apexcharts";
import Edit from 'assets/neo_icons/Menu/ActionEdit.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import { lineTaskView, lineAssetArray, themeMode,customdates } from "recoilStore/atoms";
import moment from 'moment';
import Card from "components/Core/KPICards/KpiCardsNDL";
import Divider from 'components/Core/HorizontalLine/HorizontalLineNDL'; 
import SelectBox from 'components/Core/DropdownList/DropdownListNDL'; 
import useTasks from "components/layouts/Line/hooks/useTasks";

export default function Task(props) {
    const theme =useTheme()
    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode);
    const [sortBy, setSortBy] = useState('all');
    const [taskView, setTaskView] = useRecoilState(lineTaskView);
    const [assetID] = useRecoilState(lineAssetArray); 
    const [boardData, setBoardData] = useState([])
    const [tableData, setTableData] = useState([])
    const [sortedData, setSortedData] = useState([])
    const [totTask, setTotTask] = useState(0)
    const [completedPercent, setCompPercent] = useState(0)
    const [pendingTask, setPendingTask] = useState(0)
    const [customdatesval,] = useRecoilState(customdates);
    const { TasksLoading, TasksData, TasksError, getTasks } = useTasks()

    const classes = { 
        card: {
            backgroundColor: theme.colorPalette.foreGround,
            width: "33%",
            margin: '0 10px',
            padding: 12
        }, 
        viewButtonSelected: {
            background: theme.palette.primary.main,
            borderRadius: 4,
            fontSize: 14,
            lineHeight: '24px',
            fontWeight: 500,
            color: theme.palette.background.white,
            padding: "4px 20px",
            cursor: "pointer"
        },
        viewButton: {
            background: theme.textField.background,
            borderRadius: 4,
            fontSize: 14,
            lineHeight: '24px',
            fontWeight: 500,
            color: theme.palette.secondaryText.main,
            padding: "4px 20px",
            cursor: "pointer"
        },
        tableContent: {
            marginTop: 30,
            "& .MuiListItemIcon-root": {
                marginRight: 16
            }
        }, 
        boardHeading: {
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 500,
            borderRadius: 4,
            justifyContent: 'center',
            color: theme.palette.background.white
        },
        boardItem: {
            background: theme.palette.background.white,
            borderRadius: 4,
            margin: '8px 0'
        },
         since: {
            background: "#FFCC00",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "15px",
            color: "#FFFFFF",
            borderRadius: "4px",
            padding: "2px",
            margin: "auto"
        },
    }

        useEffect(() => {
        if (!TasksLoading && !TasksError && TasksData) {
            setTableData(TasksData)
            setTotTask(TasksData.length)
            let result = {
                open: [],
                pending: [],
                closed: [],
                other: []
            }
            TasksData.filter(function (tData) {
                switch (tData.taskStatus.status) {
                    case 'Open': {
                        result['open'].push(tData)
                        break
                    }
                    case 'Pending': {
                        result['pending'].push(tData)
                        break
                    }
                    case 'Closed': {
                        result['closed'].push(tData)
                        break
                    }
                    default: {
                        result['other'].push(tData)
                        break
                    }
                }
                return null
            })
            setBoardData(result)
            setCompPercent(Math.round(result.closed.length / TasksData.length * 100, 2))
            setPendingTask(result.pending.length)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TasksLoading, TasksData, TasksLoading]) 

    useEffect(() => { 
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss");       
        
        const lastTime =startrange;
        // console.log("props.assetID ", lastTime)
        getTasks({ entity_id: assetID, start_dt: lastTime })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetID,customdatesval,props.refresh])

    const selectSortBy = (event) => {
            setSortBy(event.target.value)
            if (event.target.value !== 'all') {
                setSortedData(boardData[event.target.value.toLowerCase()])
                
            }
         
    }

    function getTaskBadge(type) {
        switch (type) {
                case 'Open':
                    return <div style={{ background: "#28BD41", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}>{t("Open")}</div>
                case 'Closed':
                    return <div style={{ background: "#BABABA", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}> {t("Closed")} </div>
                case 'Pending':
                    return <div style={{ background: "#FF9500", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}> {t("Pending")} </div>
                default: 
                    return <div style={{ background: "#ff0d00", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}> {t("Other")}</div>    
        }
    }

    const SortOption = [
        { id: "all", name: t('All') },
        { id: "Open", name: t('Open') },
        { id: "Pending", name: t('Pending') },
        { id: "Closed", name: t('Closed') },  
      ]

    function BoardView(arr){
        if(arr.length> 0){
            arr.map(datum =>{
                return <li style={classes.boardItem}>
                    <div>
                        <Typography style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px" }} value={datum.title}/>
                        <Typography style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }} value={t("Created by ")+datum.userByCreatedBy && datum.userByCreatedBy.name} />
                        <Typography style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }} value= {moment(datum.created_ts).format("YYYY-MM-DD, h:mm a")}/>
                    </div>
                </li>
                }
            )
        }else{
            return null
        }
        
    }
      
    function TaskDiv(){
        if(tableData.length > 0){
            return <Grid container spacing={3} style={{ padding: 10,width: '100%',margin: '0',marginTop: '50px' }}>

            <Grid item xs={12}>
                <Typography variant={"Caption1"} value={t("Key Performance Indicators")} />
            </Grid>
            <Grid item xs={12} style={{ display: 'flex' }}>
                <div style={classes.card}>
                    <Typography variant={"Caption1"} value={t("Total Tasks")}/>
                    <Typography variant="heading-01-lg"  value={totTask} />
                </div>
                <div style={classes.card}>
                    <Typography variant={"Caption1"} value={t("Completion Percentage")}/>
                    <Typography variant="heading-01-lg" value={completedPercent+'%'} />
                </div>
                <div style={classes.card}>
                    <Typography variant={"Caption1"} value={t("Pending (Selected Period)")}/>
                    <Typography variant="heading-01-lg"  value={pendingTask} />
                </div>
            </Grid>

            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography variant={"Caption1"} value={t("Tasks Status")} />
                        <Chart options={{
                            labels: Object.keys(boardData),
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 200
                                    },
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }],
                            plotOptions: {
                                pie: {
                                    donut: {
                                        size: '65%'
                                    }
                                }
                            },
                            colors: ["#28BD41", "#FF9500", "#BABABA", "#ff0d00"],
                        }} series={Object.keys(boardData).map(key => boardData[key].length)} type={'donut'} style={{ marginTop: 30 }} />
                    </Grid>
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant={"Caption1"} value={t("Tasks")} />
                                    <div style={{ flexGrow: 1 }}></div>
                                    {taskView === 'table' &&
                                    <div style={{ display: 'flex' }}>
                                        <Typography style={{ marginTop: 3, fontWeight: 500, lineHeight: '24px', fontSize: 16 }} value={t("Sort by")} />
                                        <div style={{ width: '150px' }}>
                                        
                                            <SelectBox
                                                labelId="dashboardSelectLbl"
                                                id="dashboardSelect"
                                                auto={false}
                                                multiple={false}
                                                options={SortOption}
                                                onChange={selectSortBy}
                                                value={sortBy}
                                                isMArray={true}
                                                checkbox={false}
                                                keyValue="name"
                                                keyId="id"
                                                placeholder={t("Sort by")}
                                            />
                                           
                                        </div>
                                    </div>}
                                    <div className={taskView === 'table' ? classes.viewButtonSelected : classes.viewButton} onClick={() => { setTaskView('table') }}>{t("Table View")}</div>
                                    <div className={taskView === 'board' ? classes.viewButtonSelected : classes.viewButton} onClick={() => { setTaskView('board') }}>{t("Board View")}</div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                    {taskView === 'table' &&
                                        <div style={classes.tableContent}>
                                            {sortBy === 'all' ?
                                                tableData.map(datum =>
                                                    <React.Fragment>
                                                        <li> 
                                                                <div style={{ marginTop: 8 }}>{getTaskBadge(datum.taskStatus.status)}</div>
                                                                <div>
                                                                    <div style={{display: "flex" }}>
                                                                        <Typography style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px" }}
                                                                            value={
                                                                            <React.Fragment>
                                                                            <span>{datum.title}</span>
                                                                            <span style={{ float: 'right', display: "flex" }}>
                                                                                {datum.taskStatus.status === 'Pending' && <div style={classes.since}>  {t("Since")} {moment(datum.created_ts).fromNow(true)} </div>}
                                                                                <Edit />
                                                                            </span>
                                                                            </React.Fragment>
                                                                            }
                                                                        />
                                                                    </div>
                                                                    
                                                                    <Typography style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }} value={moment(datum.created_ts).format("YYYY-MM-DD, h:mm a")}/>
                                                                    <Typography style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }} value={"Created by " +datum.userByCreatedBy.name} />
                                                                </div> 
                                                        </li>
                                                    </React.Fragment>)
                                                
                                                :
                                                sortedData.map(datum =>
                                                    <React.Fragment>
                                                        <li>
                                                            <div>{getTaskBadge(datum.taskStatus.status)}</div>
                                                            <div>
                                                                <Typography style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px" }}
                                                                    value={
                                                                    <React.Fragment>
                                                                    <span>{datum.title}</span>
                                                                    <span style={{ float: 'right' }}><Edit /></span>
                                                                    </React.Fragment>
                                                                    }
                                                                />
                                                                <Typography style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }} value={moment(datum.created_ts).format("YYYY-MM-DD, h:mm a")}/>
                                                                <Typography style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }} value={"Created by "+ datum.userByCreatedBy && datum.userByCreatedBy.name} />
                                                            </div>
                                                        </li>

                                                        <Divider variant="middle" />
                                                    </React.Fragment>)
                                            }
                                        </div>
                                    }
                                    {taskView !== 'table' &&
                                    <Grid container spacing={3} style={{ marginTop: 30 }}>
                                        <Grid item xs={3}>
                                            <Card >
                                                <li style={{ backgroundColor: "#28BD41" ,...classes.boardHeading}}>{t("Open")}</li>
                                                {BoardView(boardData.open)}
                                            </Card>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Card >
                                                <li style={{ backgroundColor: "#FF9500",...classes.boardHeading }}>{t("Pending")}</li>
                                                {BoardView(boardData.pending)}
                                            </Card>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Card >
                                                <li style={{ backgroundColor: "#BABABA",...classes.boardHeading }}>{t("Closed")}</li>
                                                {BoardView(boardData.closed)}
                                            </Card>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Card >
                                                <li style={{ backgroundColor: "#ff0d00",...classes.boardHeading }}>{t("Other")}</li>
                                                {BoardView(boardData.other)}
                                            </Card>
                                        </Grid>
                                    </Grid>}
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>

            </Grid>


        </Grid>
        }else{
            return  <Grid container spacing={0} style={{ padding: 4,marginTop: '50px' }}>
                <Grid item xs={12} style={{ padding: 4}}>
                    <Card elevation={0} style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }} >
                        <div style={{ padding: 10, textAlign: "center" }}>
                            <Typography variant="label-02-s" value={t("No Task For the selected Range and assets")}/>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        }
    }

    return (
        <React.Fragment>
        {assetID.length > 0 ?
            TaskDiv()
         :
         <Grid container spacing={0} style={{ padding: 4,marginTop: '50px' }}>
            <Grid item xs={12} style={{ padding: 4}}>
                <Card elevation={0} style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }} >
                    <div style={{ padding: 10, textAlign: "center" }}>
                        <Typography variant="label-02-s" value={t("PleaseSelectAnAsset")}/>
                    </div>
                </Card>
            </Grid>
        </Grid>
        }
        </React.Fragment>
    );
}