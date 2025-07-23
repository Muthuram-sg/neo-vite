import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';
import History from 'assets/neo_icons/Menu/History.svg?react';
import User from 'assets/neo_icons/Menu/User.svg?react';
import moment from 'moment';
import useAddMaintenanceLogsDetails from "../hooks/useAddMaintenanceLogsDetails";
import useGetMaintenanceLogsDetails from "../hooks/useGetMaintenanceLogsDetails";
import {
    selectedItem,
    user,
    selectedPlant,
    exploreRange,
    customdates,
    snackToggle,
    snackMessage,
    snackType
} from "recoilStore/atoms";
import { useAuth } from "components/Context";
import configParam from "config";
import InputFieldNDL from "components/Core/InputFieldNDL";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import LoadingScreenNDL from 'LoadingScreenNDL';


export default function MaintenanceLogsList() {
    const { HF } = useAuth();
    const { t } = useTranslation();
    const titleRef = useRef();
    const nameRef = useRef();
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [currUser] = useRecoilState(user);
    const [nameNotValid,] = useState(false);
    const [titleNotValid,setTitleNotValid] = useState(false);
    const [SelectedItem] = useRecoilState(selectedItem);
    const [selectedRange] = useRecoilState(exploreRange);
    const [, setMaintenanceInfoHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [customdatesval,] = useRecoilState(customdates);

    const [maintenanceLogsDialog, setMaintenanceLogsDialog] = useState({ open: false, type: "" });
    const {
        outMaintenanceLogsLoading,
        outMaintenanceLogsData,
        outMaintenanceLogsError,
        getAddMaintenanceLogsDetails,
    } = useAddMaintenanceLogsDetails();

    const {
        outMaintenanceInfoLoading,
        outMaintenanceInfoData,
        outMaintenanceInfoError,
        getMaintenanceLogsDetails,
    } = useGetMaintenanceLogsDetails();
    
    function getFromandToDate(range) {
        let frmDate = "";
        let toDate = "";
        if (range === 17) {
            frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
            toDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
        } else if (range === 16) {
            frmDate = configParam.DATE_ARR(Number(range), headPlant)
            toDate = moment(moment().subtract(1, 'month')).endOf('month').format("YYYY-MM-DDTHH:mm:ssZ")
        } else if (range === 7) {
            frmDate = configParam.DATE_ARR(Number(range), headPlant)
            toDate = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
        } else {
            frmDate = configParam.DATE_ARR(Number(range), headPlant)
            toDate = moment().format("YYYY-MM-DDTHH:mm:ssZ")
        }
        return { frmDate, toDate }
    }

    const getMaintenanceLogsHistory = (entity_id) => {

        const { frmDate, toDate } = getFromandToDate(selectedRange)

        if (entity_id && frmDate && toDate) {
            setLoading(true)
            getMaintenanceLogsDetails(entity_id, frmDate, toDate)
        }
    }

    const handleCreateDialogOpen = () => {

        if (!SelectedItem.name) {
            SetMessage(t("SelectanyAsset"))
            SetType("warning")
            setOpenSnack(true)
        }
        else {
            setMaintenanceLogsDialog({ open: true, type: "create" })
            setTimeout(() => {
                nameRef.current.value = SelectedItem.name ? SelectedItem.name : "";
            }, 500);
        }
    }

    const handleMaintenanceLogsClose = () => {
        setTitleNotValid(false)
        setMaintenanceLogsDialog({ open: false, type: "" })
    };

    const handleMaintenanceLogsSave = () => {
        if (SelectedItem.id && nameRef.current.value && titleRef.current.value) {
            getAddMaintenanceLogsDetails(
                SelectedItem.id,
                headPlant.id,
                titleRef.current.value,
                currUser.id
            );
        } else if(nameRef.current.value && titleRef.current.value === "") {
            setTimeout(() => {
                nameRef.current.value = SelectedItem.name ? SelectedItem.name : "";
            }, 100);
            
            setTitleNotValid(true)
        }
        else{
            console.log("NEW MODEL", "IDT", "undefined", "MaintenanceLogs Explore", new Date());
        }
    };

    useEffect(() => {
        if (SelectedItem.id) {
            getMaintenanceLogsHistory(SelectedItem.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedItem, customdatesval, selectedRange])

    useEffect(() => {
        if (!outMaintenanceLogsLoading && !outMaintenanceLogsError && outMaintenanceLogsData) {
            if (outMaintenanceLogsData.affected_rows >= 1) {
                handleMaintenanceLogsClose();
                SetMessage(t('AddMaintenanceInfo') + " " + outMaintenanceLogsData.returning[0].entity.name)
                SetType("success")
                setOpenSnack(true)
                setTimeout(() => {
                    getMaintenanceLogsHistory(SelectedItem.id)
                }, 1000);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outMaintenanceLogsLoading, outMaintenanceLogsData, outMaintenanceLogsError])

    useEffect(() => {
        if (!outMaintenanceInfoLoading && !outMaintenanceInfoError && outMaintenanceInfoData) {

            if (outMaintenanceInfoData.length > 0) {
                console.log(SelectedItem.name, "name");

            }
            else {
                setMaintenanceInfoHistory([])
            }
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outMaintenanceInfoLoading, outMaintenanceInfoData, outMaintenanceInfoError])

    const renderButtonLabel = () => {
        if(maintenanceLogsDialog.type === "create")
            return t('Save') 
        else
            return maintenanceLogsDialog.type === "edit" ? t('Update') : t('YesDelete')
    }

    const renderCentercontent = () => {
        if(outMaintenanceInfoData && outMaintenanceInfoData.length > 0)
        {
            return  <div orientation="vertical" style={{ "maxHeight": "73.4vh", overflow: "auto",padding:"0px 50px" }}>
                    {outMaintenanceInfoData.map((val, index) => {
                        return (
                            <ol key={index+1} class="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li class="mb-10 ml-6">
                                    <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                                        <History stroke={"#007BFF"} />
                                    </span>
                                    {/* <Typography style={{ fontSize: "14px" }} >{moment(val.created_ts).format("DD/MM/YYYY") + " - " + moment(val.created_ts).format(HF.HM)}</Typography> */}
                                    <ParagraphText value={moment(val.created_ts).format("DD/MM/YYYY") + " - " + moment(val.created_ts).format(HF.HM)} variant={"Caption1"}/>
                                        <ParagraphText style={{ textTransform: "capitalize" }} value={val.log} variant={"Body2Reg"}/>
                                        {/* <ParagraphText value={val.value} variant={"Caption2"}></ParagraphText>  */}
                                        <div style={{ display: "flex" }}>
                                            <User />
                                            <ParagraphText value={val.user.name} variant={"Caption2"}/>
                                        </div>
                                </li>

                            </ol>
                            
                        )
                    }
                    )}
                </div>
        }
        else{
            return <ParagraphText   value={t("MaintenanceInfoNotFound") + " " + SelectedItem.name} variant={"Caption2"} />
        }
    }

    return (
        <div style={{ display: "block" }}>
            {loading && <LoadingScreenNDL />}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", marginTop: "10px" }} >
                <Button type="primary"
                    onClick={() => { handleCreateDialogOpen() }}
                    value={t("AddLogs")}
                />
            </div>

            <ModalNDL onClose={handleMaintenanceLogsClose} size={"md"} aria-labelledby="maintenanceLogs-dialog-title" open={maintenanceLogsDialog.open} disableBackdropClick>
            <ModalHeaderNDL> 
                <ParagraphText id="maintenanceLogs-dialog-title" variant="heading-02-s" model value={maintenanceLogsDialog.type ==="create" ? 'Add Logs' : ""} />
               </ModalHeaderNDL>
                <ModalContentNDL>
                    {(maintenanceLogsDialog.type === "create" || maintenanceLogsDialog.type === "edit") &&
                        <React.Fragment>
                            <InputFieldNDL
                                id="metric-name"
                                label={t('AssetName*')}
                                type="text"
                                placeholder="Asset Name"
                                inputRef={nameRef}
                                error={nameNotValid}
                                helperText={nameNotValid ? t("Please Enter Asset Name") : ''}
                                disabled="true"
                            />
                            <InputFieldNDL
                                id="metric-title"
                                label={t('Maintenance Info *')}
                                type="text"
                                placeholder={t("Enter Maintenance Info")}
                                inputRef={titleRef}
                                error={titleNotValid}
                                helperText={titleNotValid ? t("Please Enter Maintenance Info") : ''}
                            />
                        </React.Fragment>
                    }

                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="primary" danger={maintenanceLogsDialog.type === "delete" ? true : false} value={renderButtonLabel()}
                        onClick={() => handleMaintenanceLogsSave()}
                    />
                    <Button type="secondary" danger value={maintenanceLogsDialog.type === "Delete" ? t('NoCancel') : t('Cancel')} onClick={() => handleMaintenanceLogsClose()} />

                </ModalFooterNDL>
            </ModalNDL>

            {SelectedItem.name ? renderCentercontent()
                : <ParagraphText  value={t("SelectAnyAssetinHierarchy")} variant={"Caption2"} />
            }
        </div>
    )
}