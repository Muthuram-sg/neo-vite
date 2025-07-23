import React, { useState, useEffect } from "react";
import Grid from 'components/Core/GridNDL'
import moment from 'moment';
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import GatewayModal from "./components/GatewayModal";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useGateWay from "components/layouts/Settings/Gateway/hooks/useGetGateWay.jsx"
import TypographyNDL from "components/Core/Typography/TypographyNDL";

export default function Gateway() {
    const { t } = useTranslation(); 
    const [headPlant] = useRecoilState(selectedPlant);
    const [GatewayDialog, setGatewayDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [GateWayDataList, setGateWayDataList] = useState([])
    const [tabledata, setTableData] = useState([])
    const { GateWayLoading, GateWayData, GateWayError, getGateWay } = useGateWay();
    const [editValue, setEditValue] = useState('')
    const [Instrumentarray, setInstrumentArray] = useState([]);



    useEffect(() => {
        getGateWay(headPlant.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        processedrows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ GateWayData])

    const headCells = [
     
        {
            id: 'sno',
            label: 'S.No',
            disablePadding: false,
            width: 100,
        },

        {
            id: 'GatewayId',
            numeric: false,
            disablePadding: false,
            label: t('Gateway Id'),
            width:100
        },
        {
            id: 'Gatewayname',
            numeric: false,
            disablePadding: false,
            label: t('Gateway Name'),
            width:130
        },
        {
            id: 'ip_configuration',
            numeric: false,
            disablePadding: false,
            label: t('Ip Configuration'),
            width:150
        },
        {
            id: 'Location',
            numeric: false,
            disablePadding: false,
            label: t('Location'),
            width:120
        },
        {
            id: 'Instruments',
            numeric: false,
            disablePadding: false,
            label: t('Instruments'),
            width:120
        },
        {
            id: 'AddedOn',
            numeric: false,
            disablePadding: false,
            label: t('AddedOn'),
            width:120
        },
        {
            id: 'AddedBy',
            numeric: false,
            disablePadding: false,
            label: t('Added By'),
            width:120


        },
        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('GateWay ID'),
            hide: true,
            display: "none",
            width: 100

        }


    ];


    const triggerTableData =()=>{
        getGateWay(headPlant.id)
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
 const deleteGateWay=(id,value)=>{
    setGatewayDialog(true)
    setDialogMode('delete');
    setEditValue(value)

  

 }
    const processedrows = () => {
        var temptabledata = []
        if (!GateWayLoading && GateWayData && !GateWayError) {
            setGateWayDataList(GateWayData)
            temptabledata = temptabledata.concat(GateWayData.map((val, index) => {
                return [ index + 1,val.iid, val.name, val.ip_address, val.location ? val.location : "--", val.instrument_id && val.instrument_id.length > 0 ?  val.instrument_id.map(x=>x.name).join(",") : "--",moment(val.created_ts).format("DD/MM/YYYY HH:mm:ss") , val.user ? val.user.name : "--", val.id]
            })
            
            )
            setInstrumentArray(GateWayData.map(val => val.instrument_id && val.instrument_id.length > 0 ? val.instrument_id.map(x => x.id) : []));
      
        }
       
        setTableData(temptabledata)
    }
    return (

        <React.Fragment>
                <GatewayModal
                    GatewayDialog={GatewayDialog}
                    dialogMode={dialogMode}
                    handleDialogClose={() => handleDialogClose()}
                    headPlant={headPlant}
                    triggerTableData={triggerTableData}
                    editValue={editValue}
                    GateWayData={GateWayDataList}
                    Instrumentarray={Instrumentarray}
                   

                />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className="h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Gateway' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 min-h-[92vh]  bg-Background-bg-primary dark:bg-Background-bg-primary-dark ">
                        <EnhancedTable
                            headCells={headCells}
                            data={tabledata}
                            buttonpresent={t("New Gateway")}
                            onClickbutton={handleNewgateway}
                            actionenabled={true}
                            rawdata={GateWayDataList}
                            handleEdit={(id, value) => handleDialogEdit(id, value)}
                            handleDelete={(id, value) => deleteGateWay(id, value)} 
                            enableDelete={true}
                            enableEdit={true}
                            search={true}
                            download={true}
                            Buttonicon={Plus}
                            rowSelect={true}
                            checkBoxId={"id"}

                        />
                        </div>
                      
                    </Grid>
                </Grid>
        </React.Fragment>
    );
}