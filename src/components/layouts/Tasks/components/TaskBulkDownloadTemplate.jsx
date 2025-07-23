import React,{useState,useEffect,useImperativeHandle,forwardRef} from 'react';
import Button from 'components/Core/ButtonNDL';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { selectedPlant,snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import moment from 'moment';
import useTaskTypeList from '../hooks/useTaskTypeList';
import useTaskPriority from '../hooks/useTaskPriority';
import useTaskStatus from '../hooks/useTaskStatus';
import useFaultMode from '../hooks/useFaultModeList';
import useMainComponentList from '../hooks/useMainComponentList';
import useSubCompList from '../hooks/useSubCompList';
import useGetEntityInstrumentsList from '../hooks/useGetEntityInstrumentsList.jsx' 
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useInstrumentCategory from "Hooks/useInstrumentCategory";
import useInstrumentType from "Hooks/useInstrumentType";
import useInstrumentStatusList from '../hooks/useInstrumentStatusList';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import FileSaver from 'file-saver';
import ExcelJS from 'exceljs';

const TaskBulkDownloadTemplate = forwardRef((props,ref)=>{
    const [openDialog,setOpenDialog] = useState(false);
    const [headPlant] = useRecoilState(selectedPlant)
    const [categoryID, setCategoryID] = useState('');
    const [categoryArr, setCategoryArr]  = useState([]);
    const [instrumentTypeID, setInstrumentTypeID] = useState('');
    const [instrumentTypeArr, setInstrumentTypeArr]  = useState('');
    const [isInstrumentCategory,setIsInstrumentCategory] = useState(false);
    const [isInstrumentType,setIsInstrumentType] = useState(false); 
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType()
    const { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList } = useGetEntityInstrumentsList(); 
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const {  TypeListLoading, TypeListData, TypeListError, getTypeList } = useTaskTypeList()
    const {  PriorityListLoading, PriorityListData, PriorityListError, getPriorityList } = useTaskPriority();
    const {  StatusListLoading, StatusListData, StatusListError, getStatusList } = useTaskStatus();
    const {  FaultModeListLoading, FaultModeListData, FaultModeListError, getFaultModeList } = useFaultMode(); 
    const { MainComponentListLoading, MainComponentListData, MainComponentListError, getMainComponentList } = useMainComponentList();
    const { SubComponentListLoading, SubComponentListData, SubComponentListError, getSubCompList } = useSubCompList();
    const { InstrumentStatusLoading, InstrumentStatusData, InstrumentStatusError, getInstrumentStatusList } = useInstrumentStatusList();
    const { t } = useTranslation();
    
    useImperativeHandle(ref,()=>({
        openDialog: (value)=>setOpenDialog(true)
    }))
    useEffect(()=>{
        getInstrumentCategory()
        getEntityInstrumentsList(headPlant.id);
        getUsersListForLine(headPlant.id);
        getTypeList()
        getPriorityList()
        getStatusList()
        getFaultModeList()
        getInstrumentStatusList()
        getMainComponentList()
        getSubCompList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])
    
    useEffect(() => {
        if(categoryArr.length > 0){
        getInstrumentType(categoryArr[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryArr])

    const handlDialogClose = () =>{
        setCategoryID('');
        setInstrumentTypeID('');
        setIsInstrumentCategory(false);
        setIsInstrumentType(false);
        setOpenDialog(false);
    }
 
    const handleInstrumentCategory = (e,data) =>{
        setCategoryID(e.target.value)
        setCategoryArr(data.filter(x=>x.id ===e.target.value ))
        setInstrumentTypeID('');
        setIsInstrumentCategory(false);
       

    } 
    const handleInstrumentType = (e,data) =>{
        setInstrumentTypeID(e.target.value)
        setInstrumentTypeArr(data.filter(d=>d.id ===e.target.value)[0])
        setIsInstrumentType(false);
    } 
    
    const openNotification = (msg,type) =>{
        SetMessage(msg)
        SetType(type)
        setOpenSnack(true);
    }
    // NOSONAR
    const downloadTemplate = () => {
        // Create workbook & add worksheet 
        if(!categoryID){
            setIsInstrumentCategory(true);
            return false
        }  
        if(!instrumentTypeID){
            setIsInstrumentType(true);
            return false
        }  
        
        if (!EntityInstrumentsListLoading && !EntityInstrumentsListError &&EntityInstrumentsListData) {
            try{
                let AssetsList = []
                EntityInstrumentsListData.forEach(x => {
                    
                    if (x.instrument.instrument_type === instrumentTypeID) { 
                         AssetsList.push({ ...x, entity_name: x.entity_instruments.name,instrument_name: x.instrument.name,instrumentTypeId: instrumentTypeArr.id, instrumentTypeName: instrumentTypeArr.name, line_id: x.line.id, line_name: x.line.name }) 
                        } 
                }) 
                if (AssetsList && AssetsList.length > 0) {
                    
                    const workbook = new Excel.Workbook();
                    
                    
                    const asset_list = workbook.addWorksheet('Asset_List');
                    asset_list.columns = [
                        { header: 'asset_id', key: 'entity_id', }, 
                        { header: 'asset_name', key: 'entity_name' }, 
                        { header: 'instrument_id', key: 'instrument_id', }, 
                        { header: 'instrument_name', key: 'instrument_name' }, 
                        { header: 'observed_date(YYYY-MM-DD)',style: { numFmt: '@' }  },
                        { header: 'observation' },
                        { header: 'action_recommended' },
                        { header: 'task_type' },
                        { header: 'task_priority' },
                        { header: 'task_status' },
                        { header: 'task_type_id' },
                        { header: 'task_priority_id' },
                        { header: 'task_status_id' },
                        { header: 'observed_by' },
                        { header: 'reported_by' },
                        { header: 'Instrument_Type_Name', key: 'instrumentTypeName' },
                        { header: 'fault_mode' }, 
                        { header: 'fault_mode_id' }, 
                        { header: 'observed_by_id' },
                        { header: 'reported_by_id' },
                        { header: 'line_name', key: 'line_name' },
                        { header: 'line_id', key: 'line_id' },
                        { header: 'instrument_status' },
                        { header: 'instrument_status_id' },
                        { header: 'assigne' },
                        { header: 'assigne_id' },
                        { header: 'Main_Component'},
                        { header: 'Sub_Component'},
                        { header: 'main_component_id' },
                        { header: 'sub_component_id' },
                        { header: 'reported_date(YYYY-MM-DD)',style: { numFmt: '@' }  },
                    ];
                    
    
                    const asset_idCol = asset_list.getColumn('A'); 
                    asset_idCol.hidden = true; 
                    const instrument_idCol = asset_list.getColumn('C');
                    instrument_idCol.hidden = true;
                    const line_idCol = asset_list.getColumn('V');
                    line_idCol.hidden = true; 

                    asset_list.addRows(AssetsList); 
    
                    asset_list.columns.forEach(column => {
                        
                        column.width = 20
                      });
                      asset_list.getColumn('E').width = 25;
                    let taskTypesDataArr = [];
                    if (!TypeListLoading && !TypeListError && TypeListData) {
                        TypeListData.forEach(x => {
                            let taskTypesObj = { task_type: x.task_type };
                            taskTypesObj['id'] = x.id;
                            taskTypesDataArr.push(taskTypesObj);
                        })
                    }
                    let taskTypesArr = taskTypesDataArr.map(obj => Object.values(obj));

                    let taskPriorityDataArr = [];
                    if (!PriorityListLoading && !PriorityListError && PriorityListData) {
                        PriorityListData.forEach(x => {
                            let taskPriorityObj = { task_level: x.task_level };
                            taskPriorityObj['id'] = x.id;
                            taskPriorityDataArr.push(taskPriorityObj);
                        })
                    }
                    let taskPriorityArr = taskPriorityDataArr.map(obj => Object.values(obj));

                    let taskStatusDataArr = [];
                    if (!StatusListLoading && !StatusListError && StatusListData) {
                        StatusListData.forEach(x => {
                            let taskStatusObj = { task_status: x.status };
                            taskStatusObj['id'] = x.id;
                            taskStatusDataArr.push(taskStatusObj);
                        })
                    }
                    let taskStatusArr = taskStatusDataArr.map(obj => Object.values(obj));

                  

                    let faultModeDataArr = [];
                    if (!FaultModeListLoading && !FaultModeListError && FaultModeListData) {
                        FaultModeListData.forEach(x => {
                            let faultModeObj = { fault_mode: x.name };
                            faultModeObj['id'] = x.id;
                            faultModeDataArr.push(faultModeObj);
                        })
                    }
                    let faultModeArr = faultModeDataArr.map(obj => Object.values(obj));

                    


                    let userListDataArr = [];
                    if (!UsersListForLineLoading && !UsersListForLineError && UsersListForLineData) {
                        UsersListForLineData.forEach(x => {
                            let userObj = { user_name: x.userByUserId.name + " (" + x.userByUserId.sgid + ")" };
                            userObj['id'] = x.user_id;
                            userListDataArr.push(userObj);
                        })
                    }
                    let userListArr = userListDataArr.map(obj => Object.values(obj)); 
                    
                    let instrumentStatusDataArr = [];
                    if (!InstrumentStatusLoading && !InstrumentStatusError && InstrumentStatusData) {
                        InstrumentStatusData.forEach(x => {
                            let instrumentStatusObj = { instrument_status: x.status_type };
                            instrumentStatusObj['id'] = x.id;
                            instrumentStatusDataArr.push(instrumentStatusObj);
                        })
                    }
                    let instrumentStatusArr = instrumentStatusDataArr.map(obj => Object.values(obj)); 

                    let mainComponentDataArr = [];
                    if (!MainComponentListLoading && !MainComponentListError && MainComponentListData) {
                       
                        MainComponentListData.forEach(x => {
                            let mainCompObj = { main_component: x.description };
                            mainCompObj['id'] = x.id;
                            mainComponentDataArr.push(mainCompObj);
                        })
                    }
                    let mainComponentArr = mainComponentDataArr.map(obj => Object.values(obj));

                    let subComponentDataArr = [];
                    if (!SubComponentListLoading && !SubComponentListError && SubComponentListData) {
                       
                        SubComponentListData.forEach(x => {
                            let subCompObj = { sub_component: x.description };
                            subCompObj['id'] = x.id;
                            subComponentDataArr.push(subCompObj);
                        })
                    }
                    let subComponentArr = subComponentDataArr.map(obj => Object.values(obj));
                    
    
                    const task_type = workbook.addWorksheet('Task_Type_Master');
                    // add a table to a sheet
                    task_type.addTable({
                        name: 'Task_Type_Master',
                        ref: 'A1',
                        headerRow: true,
                        totalsRow: false,
                        style: {
                            theme: 'TableStyleDark3',
                            showRowStripes: true,
                        },
                        columns: [
                            { name: 'task_type', filterButton: false },
                            { name: 'id', filterButton: false },
    
                        ],
                       
                        rows: taskTypesArr
                    });
                    task_type.state = 'veryHidden';
    
                    const task_priority = workbook.addWorksheet('Task_Priority_Master');
                    // add a table to a sheet
                    task_priority.addTable({
                        name: 'Task_Priority_Master',
                        ref: 'A1',
                        headerRow: true,
                        totalsRow: false,
                        style: {
                            theme: 'TableStyleDark3',
                            showRowStripes: true,
                        },
                        columns: [
                            { name: 'task_level', filterButton: true },
                            { name: 'id', filterButton: false },
    
                        ],
                        rows: taskPriorityArr
                    });
                    task_priority.state = 'veryHidden';
    
                    const task_status = workbook.addWorksheet('Task_Status_Master');
                    // add a table to a sheet
                    task_status.addTable({
                        name: 'Task_Status_Master',
                        ref: 'A1',
                        headerRow: true,
                        totalsRow: false,
                        style: {
                            theme: 'TableStyleDark3',
                            showRowStripes: true,
                        },
                        columns: [
                            { name: 'task_status', filterButton: false },
                            { name: 'id', filterButton: false },
    
                        ],
                        rows: taskStatusArr
                    });
                    task_status.state = 'veryHidden';

                  

                    const fault_mode = workbook.addWorksheet('Fault_Mode_Master'); 
                    // add a table to a sheet 
                    fault_mode.addTable({ 
                        name: 'Fault_Mode_Master', 
                        ref: 'A1', 
                        headerRow: true, 
                        totalsRow: false, 
                        style: { 
                            theme: 'TableStyleDark3', 
                            showRowStripes: true, 
                        }, 
                        columns: [ 
                            { name: 'fault_mode', filterButton: false }, 
                            { name: 'id', filterButton: false }, 
                        ], 
                        rows: faultModeArr 
                    }); 
                    fault_mode.state = 'veryHidden'; 

                    const User_List = workbook.addWorksheet('Line_User_List'); 
                    // add a table to a sheet 
                    User_List.addTable({ 
                        name: 'Line_User_List', 
                        ref: 'A1', 
                        headerRow: true, 
                        totalsRow: false, 
                        style: { 
                            theme: 'TableStyleDark3', 
                            showRowStripes: true, 
                        }, 
                        columns: [ 
                            { name: 'user_name', filterButton: false }, 
                            { name: 'id', filterButton: false }, 
                        ], 
                        rows: userListArr 
                    }); 
                    User_List.state = 'veryHidden'; 

                    const instrument_status = workbook.addWorksheet('Instrument_Status_Master'); 
                    // add a table to a sheet 
                    instrument_status.addTable({ 
                        name: 'Instrument_Status_Master', 
                        ref: 'A1', 
                        headerRow: true, 
                        totalsRow: false, 
                        style: { 
                            theme: 'TableStyleDark3', 
                            showRowStripes: true, 
                        }, 
                        columns: [ 
                            { name: 'instrument_status', filterButton: false }, 
                            { name: 'id', filterButton: false }, 
                        ], 
                        rows: instrumentStatusArr 
                    }); 
                    instrument_status.state = 'veryHidden'; 

                    const main_component = workbook.addWorksheet('Main_Component_Master'); 
                    // add a table to a sheet 
                    main_component.addTable({ 
                        name: 'Main_Component_Master', 
                        ref: 'A1', 
                        headerRow: true, 
                        totalsRow: false, 
                        style: { 
                            theme: 'TableStyleDark3', 
                            showRowStripes: true, 
                        }, 
                        columns: [ 
                            { name: 'main_component', filterButton: false }, 
                            { name: 'id', filterButton: false }, 
                        ], 
                        rows: mainComponentArr 
                    }); 
                    main_component.state = 'veryHidden'; 

                    const sub_component = workbook.addWorksheet('Sub_Component_Master'); 
                    // add a table to a sheet 
                    sub_component.addTable({ 
                        name: 'Sub_Component_Master', 
                        ref: 'A1', 
                        headerRow: true, 
                        totalsRow: false, 
                        style: { 
                            theme: 'TableStyleDark3', 
                            showRowStripes: true, 
                        }, 
                        columns: [ 
                            { name: 'sub_component', filterButton: false }, 
                            { name: 'id', filterButton: false }, 
                        ], 
                        rows: subComponentArr 
                    }); 
                    sub_component.state = 'veryHidden'; 
    
                    asset_list.dataValidations.add('A2:A9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$A$2:$A$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
    
                    asset_list.dataValidations.add('B2:B9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$B$2:$B$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });

                    asset_list.dataValidations.add('C2:C9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$C$2:$C$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
    
                    asset_list.dataValidations.add('D2:D9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$D$2:$D$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
    
                    asset_list.dataValidations.add('U2:U9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$U$2:$U$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });

                    asset_list.dataValidations.add('V2:V9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$V$2:$V$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
    
                    asset_list.dataValidations.add('P2:P9999', {
                        type: 'custom',
                        allowBlank: false,
                        formulae: ['$P$2:$P$999'],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
                    
                    asset_list.dataValidations.add('H2:H9999', {
                        type: 'list',
                        allowBlank: true,
                        formulae: ['Task_Type_Master!$A$2:$A$' + (TypeListData ? (TypeListData.length + 1).toString() : '2' ) + ''],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
    
                    asset_list.dataValidations.add('I2:I9999', {
                        type: 'list',
                        allowBlank: true,
                        formulae: ['Task_Priority_Master!$A$2:$A$' + (PriorityListData ? (PriorityListData.length + 1).toString() : '2' ) + ''],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });
    
                    asset_list.dataValidations.add('J2:J9999', {
                        type: 'list',
                        allowBlank: true,
                        formulae: ['Task_Status_Master!$A$2:$A$' + (StatusListData ? (StatusListData.length + 1).toString() : '2' ) + ''],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });

                    asset_list.dataValidations.add('AA2:AA9999', {
                        type: 'list',
                        allowBlank: true,
                        formulae: ['Main_Component_Master!$A$2:$A$' + (MainComponentListData ? (MainComponentListData.length + 1).toString() : '2' ) + ''],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });

                    asset_list.dataValidations.add('AB2:AB9999', {
                        type: 'list',
                        allowBlank: true,
                        formulae: ['Sub_Component_Master!$A$2:$A$' + (SubComponentListData ? (SubComponentListData.length + 1).toString() : '2' ) + ''],
                        showErrorMessage: true,
                        errorStyle: 'error',
                        errorTitle: 'Message',
                        error: 'Could Not edit'
                    });

                    asset_list.dataValidations.add('Q2:Q9999', { 
                        type: 'list', 
                        allowBlank: true, 
                        formulae: ['Fault_Mode_Master!$A$2:$A$' + (FaultModeListData ? (FaultModeListData.length + 1).toString() : '2' ) + ''], 
                        showErrorMessage: true, 
                        errorStyle: 'error', 
                        errorTitle: 'Message', 
                        error: 'Could Not edit' 
                    }); 

                    asset_list.dataValidations.add('N2:N9999', { 
                        type: 'list', 
                        allowBlank: true, 
                        formulae: ['Line_User_List!$A$2:$A$' + (UsersListForLineData ? (UsersListForLineData.length + 1).toString() : '2' ) + ''], 
                        showErrorMessage: true, 
                        errorStyle: 'error', 
                        errorTitle: 'Message', 
                        error: 'Could Not edit' 
                    }); 

                    asset_list.dataValidations.add('O2:O9999', { 
                        type: 'list', 
                        allowBlank: true, 
                        formulae: ['Line_User_List!$A$2:$A$' + (UsersListForLineData ? (UsersListForLineData.length + 1).toString() : '2' ) + ''], 
                        showErrorMessage: true, 
                        errorStyle: 'error', 
                        errorTitle: 'Message', 
                        error: 'Could Not edit' 
                    }); 

                    asset_list.dataValidations.add('W2:W9999', { 
                        type: 'list', 
                        allowBlank: true, 
                        formulae: ['Instrument_Status_Master!$A$2:$A$' + (InstrumentStatusData ? (InstrumentStatusData.length + 1).toString() : '2' ) + ''], 
                        showErrorMessage: true, 
                        errorStyle: 'error', 
                        errorTitle: 'Message', 
                        error: 'Could Not edit' 
                    }); 
    
                    asset_list.dataValidations.add('Y2:Y9999', { 
                        type: 'list', 
                        allowBlank: true, 
                        formulae: ['Line_User_List!$A$2:$A$' + (UsersListForLineData ? (UsersListForLineData.length + 1).toString() : '2' ) + ''], 
                        showErrorMessage: true, 
                        errorStyle: 'error', 
                        errorTitle: 'Message', 
                        error: 'Could Not edit' 
                    });

                    const task_type_id_cell = asset_list.getCell('K2');
    
                    // Modify/Add individual cell
                    task_type_id_cell.value = { formula: '=VLOOKUP(Asset_List!H2,Task_Type_Master,2,0)' }

                    const main_component_id_cell = asset_list.getCell('AC2');
                    main_component_id_cell.value = { formula: '=VLOOKUP(Asset_List!AA2,Main_Component_Master,2,0)' }

                    const sub_component_id_cell = asset_list.getCell('AD2');
                    sub_component_id_cell.value = { formula: '=VLOOKUP(Asset_List!AB2,Sub_Component_Master,2,0)' }
    
                    const task_priority_id_cell = asset_list.getCell('L2');
                    task_priority_id_cell.value = { formula: '=VLOOKUP(Asset_List!I2,Task_Priority_Master,2,0)' }
    
                    const task_status_id_cell = asset_list.getCell('M2');
                    task_status_id_cell.value = { formula: '=VLOOKUP(Asset_List!J2,Task_Status_Master,2,0)' }

                    const fault_mode_id_cell = asset_list.getCell('R2'); 
                    fault_mode_id_cell.value = { formula: '=VLOOKUP(Asset_List!Q2,Fault_Mode_Master,2,0)' } 

                    const observed_by_id_cell = asset_list.getCell('S2'); 
                    observed_by_id_cell.value = { formula: '=VLOOKUP(Asset_List!N2,Line_User_List,2,0)' } 

                    const reported_by_id_cell = asset_list.getCell('T2'); 
                    reported_by_id_cell.value = { formula: '=VLOOKUP(Asset_List!O2,Line_User_List,2,0)' } 

                    const instrument_type_id_cell = asset_list.getCell('X2'); 
                    instrument_type_id_cell.value = { formula: '=VLOOKUP(Asset_List!W2,Instrument_Status_Master,2,0)' } 

                    const assigne_id_cell = asset_list.getCell('Z2'); 
                    assigne_id_cell.value = { formula: '=VLOOKUP(Asset_List!Y2,Line_User_List,2,0)' } 
    
                    workbook.xlsx.writeBuffer()
                        .then(buffer => FileSaver.saveAs(new Blob([buffer]), `${headPlant.name}_Task_Template_${moment(Date.now()).format('YYYY_MM_DD HH:mm:ss')}.xlsx`))
                        .catch(err => console.log('Error writing excel export', err))
                   handlDialogClose()
                }
                else{
                    openNotification('Assets/Instruments are not mapping for the Type', 'info');
                }
            }catch(err){
                console.log('ERR',err)
            }
        }
        else{
            openNotification('Assets/Instruments are not mapping for the line', 'info');
        }  
    }
    return(
        <ModalNDL onClose={handlDialogClose}  aria-labelledby="task-add-type-dialog" open={openDialog}>
            <ModalHeaderNDL>
              <TypographyNDL   value={t("Task bulk upload template")} variant="heading-02-s" model />
            </ModalHeaderNDL>
            <ModalContentNDL>
            <SelectBox
                id='select-sort-order'
                value={categoryID} 
                onChange={handleInstrumentCategory} 
                auto={true}
                options={ !InstrumentCategoryListLoading && !InstrumentCategoryListError && InstrumentCategoryListData && InstrumentCategoryListData.length >0?InstrumentCategoryListData:[]}
                isMArray={true}
                keyId={"id"}
                keyValue={"name"}
                label={t('Category')}
                error={isInstrumentCategory}
                msg={isInstrumentCategory?t('Please select category'):undefined}
            ></SelectBox>   
            <SelectBox
                id='select-sort-order'
                value={instrumentTypeID} 
                onChange={handleInstrumentType} 
                auto={true}
                options={ !InstrumentTypeListLoading && !InstrumentTypeListError && InstrumentTypeListData && InstrumentTypeListData.length >0?InstrumentTypeListData:[]}
                isMArray={true}
                keyId={"id"}
                keyValue={"name"}
                label={t('type')}
                error={isInstrumentType}
                msg={isInstrumentType?t('Please select type'):undefined}
            ></SelectBox>  
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" style={{ marginTop: 10, marginBottom: 10,width:"100px" }} value={t('Back')} onClick={() => { handlDialogClose() }} />
                <Button type="primary" style={{ marginTop: 10, marginBottom: 10, marginRight: 10,width:"100px" }} value={t('Download')} onClick={() => downloadTemplate()} />
           
            </ModalFooterNDL>
        </ModalNDL>
    )
})
export default TaskBulkDownloadTemplate;