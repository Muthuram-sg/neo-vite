/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
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


export default function RealInstrument() {
    const { t } = useTranslation();
    const AddInstrumentref = useRef()
    const [headPlant] = useRecoilState(selectedPlant);
    const [categories, setCategories] = useState([]);
    const [iso,setIso] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false)
    //table pagination and search
    const [, setSearch] = useState("");
    const [, setTotCount] = useState(0);
    const [tabledata, setTableData] = useState([])
    const { realInstrumentListLoading, realInstrumentListData, realInstrumentListError, getRealInstrumentList } = useRealInstrumentList()
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
    const { ParameterListLoading, ParameterListData, ParameterListError, getParameterList } = useParameterList()
    const { InstrumentClassLoading, InstrumentClassData, InstrumentClassError, getInstrumentClass } = useInstrumentClass();

    useEffect(()=>{
        if(!InstrumentClassLoading && InstrumentClassData && !InstrumentClassError){
        setIso(InstrumentClassData);
    }
    },[InstrumentClassLoading, InstrumentClassData, InstrumentClassError,])

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
        var temptabledata = [];
        if (realInstrumentListData && realInstrumentListData.length > 0) {
            temptabledata = temptabledata.concat(realInstrumentListData.map((val, index) => {
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
            }));
        }
    
        setTableData(temptabledata);
        setLoading(false);
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
        AddInstrumentref.current.handleFormulaCrudDialogEdit(id, data)
       
    }

    const handleFormulaCrudDialogDuplicate = (id,data)=>{
        AddInstrumentref.current.handleFormulaCrudDialogDuplicate(id,data)
    }
    const handleFormulaCrudDialogDelete = (id, data) => {
        AddInstrumentref.current.handleFormulaCrudDialogDelete(id, data)
    }

    const handleFormulatDialogAdd = () => {
        AddInstrumentref.current.handleFormulatDialogAdd()
    }

    const refreshTable = () =>{
        setLoading(true)
    }
    return (
        <React.Fragment>
            {loading && <LoadingScreenNDL />}
            <div style={{ padding: 16 }}>
                <AddInstrument
                    ref={AddInstrumentref}
                    getInstrumentFormulaList={getInstrumentFormulaList}
                    categories={categories}
                    isostandard={iso}
                    metrics={metrics}
                    refreshTable={refreshTable}
                />
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    buttonpresent={t("New instrument")}
                    download={true}
                    search={true}
                    onClickbutton={handleFormulatDialogAdd}
                    actionenabled={true}
                    rawdata={realInstrumentListData}
                    handleCreateDuplicate={(id, value) => handleFormulaCrudDialogDuplicate(id, value)}
                    handleEdit={(id, value) => handleFormulaCrudDialogEdit(id, value)}
                    handleDelete={(id, value) => handleFormulaCrudDialogDelete(id, value)}
                    enableDelete={true}
                    enableEdit={true}
                    Buttonicon={Plus}
                    rowSelect={true}
                    checkBoxId={"Instrument ID"}
                />


            </div>
        </React.Fragment>
    )
}