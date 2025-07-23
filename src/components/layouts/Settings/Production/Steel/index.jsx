/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import {useParams} from "react-router-dom"
import Grid from 'components/Core/GridNDL';
import Typography from 'components/Core/Typography/TypographyNDL';
import Button from "components/Core/ButtonNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL';
import moment from 'moment';
import { useRecoilState } from "recoil";
import { themeMode, selectedPlant, userData, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import "components/style/instrument.css";
import EnhancedTable from "components/Table/Table";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Edit from 'assets/neo_icons/Menu/ActionEdit.svg?react';
import SteelLight from 'assets/neo_icons/Steel/SteelForms.svg?react';
import SteelDark from 'assets/neo_icons/Illustrations/ReportIll_dark.svg?react';
import SteelForm from "./components/SteelForm";
import useGetSteelAssetConfig from "./hooks/useGetSteelAssetConfig";
import useAddSteelAssetConfig from "./hooks/useAddSteelAssetConfig";
import useUpdateSteelAssetConfig from "./hooks/useUpdateSteelAssetconfig";
import AddCalcModel from "./components/AddCalcModel";

export default function SteelData() {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [curTheme] = useRecoilState(themeMode);
    const [section, setSection] = useState('table');
    const [tabledata, setTableData] = useState([])
    const [currUser] = useRecoilState(userData);
    const [newSteelAssetConfigdata, setNewSteelAssetConfigdata] = useState({});
    const [steelAssetConfigitem, setSteelAssetConfigitem] = useState({});
    const [editForm, setEditForm ] = useState(false); 
    const [btnStatus, setBtnStatus] = useState(true);
    const AddCalculationsRef = useRef();
    let {moduleName,subModule1} = useParams()

    //Hooks
    const { SteelAssetConfigLoading, SteelAssetConfigData, SteelAssetConfigError, getSteelAssetConfig } = useGetSteelAssetConfig();
    const { addSteelAssetConfigLoading, addSteelAssetConfigData, addSteelAssetConfigError, addSteelAssetConfig } = useAddSteelAssetConfig();
    const { updateSteelAssetConfigLoading, updateSteelAssetConfigData, updateSteelAssetConfigError, updateSteelAssetConfig } = useUpdateSteelAssetConfig()

    const headCells = [
        {
            id: 'S_No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: false,
            label: t('Asset'),
        },
        {
            id: 'Product',
            numeric: false,
            disablePadding: false,
            label: t('Product'),
        },
        {
            id: 'added_bY',
            numeric: false,
            disablePadding: false,
            label: t('AddedBy'),
        },
        {
            id: 'added_on',
            numeric: false,
            disablePadding: false,
            label: t('AddedOn'),
        },
    ];

    useEffect(() => {
        getSteelAssetConfig(headPlant.id)
        if(moduleName === "steel_report" && subModule1 === "new"){
            setSection("create")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant,moduleName,subModule1])

    const handleFormClick = () => {
        setSection("create");
    };

    const Listarray = [
        { index: 'Steel Data', name: 'Steel Data' },
        { index: 'New Form', name: 'New Form' },
    ]

    const handleActiveIndex = (index) => {
        if (index === 0) {
            setSection('table')
        }
    }

    const handleCancelClick = () => {
        getSteelAssetConfig(headPlant.id)
        setSteelAssetConfigitem({});
        setSection('table')
        setEditForm(false);
    }

    const handleSaveClick = () => {
        let formData = newSteelAssetConfigdata;
        formData.user_id = currUser.id;
        formData.line_id = headPlant.id;
        setNewSteelAssetConfigdata(formData);
        addSteelAssetConfig(newSteelAssetConfigdata);
        setSection('table')
        setNewSteelAssetConfigdata({});
    }

    useEffect(() => {
        if (!SteelAssetConfigLoading && !SteelAssetConfigError && SteelAssetConfigData) {
            processedrows()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SteelAssetConfigData])

    useEffect(() => {
        if (addSteelAssetConfigData && !addSteelAssetConfigLoading && !addSteelAssetConfigError) {
            if (addSteelAssetConfigData.id) {
                SetMessage(t('Added Steel Asset config data '))
                SetType("success")
                setOpenSnack(true);
                getSteelAssetConfig(headPlant.id);
            } else {
                SetMessage(t('Failed to Steel Asset config data '))
                SetType("error")
                setOpenSnack(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addSteelAssetConfigData]);

    
    useEffect(() => {
        if (updateSteelAssetConfigData && !updateSteelAssetConfigLoading && !updateSteelAssetConfigError) {
            if (updateSteelAssetConfigData.affected_rows >= 1) {
                AddCalculationsRef.current.handleConfirmDialogOpen(newSteelAssetConfigdata);
            } else {
                SetMessage(t('Failed to Steel Asset config data '))
                SetType("error")
                setOpenSnack(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateSteelAssetConfigData]);

    const processedrows = () => {
        var temptabledata = []
        if (SteelAssetConfigData && SteelAssetConfigData.length > 0) {
            // eslint-disable-next-line array-callback-return
            temptabledata = temptabledata.concat(SteelAssetConfigData.map((val, index) => {
                return [index + 1, val.entity.name, val.steel_product.name, val.user.name, moment(val.created_ts).format('DD/MM/YYYY')]
               
            })
            )
        }
        setTableData(temptabledata)
    }

    const addSteelAssetCofig = (e) => {
      
        setNewSteelAssetConfigdata(e);
    }

    const handleAddCalcDialog = (val) => {
        AddCalculationsRef.current.handleAddCalcDialog(val)
    }

    const handleDeleteAddCalc = (val) => {
        AddCalculationsRef.current.handleDeleteDialogOpen(val)
    }

    const handleEditClick = (val) => {
        setEditForm(true);
        setBtnStatus(true)
    }

    const handleEditOrder = (val) => {
        setSection("edit");
        setSteelAssetConfigitem(val);
    }

    const editSteelAssetCofig = (e) => {
      
        setNewSteelAssetConfigdata(e);
    }

    const handleUpdateClick = () => {
       
        updateSteelAssetConfig(newSteelAssetConfigdata);
    }

    const handleSnackBar  =(type,message) =>{
        SetType(type);SetMessage(message);setOpenSnack(true);
    }

    let renderContent;

        if (section === "create") {
            renderContent = (
                <div className="flex justify-between items-center p-3">
                    <Breadcrumbs breadcrump={Listarray} onActive={handleActiveIndex} />
                    <div className="flex">
                        <Button type="secondary" style={{ marginRight: '12px' }} value={t("Cancel")} onClick={handleCancelClick} />
                        <Button type="primary" value={t("create")} disabled={!newSteelAssetConfigdata.entity_id || !newSteelAssetConfigdata.product_id || !newSteelAssetConfigdata.form_layout || btnStatus} onClick={handleSaveClick} />
                    </div>
                </div>
            );
        } else if (section === "edit" && !editForm) {
            renderContent = (
                <div className="flex justify-between items-center p-3">
                    <Typography variant="heading-02-xs" > {t('Steel Data')}</Typography>
                    <div className="flex">
                        <Button type="secondary" style={{ marginRight: '12px' }} value={t("Cancel")} onClick={handleCancelClick} />
                        <Button type="tertiary"  value={t("Edit Form")} onClick={() => handleEditClick()} icon={Edit} />
                    </div>
                </div>
            );
        } else if (!editForm) {
            renderContent = (
                <div className="flex justify-between items-center p-3">
                    <Typography variant="heading-02-xs" > {t('Steel Data')}</Typography>
                    <Button type="tertiary" value={t("New Form")} onClick={handleFormClick} icon={Plus} />
                </div>
            );
        }
        let renderContent2;

        if (section === "create" || section === "edit") {
            renderContent2 = (
                <SteelForm 
                    data={section === "edit" ? steelAssetConfigitem : {}} 
                    editForm={section === "edit" ? editForm : false} 
                    addSteelAssetCofig={(e) => {addSteelAssetCofig(e)}} 
                    editSteelAssetCofig={(e) => {editSteelAssetCofig(e)}} 
                    validateFormFields={(e) => {validateFormFields(e)}} 
                /> 
            );
        } else if (section === "table" && SteelAssetConfigData && SteelAssetConfigData.length > 0) {
            renderContent2 = (
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    download={true}
                    search={true}
                    actionenabled={true}
                    rawdata={SteelAssetConfigData}
                    enableView={true}
                    enableDelete={true}
                    handleView={(id, value) => handleEditOrder(value)}
                    handleDelete={(id, value) => handleDeleteAddCalc(value)}
                    enableButton={t("Add Calculations")}
                    buttontype={"ghost"}
                    handleCreateTask={(id, value) => handleAddCalcDialog(value)}
                    buttoncolor={"#558B2F"}
                    buttonhoverColor={"#33691E"}
                    disabledbutton={[]}
                    customBtn
                    FilterCol
            verticalMenu={true}
            groupBy={'steel'}
                />
            );
        } else {
            renderContent2 = (
                <Grid container justify="center" style={{ height: 'auto'}}>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        {curTheme === 'light' ? <SteelLight /> : <SteelDark />}
                        <Typography color="tertiary"> {t('Create A New Manual Entry Form')}</Typography>
                    </Grid>
                </Grid>
            );
        }  
           
        const validateFormFields = (status) => {
            setBtnStatus(false);
        }  

    return (
        <React.Fragment>
            <div>
                <AddCalcModel
                    ref={AddCalculationsRef}
                    getUpdatedSteelAssetConfig={(id) => getSteelAssetConfig(id)}
                    setHandleCancelClick={() => handleCancelClick()}
                    handleSnackBar={(type,message) => handleSnackBar(type,message)}
                />
                {renderContent}
                {
                    editForm === true ?
                        <div className="flex justify-between p-3 bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
                            <Breadcrumbs breadcrump={Listarray} onActive={handleActiveIndex} />
                            <div className="flex">
                                <Button type="secondary" style={{marginRight: '12px' }} value={t("Cancel")} onClick={handleCancelClick} />
                                <Button type="primary" value={t("Update")}  onClick={handleUpdateClick} disabled={btnStatus} />
                            </div>
                        </div>
                    :<></>
                }
            </div>

            <HorizontalLine variant="divider1" />

            <Grid container className={"bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4"} >
                {/* TOPBAR */}
                <Grid item xs={12} style={{height:"100%",width:"100%"}}>
                {renderContent2}
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
