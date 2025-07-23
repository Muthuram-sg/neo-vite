import React, { useState,useEffect, useRef} from 'react';

import  useTheme from "TailwindTheme";

import { selectedPlant, snackToggle, snackMessage, snackType,user,SensorSearch } from "recoilStore/atoms"; 
import { useRecoilState } from "recoil";
import useFetchOffline from 'components/layouts/OfflineDAQ/Hooks/useFetchOffline';

import AddSensor from "./SensorModel";

import { useTranslation } from 'react-i18next'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL' 
import TypographyNDL  from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL'; 
import LoadingScreen from "LoadingScreenNDL"
import useGetSensorDetails from "components/layouts/Explore/ExploreMain/ExploreTabs/components/FaultHistory/hooks/useGetSensorDetails";
import useGetEntityInstrumentsList from 'components/layouts/Tasks/hooks/useGetEntityInstrumentsList';
import Status from "components/Core/Status/StatusNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import FileUploadModel from './components/FileUploadModel';

import useDeleteSensor from "./hooks/useDeleteSensor"
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import useUpdateEnable from './hooks/useUpdateEnable.jsx'
import useGetHistory from './hooks/useGetHistory.jsx'
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import fileImport from 'assets/neo_icons/Menu/file-import.svg?react';
import ViewTimeLineDialogue from "./components/ViewTimeLineDialogue.jsx"
import useAssetType from 'components/layouts/NewSettings/Node/hooks/useAssetType';


const EnhancedTable = React.lazy(() => import("components/Table/Table"))


