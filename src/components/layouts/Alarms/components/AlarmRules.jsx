import React, { useState, useEffect, useRef } from "react" 
import EnhancedTable from "components/Table/Table";
import { useTranslation } from 'react-i18next';
import Grid from 'components/Core/GridNDL'
import useGetChannelListForLine from "components/layouts/Alarms/hooks/useGetChannelListForLine";
import useAlertConfigurations from "components/layouts/Alarms/hooks/useGetAlertConfigurations"
import DeleteConfirmDialogue from "components/layouts/Alarms/components/DeleteConfirmDialog.jsx"
import ViewTimeLineDialogue from "components/layouts/Alarms/components/ViewTimeLineDialogue.jsx"
import { useRecoilState } from "recoil";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import { AlarmSearch, AlarmColumnFilter, AlarmHeadCells, AlarmTableCustomization, alarmFilter,ErrorPage } from "recoilStore/atoms"
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import LoadingScreenNDL from 'LoadingScreenNDL';
import useGetAlertsDashboard from "components/layouts/Dashboards/hooks/useAlertsDashboard.jsx"



export default function AlarmRules(props) {

    const { t } = useTranslation();
    const [alarmFilterType] = useRecoilState(alarmFilter);
    const [filteredAlarmsList, setFilteredAlarmsList] = useState([]); 
    const [alarmsList, setAlarmsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [isopen, setIsopen] = useState(false)
    const deleteDialogRef = useRef();
    const timeLineDialogRef = useRef(); 
    const { alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror, getAlertConfigurations } = useAlertConfigurations();
    const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();
    const [headCells, setheadCells] = useRecoilState(AlarmHeadCells)
    const [selectedcolnames, setselectedcolnames] = useRecoilState(AlarmColumnFilter)
    const [, setErrorPage] = useRecoilState(ErrorPage)
    const [alarmTableCustomization, setAlarmTableCustomization] = useRecoilState(AlarmTableCustomization)
    const [search, setAlarmSearch] = useRecoilState(AlarmSearch);
    const  { alertsDashboardLoading, alertsDashboarddata, alertsDashboarderror, getAlertsDashboard } = useGetAlertsDashboard() 
    const [, setdownloadabledata] = useState([]);

    const tableheadCells = [

        {
            id: 'S.No',
            label: 'S.No',
            disablePadding: false,
            width: 100,
            visiblity:true
        },
        {
            id: 'Name',
            numeric: false,
            disablePadding: false,
            label: t('Name'),
            colSearch: true, 
            width: 150,
            visiblity:true

        }, {
            id: 'alertType',
            numeric: false,
            disablePadding: false,
            label: t("AlertType"),
            colSearch: true,
            display:"none",
            width: 120,
            visiblity:false
        },
        {
            id: 'EntityName',
            numeric: false,
            disablePadding: false,
            label: t("Entity Name"),
            width: 120,
            colSearch: true,
            visiblity:true
        },
        {
            id: 'Parameter',
            numeric: false,
            disablePadding: false,
            label: t("Parameter"),
            width: 140,
            colSearch: true,
            visiblity:true

        },
      
        {
            id: 'WarningCheck',
            numeric: false,
            disablePadding: false,
            label: t('WarningCheck'),
            width: 130,
            colSearch: true,
            visiblity:true

        },
        {
            id: 'WarningValue',
            numeric: false,
            disablePadding: false,
            label: t('WarningValue'),
            width: 130,
            colSearch: true,
            visiblity:true
        },
        {
            id: 'WarningMinimum',
            numeric: false,
            disablePadding: false,
            label: t('WarningMinimum'),
            width: 150,
            colSearch: true,
            display:"none",
            visiblity:false

        },
        {
            id: 'WarningMaximum',
            numeric: false,
            disablePadding: false,
            label: t('WarningMaximum'),
            width: 150,
            colSearch: true,
            display:"none",
            visiblity:false

        },


        {
            id: 'CriticalCheck',
            numeric: false,
            disablePadding: false,
            label: t('Critical Check'),
            width: 130,
            colSearch: true,
            visiblity:true
        },

        {
            id: 'CriticalValue',
            numeric: false,
            disablePadding: false,
            label: t('CriticalValue'),
            width: 130,
            colSearch: true,
            visiblity:true

        },
        {
            id: 'CriticalMinimum',
            numeric: false,
            disablePadding: false,
            label: t('CriticalMinimum'),
            width: 150,
            display:"none",
            colSearch: true,
            visiblity:false

        },
        {
            id: 'CriticalMaximum',
            numeric: false,
            disablePadding: false,
            label: t('CriticalMaximum'),
            width: 150,
            display:"none",
            colSearch: true,
            visiblity:false

        },
        {
            id: 'Aggergation',
            numeric: false,
            disablePadding: false,
            label: t('Aggergation'),
            width: 130,
            display:"none",
            colSearch: true,
            visiblity:false

        },
        {
            id: 'Duration',
            numeric: false,
            disablePadding: false,
            label: t('Duration'),
            width: 130,
            display:"none",
            colSearch: true,
            visiblity:false

        },
       
        {
            id: 'alert_channel_names',
            numeric: false,
            disablePadding: false,
            label: t('CommunicationChannel'),
            width: 200,
            display:"none",
            colSearch: true,
            visiblity:false
      

        }
        ,
        {
            id: 'Recurringalarm',
            numeric: false,
            disablePadding: false,
            label: t('Recurring Alarm'),
            width:150,
            display:"none",
            colSearch: true,
            visiblity:false
        },
        {
            id: 'Warningfrequency',
            numeric: false,
            disablePadding: false,
            label: t('Warning Frequency'),
            colSearch: true,
            width:150,
            display:"none",
            visiblity:false

        },
        {
            id: 'Criticalfrequency',
            numeric: false,
            disablePadding: false,
            label: t('Critical Frequency'),
            colSearch: true,
            width:150,
            display:"none",
            visiblity:false

        },
        {
            id: 'User',
            numeric: false,
            disablePadding: false,
            label: t('User'),
            width: 100,
            colSearch: true,
            visiblity:true
        },
        {
            id: 'check_type',
            numeric: false,
            disablePadding: false,
            label: t('check_type'),

            display: "none",
            hide: true,
            width: 130
        },
        {
            id: 'check_last_n',
            numeric: false,
            disablePadding: false,
            label: t('check_last_n'),
            hide: true,
            display: "none",
           
            width: 130
        },
        {
            id: 'remarks',
            numeric: false,
            disablePadding: false,
            label: t('remarks'),
            hide: true,
            display: "none",
          
            width: 100
        }
        ,
        {
            id: 'product_id',
            numeric: false,
            disablePadding: false,
            label: t('product'),
            display: "none",
            hide: true,
            width: 100
        },
       
      
        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('Alert ID'),
            hide: true,
            display: "none",
            width: 100

        },


    ]

    useEffect(() => {
        if (!(alarmTableCustomization.selectedColumns && alarmTableCustomization.selectedColumns.length > 0)) {
            setheadCells(tableheadCells);
            // setFilterColOption(tableheadCells)
            setselectedcolnames(tableheadCells.filter(val => !val.hide))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

   
    useEffect(() => {
      if(props.module === 'newalert'){
        if(props.params){
            console.log(props.module,props.params,"module alarm")
            optionChange(props.params)
        }
        
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.module,props.params])

    useEffect(() => {
        getChannelListForLine(props.headPlant.id)
        getAlertConfigurations(props.headPlant.id)
        setFilteredAlarmsList([])
        getAlertsDashboard(props.headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant])


    useEffect(() => {
       
        if(!alertsDashboardLoading && alertsDashboarddata && !alertsDashboarderror){
           console.log(alertsDashboarddata,props.module,props.params,"alertsDashboarddata")
         
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    },[alertsDashboardLoading, alertsDashboarddata, alertsDashboarderror])
    useEffect(() => {
        processedrows();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alarmsList, alarmFilterType])
// NOSONAR
    useEffect(() => {
        if (!alertConfigurationsLoading && alertConfigurationsdata && !alertConfigurationserror) {
            
            let data = [] 
            data = alertConfigurationsdata.map((alert) => {
                let channelName = []
                // if (alert.entity_type === 'downtime')
                    if (alert.alert_channels && alert.alert_channels.length > 0) {
                        // eslint-disable-next-line array-callback-return
                        alert.alert_channels.map((val) => {
                            if (!ChannelListForLineLoading && !ChannelListForLineError && ChannelListForLineData && ChannelListForLineData.length > 0) {
                                channelName.push(ChannelListForLineData.filter(x => x.id === val).map(x => x.name)[0])
                            }
                        })
                    }
                if (alert.alert_multi_channels && alert.alert_multi_channels.length > 0) {
                    // eslint-disable-next-line array-callback-return
                    alert.alert_multi_channels[0].critical.map((val) => {
                        if (!ChannelListForLineLoading && !ChannelListForLineError && ChannelListForLineData && ChannelListForLineData.length > 0) {
                            channelName.push(ChannelListForLineData.filter(x => x.id === val).map(x => x.name + "(critical)")[0])
                        }
                    })
                    // eslint-disable-next-line array-callback-return
                    alert.alert_multi_channels[0].warning.map((val) => {
                        if (!ChannelListForLineLoading && !ChannelListForLineError && ChannelListForLineData && ChannelListForLineData.length > 0) {
                            channelName.push(ChannelListForLineData.filter(x => x.id === val).map(x => x.name + "(warning)")[0])
                        }
                    })

                }
                return Object.assign({}, alert, { "alert_channel_names": channelName.join(",") })

            })
            console.log(data,"data")
            let filteredAlarm;
            if(props.module === 'editalarm'){
             if(props.params && data.length > 0){
                 filteredAlarm = data.filter(obj => obj.id === props.params)
                 if(filteredAlarm.length > 0){
                    EditAlarm(filteredAlarm[0].id,filteredAlarm[0])
                 }else {
                    setErrorPage(true)
                }
                 console.log(filteredAlarm,"filtered")
             }
            }else if(props.module === 'alarmhistory') {
                if(props.params && data.length > 0) {
                    filteredAlarm = data.filter(obj => obj.id === props.params);
                    console.log(data,filteredAlarm,props.params,"data")
                    if (filteredAlarm.length > 0) {  // Check if the filtered result is not empty
                        ViewAlarm(filteredAlarm[0].id, filteredAlarm[0]);
                    } else {
                        setErrorPage(true)
                    }
                }
            }
            
            setAlarmsList(data);
            props.alarmsList(data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror])




    const processedrows = () => {
        let temptabledata = []
        let tempdownloadabledata = []
        if (alarmsList.length > 0) {

            let filteredAlarmList = alarmsList.filter((x) => {
                return alarmFilterType.includes(x.alertType)
            })

            setFilteredAlarmsList(filteredAlarmList)
            temptabledata = temptabledata.concat(filteredAlarmList.map((val, index) => {

                let aggregateValue = ''
                if (val.check_type === "time_interval" || val.alertType === "timeslot") {
                    if (val.alertType === "timeslot") {

                        aggregateValue = val.check_aggregate_window_time_range
                    } else if (val.check_aggregate_window_time_range) {

                        aggregateValue = val.check_aggregate_window_time_range;
                    } else {
                        aggregateValue = "";
                    }
                } else {
                    if (val.alertType === "downtime") {
                        aggregateValue = val.check_aggregate_window_time_range;
                    } else {
                        aggregateValue = val.check_last_n ? val.check_last_n + "N" : val.check_last_n;
                    }
                }
                tempdownloadabledata.push(
                    [

                        val.name,
                        val.connectivity_type == 2 ? 'Gateway' : val.alertType,
                        val.instrument_id == 0 ? val.gateway_name : val.instrument_name,
                        val.instruments_metric ? val.instruments_metric.metric.title : "",
                        val.warn_type ? val.warn_type : "",
                        val.warn_value ? Number(val.warn_value) : "",
                        val.warn_min_value ? Number(val.warn_min_value) : "",
                        val.warn_max_value ? Number(val.warn_max_value) : "",
                        val.critical_type ? val.critical_type : "",
                        val.critical_value ? Number(val.critical_value) : "",
                        val.critical_min_value ? Number(val.critical_min_value) : "",
                        val.critical_max_value ? Number(val.critical_max_value) : "",
                        val.check_aggregate_window_function ? val.check_aggregate_window_function : "",
                        aggregateValue,
                        val.alert_channel_names ? val.alert_channel_names : "",
                        val.userByUpdatedBy && val.userByUpdatedBy.name ? val.userByUpdatedBy.name : '',
                        val.recurring_alarm ? val.recurring_alarm : "",
                        val.recurring_alarm ? val.warn_frequency : "",
                        val.recurring_alarm ? val.cri_frequency : "",

                    ]
                )
                let aggregateWindow;
                if (val.check_type === "time_interval" || val.alertType === "timeslot") {
                    if (val.alertType === "timeslot") {

                        aggregateWindow = val.check_aggregate_window_time_range
                    } else if (val.check_aggregate_window_time_range) {

                        aggregateWindow = val.check_aggregate_window_time_range;
                    } else {
                        aggregateWindow = "";
                    }
                } else {
                    if (val.alertType === "downtime") {
                        aggregateWindow = val.check_aggregate_window_time_range;
                    } else {
                        aggregateWindow = val.check_last_n ? val.check_last_n + "N" : val.check_last_n;
                    }
                }
                
                return [

                    index + 1,
                    val.name,
                    val.connectivity_type === 2 ? 'Gateway' : val.alertType,
                    (val.viid && val.virtual_instrument) ? val.virtual_instrument.name : val.instrument_id == 0 ? val.gateway_name : val.instrument_name,
                    val.instruments_metric ? val.instruments_metric.metric.title : "",
                    val.warn_type ? val.warn_type : "",
                    val.warn_value ? val.warn_value : "",
                    val.warn_min_value ? val.warn_min_value : "",
                    val.warn_max_value ? val.warn_max_value : "",
                    val.critical_type ? val.critical_type : "",
                    val.critical_value ? val.critical_value : "",
                    val.critical_min_value ? val.critical_min_value : "",
                    val.critical_max_value ? val.critical_max_value : "",
                    val.check_aggregate_window_function ? val.check_aggregate_window_function : "",
                    aggregateWindow,
                    val.alert_channel_names ? val.alert_channel_names : "",
                    val.recurring_alarm ? "Yes" : "No",
                    val.recurring_alarm ? val.warn_frequency : "",
                    val.recurring_alarm ? val.cri_frequency : "",
                    val.userByUpdatedBy && val.userByUpdatedBy.name ? val.userByUpdatedBy.name : '',
                    val.check_type ? val.check_type : "",
                    val.check_last_n ? val.check_last_n : "",
                    val.remark ? val.remark : "",
                    val.product_id ? val.product_id : "",
                    val.id
                ]
            })
            )
        }
        
        setdownloadabledata(tempdownloadabledata)
        setTableData(temptabledata)

    }


  

    const handleOpenPopUp = (event) => {
        setNotificationAnchorEl(event.currentTarget);
        setIsopen(true)
    };



    const EditAlarm = (id, value) => {

        if (value.alertType === "alert") {
            props.changeSection('AlertEdit', value)
        }
        else if (value.alertType === "connectivity") {
            props.changeSection('connectivityEdit', value)
        }
        else if (value.alertType === "timeslot") {
            props.changeSection('TimeSlotEdit', value)
        }
        else if (value.alertType === "downtime") {
            props.changeSection('downtimeEdit', value)
        }else if (value.alertType === "tool") {
            props.changeSection('toolEdit', value)
        }
        else {
            props.changeSection('', value)
        }
        BreadcrumbFunc(value.alertType)
    };

    const ViewAlarm = (id, value) => {
        timeLineDialogRef.current.openDialog(value)
    };

    const DeleteAlarm = (id, value) => {
        deleteDialogRef.current.openDialog(value)
    }

    const AddOption = [
        { id: "alert", name: t("Data Alarm") },
        { id: "connectivity", name: t("Connectivity Alarm") },
        { id: "timeslot", name: t("Timeslot Alarm") },
        { id: "downtime", name: t("Downtime Alarm") },
        { id: "tool", name: t("Tool Alarm") },
    ]

    function handleClose() {
        setNotificationAnchorEl(null)
        setIsopen(false)
    }

    function optionChange(e) {
        console.log(e,"e alarms")
        props.changeSection(e,props.module)
        BreadcrumbFunc(e)
        handleClose()
    }
    function BreadcrumbFunc(e) {
        if (e === "alert") {
            props.breadCrumbHandler("Data Alarm")
        }
        else if (e === "connectivity") {
            props.breadCrumbHandler("Connectivity Alarm")
        }
        else if (e === "timeslot") {
            props.breadCrumbHandler("Timeslot Alarm")
        }
        else if (e === "downtime") {
            props.breadCrumbHandler("Downtime Alarm")
        } else {
            props.breadCrumbHandler("Tool Alarm")
        }
    }
    const PageChange = (s, r, atoms) => {
        setAlarmTableCustomization(atoms)
    }


   
 
  
    return (
        <React.Fragment>
            <ListNDL
                options={AddOption}
                Open={isopen}
                optionChange={optionChange}
                keyValue={"name"}
                keyId={"id"}
                id={"popper-Alarm-add"}
                onclose={handleClose}
                anchorEl={notificationAnchorEl}
                width="200px"
            />

            {alertConfigurationsLoading && <div className="ml-25"> <LoadingScreenNDL /></div>}
            <React.Fragment >

                <DeleteConfirmDialogue ref={deleteDialogRef} getAlarmList={() => getAlertConfigurations(props.headPlant.id)} />
                <ViewTimeLineDialogue ref={timeLineDialogRef} getAlarmList={() => getAlertConfigurations(props.headPlant.id)} />

                <Grid className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark" container style={{ padding: "16px" }} >
                    <Grid item xs={12} sm={12} > 
                        <EnhancedTable 
                            headCells={headCells.filter(c => !c.hide)}
                            data={tableData ? tableData : []}
                            buttonpresent={t("New Alarm")}
                            isButtomRight
                            download={selectedcolnames.length === 0 ? false:true}
                            rowSelect={true}
                            search={true}
                            SearchValue={search}
                            onSearchChange={(e => setAlarmSearch(e))}
                            onClickbutton={handleOpenPopUp}
                            actionenabled={true}
                            rawdata={filteredAlarmsList}
                            handleEdit={(id, value) => EditAlarm(id, value)}
                            enableHistory={(id, value) => ViewAlarm(id, value)}
                            handleDelete={(id, value) => DeleteAlarm(id, value)}
                            enableDelete={true}
                            enableEdit={true} 
                            onPageChange={PageChange}
                            rowPerPageSustain={true} 
                            TableSustainValue={alarmTableCustomization}
                            rowsPerPage={alarmTableCustomization.rowperpage}
                            page={alarmTableCustomization.page}
                            order={alarmTableCustomization.order}
                            orderBy={alarmTableCustomization.orderby}
                            Buttonicon={Plus}
                        
                            checkBoxId={"S.No"} 
                            verticalMenu={true}
                            defaultvisibleColumn
                            groupBy={'alarm_rule'}

                        />

                    </Grid>
                </Grid>
            </React.Fragment>



        </React.Fragment>
    )
}
