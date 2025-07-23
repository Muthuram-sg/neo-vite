import React, { useState, useEffect } from "react";
import Grid from 'components/Core/GridNDL'
import moment from 'moment';
import { useRecoilState } from "recoil";
import { selectedPlant,user } from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import MetricsGroupModal from "./components/MetricsGroupModal";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useGetGroupMetric from "components/layouts/Settings/MetricsGroup/hooks/useGetGroupMetric.jsx"
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";

export default function MetricsGroup() {
    const { t } = useTranslation(); 
    const [headPlant] = useRecoilState(selectedPlant);
    const [currUser] = useRecoilState(user);
    const [GatewayDialog, setGatewayDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [GroupNameDataList, setGroupNameDataList] = useState([])
    const [tabledata, setTableData] = useState([])
    const [GroupMetric, setGroupMetric] = useState([])
    const {GroupMetricLoading, GroupMetricData, GroupMetricError, getGroupMetrics} = useGetGroupMetric();
    const [editValue, setEditValue] = useState('')
    const [Instrumentarray, setInstrumentArray] = useState([]);
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();

    useEffect(() => {
        getGroupMetrics(headPlant.id)
        getUsersListForLine(headPlant.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        processedrows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ GroupMetric])

    useEffect(() => {
        if (!GroupMetricLoading && GroupMetricData && !GroupMetricError) {
            const filteredData = GroupMetricData.filter(val => {
                if (val.access === "public") {
                    return true;
                }
                if (val.access === "shared") {
                    const isUserShared = val.shared_users.some(user => user.id === currUser.id);
                    return val.updated_by === currUser.id || isUserShared;
                }
                return val.updated_by === currUser.id;
            });
    
            if (filteredData.length > 0) {
                setGroupMetric(filteredData);
            }
        }
    }, [GroupMetricLoading, GroupMetricData, GroupMetricError, currUser.id]);    
    

    const headCells = [

        {
            id: 'S.No',
            numeric: false,
            disablePadding: false,
            label: 'S.No',
        },
        {
            id: 'groupname',
            numeric: false,
            disablePadding: false,
            label: 'Group Name',
        },
        {
            id: 'access',
            numeric: false,
            disablePadding: false,
            label: 'Access',
        },
        {
            id: 'lastupdatedby',
            numeric: false,
            disablePadding: false,
            label: 'Last Updated By',
        },
        {
            id: 'lastupdatedon',
            numeric: false,
            disablePadding: false,
            label: 'Last Updated On',
        }

    ];

    useEffect(()=>{
        processedrows()
    },[UsersListForLineData])


    const triggerTableData =()=>{
        getGroupMetrics(headPlant.id)
    }
    const handleNewgateway = () => {
        setGatewayDialog(true);
        setDialogMode('create');


    }

    const handleDialogClose = () => {
        setGatewayDialog(false);

    }
 const handleDialogEdit =(id, value)=>{
    setEditValue(value)
    setGatewayDialog(true);
    setDialogMode('edit');
    

 }
 const deleteGroupMetric=(id,value)=>{
    setGatewayDialog(true)
    setDialogMode('delete');
    setEditValue(value)

 }
   
 const processedrows = () => {
    var temptabledata = [];

    if (!GroupMetricLoading && GroupMetricData && !GroupMetricError) {
        const userMap = {};
        if (UsersListForLineData) {
            UsersListForLineData.forEach(user => {
                userMap[user.user_id] = user.userByUserId?.name || ''; 
            });
        }

        setGroupNameDataList(GroupMetric);
        temptabledata = temptabledata.concat(GroupMetric.map((val, index) => {
            const updatedByName = userMap[val.updated_by] || ''; // Get name from userMap or 'Unknown' if not found
            return [
                index + 1,
                val.grpname, 
                val.access, 
                updatedByName,  // Use the name here
                moment(val.updated_ts).format("DD/MM/YYYY HH:mm:ss")
            ];
        }));

        setInstrumentArray(GroupMetric.map(val => val.instrument_id && val.instrument_id.length > 0 ? val.instrument_id.map(x => x.id) : []));
    }

    setTableData(temptabledata);
}
    
    return (

        <React.Fragment>
                <MetricsGroupModal
                    GatewayDialog={GatewayDialog}
                    dialogMode={dialogMode}
                    handleDialogClose={() => handleDialogClose()}
                    headPlant={headPlant}
                    triggerTableData={triggerTableData}
                    editValue={editValue}
                    GateWayData={GroupNameDataList}
                    Instrumentarray={Instrumentarray}
                   

                /> 
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className="h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Metrics Group' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 min-h-[92vh]  bg-Background-bg-primary dark:bg-Background-bg-primary-dark ">
                        <EnhancedTable
                            headCells={headCells}
                            data={tabledata}
                            buttonpresent={t("Add Metric Group")}
                            onClickbutton={handleNewgateway}
                            actionenabled={true}
                            rawdata={GroupNameDataList}
                            handleEdit={(id, value) => handleDialogEdit(id, value)}
                            handleDelete={(id, value) => deleteGroupMetric(id, value)} 
                            enableDelete={true}
                            enableEdit={true}
                            search={true}
                            download={true}
                            Buttonicon={Plus}

                        />
                        </div>
                      
                    </Grid>
                </Grid>
        </React.Fragment>
    );
}