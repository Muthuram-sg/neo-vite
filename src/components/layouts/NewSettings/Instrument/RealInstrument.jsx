/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { selectedPlant,snackMessage,snackType,snackToggle, instrumentsList } from "recoilStore/atoms";
import "components/style/instrument.css";
import EnhancedTable from "components/Table/Table";
import useRealInstrumentList from "./Hooks/useRealInstrumentList";
import AddInstrument from "./InstrumentModel";
import LoadingScreenNDL from "LoadingScreenNDL"; 

//Hooks
import useInstrumentCategory from "Hooks/useInstrumentCategory";
import useParameterList from "./Hooks/useParameterList";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useInstrumentClass from './Hooks/useInstrumentClass';
import Tag from 'components/Core/Tags/TagNDL'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL' 
import useDeleteInstrument from "./Hooks/useDeleteInstrument";
import useDeleteInstrumentFormula from "./Hooks/useDeleteInstrumentFormula";
import useRefreshInstrument from "./Hooks/useRefreshInstrumentData";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import Button from "components/Core/ButtonNDL";  
import useDeleteOfflineAlerts from "./Hooks/useDeleteOfflineAlerts";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine";



export default function RealInstrument(props) {
    const { t } = useTranslation();
    const AddInstrumentref = useRef()
    const [headPlant] = useRecoilState(selectedPlant);
    const [categories, setCategories] = useState([]);
    const [iso,setIso] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [, setLoading] = useState(false);
    const [UserOption, setUserOption] = useState([]);
    //table pagination and search
    const [, setSearch] = useState("");
    const [, setTotCount] = useState(0);
    const [tabledata, setTableData] = useState([])
    const [IntruList, setIntruList] = useRecoilState(instrumentsList);
    const { realInstrumentListLoading, realInstrumentListData, realInstrumentListError, getRealInstrumentList } = useRealInstrumentList()
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
    const { ParameterListLoading, ParameterListData, ParameterListError, getParameterList } = useParameterList()
    const { InstrumentClassLoading, InstrumentClassData, InstrumentClassError, getInstrumentClass } = useInstrumentClass();
    const { DeleteInstrumentLoading, DeleteInstrumentData, DeleteInstrumentError,getDeleteInstrument  } = useDeleteInstrument()
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [downloadabledata, setdownloadabledata] = useState([]);
    const [page,setPage] = useState('instrument')
    const [buttonLoader, setbuttonLoader] = useState(false)
    const [OpenModel,setOpenModel] = useState(false)
    const [InstID, setInstrumentID] = useState('')
    const [, setInsFreq] = useState('');
    const [, setCategoryID] = useState('');
    const [, setTypeID] = useState('');
    const { DeleteInstrumentFormulaLoading, DeleteInstrumentFormulaData, DeleteInstrumentFormulaError, getDeleteInstrumentFormula } = useDeleteInstrumentFormula()
    const [formulaName, setFormulaName] = useState('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    const { RefreshInstrumentlLoading, RefreshInstrumentlData, RefreshInstrumentlError, getRefreshInstrument } = useRefreshInstrument();
    const { delOfflinewithoutIDLoading, delOfflinewithoutIDData, delOfflinewithoutIDError, getDeleteOfflineInstument }=useDeleteOfflineAlerts() ;
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const [,setbredCrumbName] = useState('New Instrument')
    const [pageidx,setPageidx] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    useEffect(()=>{
        if(!InstrumentClassLoading && InstrumentClassData && !InstrumentClassError){
        setIso(InstrumentClassData);
    }
    },[InstrumentClassLoading, InstrumentClassData, InstrumentClassError,])


    useEffect(() => {
        if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
            if(UsersListForLineData.length > 0){
                getUserOption(UsersListForLineData)
            }
          
        }
    }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError])

    const getUserOption = (UsersListForLineData) => {
        let userOption = []
        userOption = UsersListForLineData.map(x => {
            let id = x.user_id
            let format = x.userByUserId.name + " (" + x.userByUserId.sgid + ")"
            return Object.assign(x, { "id": id, "value": format });
        })

        setUserOption(userOption)
    }
    useEffect(() => {
        getUsersListForLine(headPlant.id)

    }, [headPlant]);


    useEffect(() => {

        if (!DeleteInstrumentLoading && !DeleteInstrumentError && DeleteInstrumentData) {
    
            getDeleteInstrumentFormula(InstID, headPlant.id)
            // getDeleteOfflineInstument(InstID, headPlant.id)
            getRefreshInstrument(headPlant.schema)
        }
        else if (DeleteInstrumentError) {
            
            SetMessage(t('The Instrument could not be deleted.Try again!'))
            SetType("error")
            setOpenSnack(true)
            refreshTable();
            getInstrumentFormulaList()
            handleDialogClose();


        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteInstrumentLoading, DeleteInstrumentData, DeleteInstrumentError])

    useEffect(() => {

        if (!delOfflinewithoutIDLoading && !delOfflinewithoutIDError && delOfflinewithoutIDData) {

        }
        else if (delOfflinewithoutIDError) {
            
            SetMessage(t('The Instrument could not be deleted.Try again!'))
            SetType("error")
            setOpenSnack(true)
            refreshTable();
            getInstrumentFormulaList()
            handleDialogClose();


        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delOfflinewithoutIDLoading, delOfflinewithoutIDData, delOfflinewithoutIDError])




    useEffect(() => {
        if (!DeleteInstrumentFormulaLoading && !DeleteInstrumentFormulaError && DeleteInstrumentFormulaData) {
             
            if (DeleteInstrumentFormulaData.affected_rows >= 1) {
                SetMessage(t('DeleteInstrument') + ' ' + formulaName)
                SetType("success")
                setOpenSnack(true)       
            }
            else {
                SetMessage(t('The Instrument could not be deleted.Try again!'))
                SetType("warning")
                setOpenSnack(true)
            }
            refreshTable();
            getInstrumentFormulaList();
            handleDialogClose();

        }
        else if (!DeleteInstrumentFormulaLoading && DeleteInstrumentFormulaError && DeleteInstrumentFormulaData === null) {
            
            SetMessage(t('The Instrument could not be deleted.Try again!'))
            SetType("error")
            setOpenSnack(true)
            handleDialogClose();


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteInstrumentFormulaLoading, DeleteInstrumentFormulaData, DeleteInstrumentFormulaError])



    const headCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
            width:100
        },
        {
            id: 'Instrument ID',
            numeric: false,
            disablePadding: true,
            label: t('Instrument ID'),
            width:130
        },
        {
            id: 'Instrument Name',
            numeric: false,
            disablePadding: false,
            label: t('Instrument Name'),
            width:160
        },
        {
            id: 'Instrument Category',
            numeric: false,
            disablePadding: false,
            label: t('Instrument Category'),
            width:200
        },
        {
            id: 'Instrument Type',
            numeric: false,
            disablePadding: false,
            label: t('Instrument Type'),
            width:160
        },
        {
            id: 'Data Transfer Mode',
            numeric: false,
            disablePadding: false,
            label: t('Data Transfer Mode'),
            width:160
        },
        {
            id: 'Added By',
            numeric: false,
            disablePadding: false,
            label: t('Added By'),
            width:120
        },
   

    ];

    const processedrows = () => {
        let temptabledata = [];
        let downloadableData = []
        if (realInstrumentListData && realInstrumentListData.length > 0) {
            temptabledata = temptabledata.concat(realInstrumentListData.map((val, index) => {
                if (val) {
                    return [
                        index + 1, 
                        val.id ? val.id : 0,
                        val.name ? val.name : "",
                        val.instrument_category ? val.instrument_category.name : "",
                        val.instrumentTypeByInstrumentType ? val.instrumentTypeByInstrumentType.name : "",
                        val.is_offline ?
                        <div className="flex items-center justify-center">
  <Tag 
                        lessHeight
                        noWidth='80px'
                        style={{ 
                            textAlign: "center" 
                        }} 
                        colorbg={"neutral"}
                        name={ t("Offline") } 
                    />
                        </div>
                      :  
                      <div className="flex items-center justify-center">
                      <Tag 
                    lessHeight
                     noWidth='80px'
                    style={{ 
                        textAlign: "center" 
                    }} 
                    colorbg={"success"}
                    name={ t("Online") } 
                />
                </div>,               
                        val.userByUpdatedBy ? val.userByUpdatedBy.name : ""
                    ];
                } else return [];
            }));

            downloadableData = realInstrumentListData.map((val, index) => {
                if (val) {
                    return [
                        index + 1, 
                        val.id ? val.id : 0,
                        val.name ? val.name : "",
                        val.instrument_category ? val.instrument_category.name : "",
                        val.instrumentTypeByInstrumentType ? val.instrumentTypeByInstrumentType.name : "",
                        val.is_offline ? t("Offline") : t("Online"),               
                        val.userByUpdatedBy ? val.userByUpdatedBy.name : ""
                    ];
                } else return [];
            });

        }
        setdownloadabledata(downloadableData)
        setTableData(temptabledata);
        setLoading(false);
        setPage("instrument")
        props.handleHide(false)
        setbuttonLoader(false)
    };

    useEffect(() => {

        setLoading(true)

        getInstrumentFormulaList()
        fetchCategoriesAndInstrumentType()
        getInstrumentClass()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant]);

    function getInstrumentFormulaList() {
        if (headPlant) getRealInstrumentList(headPlant.id)
    }

    useEffect(() => {

        if (!realInstrumentListLoading && !realInstrumentListError && realInstrumentListData) {
            processedrows()
            setTotCount(realInstrumentListData.length)
            setIntruList(realInstrumentListData)
            setSearch("")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realInstrumentListLoading, realInstrumentListData, realInstrumentListError])


    useEffect(() => {

        if (!InstrumentCategoryListLoading && !InstrumentCategoryListError && InstrumentCategoryListData) {
            setCategories(InstrumentCategoryListData)
        }
        else {
            setCategories([])
        }
    }, [InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError])


    useEffect(() => {

        if (!ParameterListLoading && !ParameterListError && ParameterListData) {
            setMetrics(ParameterListData)
        }

    }, [ParameterListLoading, ParameterListData, ParameterListError])

 

    function getCategoriesList() {
        getInstrumentCategory()

    }



    function getMetricList() {
        getParameterList()

    }

    function fetchCategoriesAndInstrumentType() {
        getCategoriesList();
        getMetricList();
    }


    const handleFormulaCrudDialogEdit = (id, data) => {
        setbredCrumbName("Edit Instrument")
        setPage("form")
        props.handleHide(true)
        props.handleHide(true)
        setTimeout(()=>{
            AddInstrumentref.current.handleFormulaCrudDialogEdit(id, data)
          },200)
       
    }

    const handleFormulaCrudDialogDuplicate = (id,data)=>{
        setPage("form")
        props.handleHide(true)
        setTimeout(()=>{
        AddInstrumentref.current.handleFormulaCrudDialogDuplicate(id,data)
    },200)

    }
    const handleFormulaCrudDialogDelete = (id, data) => {
        setOpenModel(true)
        setInstrumentID(data && data.id ? data.id : "")
        setInsFreq(data.frequncy)
        setFormulaName(data && data.name ? data.name : "")
        setCategoryID(data && data.instrument_category ? data.instrument_category.id : "");
        setTypeID(data && data.instrumentTypeByInstrumentType ? data.instrumentTypeByInstrumentType.id : "");
        // AddInstrumentref.current.handleFormulaCrudDialogDelete(id, data)
    }

    const handleFormulatDialogAdd = () => {
        setPage("form")
        setbredCrumbName("New Instrument")
        props.handleHide(true)
        AddInstrumentref.current.handleFormulatDialogAdd()
    }

    const refreshTable = () =>{
        setLoading(true)
    }

    const handlepageChange =()=>{
        setPage("instrument")
        props.handleHide(false)
    }


    const handleDeleteInstrument=()=>{
        if(InstID){
            getDeleteInstrument(InstID)
        }

    }

    const handleDialogClose =()=>{
        setOpenModel(false)
    }

    
   

    return (
        <React.Fragment>
            {realInstrumentListLoading && <LoadingScreenNDL />}
                {/* <AddInstrument
                    ref={AddInstrumentref}
                    getInstrumentFormulaList={getInstrumentFormulaList}
                    categories={categories}
                    isostandard={iso}
                    metrics={metrics}
                    refreshTable={refreshTable}
                /> */}
                        

                        {
                    page === 'instrument' &&
            <div className="h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
              <TypographyNDL value='Instrument' variant='heading-02-xs' />
            </div>
                        
                }


                        {
                            page === 'instrument' ?
                            <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">

                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    buttonpresent={t("New instrument")}
                    download={true}
                    search={true}
                    tagKey={["Data Transfer Mode"]} 
                    onClickbutton={handleFormulatDialogAdd}
                    actionenabled={true}
                    rawdata={realInstrumentListData}
                    handleCreateDuplicate={(id, value) => handleFormulaCrudDialogDuplicate(id, value)}
                    handleEdit={(id, value) => handleFormulaCrudDialogEdit(id, value)}
                    handleDelete={(id, value) => handleFormulaCrudDialogDelete(id, value)}
                    enableDelete={true}
                    enableEdit={true}
                    Buttonicon={Plus}
                    downloadabledata={downloadabledata}
                    downloadHeadCells={headCells}
                    verticalMenu={true}
                    groupBy={'instrument_settings'}
                    onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                     page={pageidx}
                     rowsPerPage={rowsPerPage}
                />
                </div>
                :
                <AddInstrument
                    ref={AddInstrumentref}
                    getInstrumentFormulaList={getInstrumentFormulaList}
                    categories={categories}
                    isostandard={iso}
                    metrics={metrics}
                    refreshTable={refreshTable}
                    handlepageChange={handlepageChange}
                    enableButtonLoader={(e)=>{setbuttonLoader(e)}}
                    buttonLoader={buttonLoader}
                    UserOption={UserOption}
                />
                        }

<ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={OpenModel}>
        <ModalHeaderNDL>
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("Are you sure want to delete ?")} />
        </ModalHeaderNDL>
        <ModalContentNDL>
            <TypographyNDL variant='paragraph-s' color='secondary' value={"Do you really want to delete the instrument? This action cannot be undone."} />
        </ModalContentNDL>
        <ModalFooterNDL>
            <Button value={t('Cancel')}  type="secondary" onClick={() => { handleDialogClose() }} />
            <Button value={t('Delete')}  danger  loading={DeleteInstrumentLoading || DeleteInstrumentFormulaLoading} onClick={()=>handleDeleteInstrument()} />
       
        </ModalFooterNDL>
    </ModalNDL> 


        </React.Fragment>
    )
}