function OfflineDAQ(props){
   
 
    const { t } = useTranslation();
    const theme = useTheme();
    const AddSensorref = useRef();
    const [OpenModel,setOpenModel] = useState(false)
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [isopen, setIsopen] = useState(false)
    const fileUploadRef = useRef();
 
    const [tabledata,setTableData] = useState([]);//NOSONAR
    const [headPlant] = useRecoilState(selectedPlant);
    const timeLineDialogRef = useRef();

    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
  
    const [deleteNumber, setDeleteNumber] = useState('');
    const [isDataView,setIsDataView] = useState(false);

  const [page,setPage] = useState('instrument')
  const [pageidx,setPageidx] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [,setbredCrumbName] = useState('New Instrument')
    const [currUser] = useRecoilState(user);
    const [enablingRows, setEnablingRows] = useState([]);
    const [search, setSensorSearch] = useRecoilState(SensorSearch);
    const {  AssetTypeData, getAssetType } = useAssetType(); 
  
    const { fetchOfflineLoading } = useFetchOffline()
   
    const { sensordetailsLoading, sensordetailsdata, sensordetailserror, getSensorDetails } = useGetSensorDetails()
    const { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList } = useGetEntityInstrumentsList();
    const {DeleteSensorLoading, DeleteSensorData, DeleteSensorError, getDeleteSensor} = useDeleteSensor()
    const { EditSensorEnableLoading, EditSensorEnableData, EditSensorEnableError, getEditSensorEnable } = useUpdateEnable()
    const { getHistory } = useGetHistory()
    const headCells = [
        {
            id: 'SNo',
            numeric: false,
            disablePadding: true,
            label: t("SNo"),            
        },
        {
            id: 'Asset Type',
            numeric: false,
            disablePadding: true,
            label: t("Asset Type"),            
        },
        {
            id: 'Instrument',
            numeric: false,
            disablePadding: true,
            label: t("Instrument"),            
        },
        {
            id: 'Tech Number',
            numeric: false,
            disablePadding: true,
            label: t("Tech Number"),            
        },
        {
            id: 'Tech ID',
            numeric: false,
            disablePadding: true,
            label: t("Tech ID"),            
        },
        {
            id: 'Tech Name',
            numeric: false,
            disablePadding: true,
            label: t("Tech Name"),            
        },
        {
            id: 'Axis',
            numeric: false,
            disablePadding: true,
            label: t("Axis"),            
        },
        {
            id: 'DB Name',
            numeric: false,
            disablePadding: true,
            label: t("DB Name"),            
        },
        {
            id: 'Domain',
            numeric: false,
            disablePadding: true,
            label: t("Domain"),            
        },
        {
            id: 'VFD',
            numeric: false,
            disablePadding: true,
            label: t("VFD"),            
        },
        {
            id: 'RPM',
            numeric: false,
            disablePadding: true,
            label: t("RPM"),            
        },
        {
            id: 'Min RPM',
            numeric: false,
            disablePadding: true,
            label: t("Min RPM"),            
        },
        {
            id: 'Max RPM',
            numeric: false,
            disablePadding: true,
            label: t("Max RPM"),            
        },
        {
            id: 'End Type',
            numeric: false,
            disablePadding: true,
            label: t("End Type"),            
        },
        {
            id: 'Intermediate',
            numeric: false,
            disablePadding: true,
            label: t("Intermediate"),            
        },
        {
            id: 'BPFO',
            numeric: false,
            disablePadding: true,
            label: t("BPFO"),            
        },
        {
            id: 'BSF',
            numeric: false,
            disablePadding: true,
            label: t("BSF"),            
        },
        {
            id: 'BPFI',
            numeric: false,
            disablePadding: true,
            label: t("BPFI"),            
        },
        {
            id: 'FTF',
            numeric: false,
            disablePadding: true,
            label: t("FTF"),            
        },
        {
            id: 'VPF',
            numeric: false,
            disablePadding: true,
            label: t("VPF"),            
        },
        {
            id: 'BRO',
            numeric: false,
            disablePadding: true,
            label: t("BRO"),            
        },
        {
            id: 'GMF1',
            numeric: false,
            disablePadding: true,
            label: t("GMF1"),            
        },
        {
            id: 'GMF2',
            numeric: false,
            disablePadding: true,
            label: t("GM2"),            
        },
        {
            id: 'GMF3',
            numeric: false,
            disablePadding: true,
            label: t("GMF3"),            
        },
        {
            id: 'GMF4',
            numeric: false,
            disablePadding: true,
            label: t("GMF4"),            
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: true,
            label: t("Status"),            
        },
        {
            id: 'Updated At',
            numeric: false,
            disablePadding: true,
            label: t("Updated At"),  
            hide: true,
            display: "none"          
        },
        {
            id: 'Defect Processed At',
            numeric: false,
            disablePadding: true,
            hide: true,
            label: t("Defect Processed At"), 
            display: "none"                     
        },
    ];
    useEffect(() => {  
        getSensorDetails(headPlant.id)
        getEntityInstrumentsList(headPlant.id)
        getHistory()
        getAssetType() 
    }, [headPlant]);

    useEffect(() => {

        if (!sensordetailsLoading && !sensordetailserror && sensordetailsdata) {
            processedrows() 
        } 
    }, [sensordetailsLoading, sensordetailsdata, sensordetailserror])
    
    useEffect(() => {
        if (!EntityInstrumentsListLoading && EntityInstrumentsListData && !EntityInstrumentsListError) {
            processedrows() 
        }
    }, [EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError])

    const handleDeleteInstrument=()=>{
        getDeleteSensor(deleteNumber)

    }

    useEffect(()=>{
        if(!DeleteSensorLoading && DeleteSensorData && !DeleteSensorError){
            setOpenModel(false)
            SetMessage("instrument data has been deleted")
            SetType("error")
            setOpenSnack(true)
            getSensorDetails(headPlant.id)
        }
    },[DeleteSensorLoading, DeleteSensorData, DeleteSensorError])

    function handleClose() {
        setNotificationAnchorEl(null)
        setIsopen(false)
    }

    const handleisEnabled = (value) => {
        const body = {
            enable: !value.enable,
            id: value.id,
            updated_by: currUser.id
        };
    
        setEnablingRows((prev) => [...prev, value.id]);
    
        getEditSensorEnable(body).finally(() => {
            setEnablingRows((prev) => prev.filter((id) => id !== value.id));
        });
    };

    const ViewHistory = (id, value) => {
        timeLineDialogRef.current.openDialog(value)
    };

    useEffect(()=>{
        processedrows() 
    },[enablingRows])
    
    useEffect(()=>{
        if(!EditSensorEnableLoading && EditSensorEnableData && !EditSensorEnableError){
            getSensorDetails(headPlant.id)
        }
    },[EditSensorEnableLoading, EditSensorEnableData, EditSensorEnableError])

    const intermediateOptions = [
        { id: 1, name: "Coupling" },
        { id: 2, name: "Pulley" },
        { id: 3, name: "Nil" }
    ];
    
    const processedrows = () => {
        let temptabledata = [];
    
        if (
            sensordetailsdata &&
            sensordetailsdata.length > 0 &&
            EntityInstrumentsListData &&
            EntityInstrumentsListData.length > 0
        ) {
            const assetTypeMap = new Map(
                AssetTypeData && AssetTypeData.map((data) => [data.id, data.name])
            );
    
            const intermediateMap = new Map(
                intermediateOptions.map((data) => [data.id, data.name])
            );
    
          
           
            const sortData = (data) => {
                return data.sort((a, b) => {
                  const iidA = parseInt(a.iid, 10);
                  const iidB = parseInt(b.iid, 10);
                  if (iidA !== iidB) return iidA - iidB;
              
                  const numberA = a.number || '';
                  const numberB = b.number || '';
                  if (numberA !== numberB) {
                    return numberA.localeCompare(numberB, undefined, { numeric: true, sensitivity: 'base' });
                  }
              
                  const techIdA = a.tech_id || '';
                  const techIdB = b.tech_id || '';
                  return techIdA.localeCompare(techIdB, undefined, { numeric: true, sensitivity: 'base' });
                });
              };

              const sortedData = sortData(sensordetailsdata);

            temptabledata = sortedData.map((val, index) => {
                if (val) {
                    const isEnabling = enablingRows.includes(val.id);
                    const isRunning = val.enable;
                    const statusLabel = isEnabling
                        ? isRunning
                            ? t("Disabling")
                            : t("Enabling")
                        : !val.enable
                        ? t("Stopped")
                        : t("Running");
    
                    const statusColor = isEnabling
                        ? "neutral"
                        : !val.enable
                        ? "error-alt"
                        : "success-alt";
    
                    const assetTypeName = assetTypeMap.get(val.type) || "NA";
                    const intermediateName = intermediateMap.get(val.intermediate) || "NA";
    
                    let location = val.location;
                    if (location && location !== "Drive End" && location !== "Non Drive End") {
                        if (location.endsWith("NDE")) {
                            location = "Non Drive End";
                        } else if (location.endsWith("DE")) {
                            location = "Drive End";
                        }
                    }
    
                    return [
                        index + 1,
                        assetTypeName,
                        val.instrument?.name || "",
                        val.number || "",
                        val.tech_id || "",
                        val.tech_name || "",
                        val.axis || "",
                        val.db_name || "",
                        val.domain || "-",
                        val.vfd ? "True" : "False",
                        val.vfd === false ? val.rpm || "NA" : "NA",
                        val.vfd === true ? val.min_rpm || "NA" : "NA",
                        val.vfd === true ? val.max_rpm || "NA" : "NA",
                        location, 
                        intermediateName,
                        val.order?.BPFO || "NA",
                        val.order?.BSF || "NA",
                        val.order?.BPFI || "NA",
                        val.order?.FTF || "NA",
                        val.order?.VPF || "NA",
                        val.order?.BRO || "NA",
                        val.order?.GMF1 || "NA",
                        val.order?.GMF2 || "NA",
                        val.order?.GMF3 || "NA",
                        val.order?.GMF4 || "NA",
                        <div className="flex items-center justify-center">
                            <Status
                                lessHeight
                                noWidth="80px"
                                style={{ textAlign: "center" }}
                                colorbg={statusColor}
                                name={statusLabel}
                            />
                        </div>,
                        val.updated_at,
                        val.defect_processed_at,
                    ];
                } else {
                    return [];
                }
            });
        }
    
        setTableData(temptabledata);
    };    

    const handleEditDialogOpen = (id,value, type) => {
        setbredCrumbName("Edit Instrument")
        setPage("form")
        setTimeout(()=>{
            AddSensorref.current.handleEditDialogOpen(id, value)
          },200)
    }
    const handleDeleteDialogOpen = (id,value, type) => {
        setDeleteNumber(value.id)
        setOpenModel(true)
    }

    const handleDialogClose =()=>{
        setOpenModel(false)
    }

    const handlepageChange =()=>{
        setPage("instrument")
        props.handleHide(false)
    }

    const handleOpenPopUp = (event) => {
        setNotificationAnchorEl(event.currentTarget);
        setIsopen(true)
    };

const refreshTable = () =>{
    getSensorDetails(headPlant.id)
}

    const options=[
        { id: "bulk", name: "Add Data In Bulk", icon: fileImport, stroke: theme.colorPalette.primary  },
        { id: "instrument", name: "Add Instrument Data",icon: Plus, stroke: theme.colorPalette.primary },
    ]

    function optionChange(e) {
        handleClose()
      if(e === "bulk"){
        fileUploadRef.current.openDialog();
      } else if(e === "instrument") {
        setPage("form")
        setbredCrumbName("New Instrument")
        AddSensorref.current.handleDialogAdd()
      }
    }

    return(
       <React.Fragment>        
          <ListNDL
                options={options}
                Open={isopen}
                optionChange={optionChange}
                keyValue={"name"}
                keyId={"id"}
                id={"popper-Alarm-add"}
                onclose={handleClose}
                anchorEl={notificationAnchorEl}
                width="200px"
                isIcon
            />
        {
            (isDataView && fetchOfflineLoading) && <LoadingScreen/>
        } 
          <FileUploadModel ref={fileUploadRef}  refreshTable={refreshTable}/>
          <ViewTimeLineDialogue ref={timeLineDialogRef} getAlarmList={() => getSensorDetails(props.headPlant.id)} /> 
        <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
       
        {
                            page === 'instrument' ?
                            <React.Fragment>
                            <div className='pt-2'>
                                <div className='pb-5'>
                            <TypographyNDL  variant="heading-02-xs" style={{marginLeft:"16px"}}value={t("Manage Instruments")} ></TypographyNDL>
                            </div>
                            <HorizontalLine  variant={"divider1"} />
                            </div>
                            <div style={{ padding: 16 }}>
                            <div className='px-4 py-3'>
                            
                                    <EnhancedTable
                                        headCells={headCells}
                                        name="instrumentTable"
                                        data={tabledata} 
                                        rowSelect={true}
                                        download={true}
                                        FilterCol  
                                        verticalMenu={true}
                                        search={true} 
                                        SearchValue={search}
                                        actionenabled={true}
                                        rawdata={sensordetailsdata}
                                        handleEdit={(id,value)=>handleEditDialogOpen(id,value,"edit")}        
                                        enableEdit={true}
                                        enableToggle={true}
                                        handleToggle={(value)=>handleisEnabled(value)}        
                                        handleDelete={(id,value)=>handleDeleteDialogOpen(id,value,"delete")}        
                                        enableDelete={true}
                                        buttonpresent={"Add Instrument Data"}
                                        onClickbutton={handleOpenPopUp}
                                        Buttonicon={Plus}    
                                        isButtomRight            
                                        rowPerPageSustain={true}
                                        groupBy={"manage_instruments"}
                                        tagKey={["Status"]} 
                                        enableHistory={(id, value) => ViewHistory(id, value)}
                                        checkBoxId={"SNo"}
                                        onSearchChange={(e => setSensorSearch(e))}
                                        onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                                        page={pageidx}
                                        rowsPerPage={rowsPerPage}
                                        // order={"asc"}
                                        // orderBy={"Instrument"}
                                    /> 
                            </div>
                            </div>
                            </React.Fragment>
                :
                <AddSensor
                    ref={AddSensorref}
                     refreshTable={refreshTable}
                     handlepageChange={handlepageChange}
                />
                        }


        </div>
        <ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={OpenModel}>
        <ModalHeaderNDL>
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("Are you sure want to delete ?")} />
        </ModalHeaderNDL>
        <ModalContentNDL>
            <TypographyNDL color='secondary' value={"Do you really want to delete the instrument? This action cannot be undone."} variant="lable-01-s" />
        </ModalContentNDL>
        <ModalFooterNDL>
            <Button value={t('Cancel')}  type="secondary" onClick={() => { handleDialogClose() }} />
            <Button value={t('Delete')}  danger  onClick={()=>handleDeleteInstrument()} />
       
        </ModalFooterNDL>
    </ModalNDL> 

       </React.Fragment>
    )
}
export default OfflineDAQ;