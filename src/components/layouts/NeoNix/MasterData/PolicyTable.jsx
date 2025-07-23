import React, { useState, useRef, useEffect } from "react";
import EnhancedTable from "components/Table/Table";
import { useRecoilState } from "recoil";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import LoadingScreen from "LoadingScreenNDL"
import moment from "moment";
import Button from "components/Core/ButtonNDL";
import useEntity from "components/layouts/NewSettings/Asset/hooks/useEntity.jsx";
import useUsersListForLine from 'components/layouts/Settings/UserSetting/hooks/useUsersListForLine';
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from "recoilStore/atoms";
import AddPolicyForm from "./AddPolicyForm";
import ModalNDL from 'components/Core/ModalNDL';
import useGetAllPolicy from "../hooks/useGetAllPolicy";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import { useTranslation } from 'react-i18next';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import useDeletePolicy from "../hooks/useDeletePolicy";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

export default function CompanyTable({ setShowTabs }) {
    const [page, setPage] = useState('Policy');
    const [breadcrumpName, setbreadcrumpName] = useState('Policy');
    const [headPlant] = useRecoilState(selectedPlant)
    const [isdelete, setisdelete] = useState(false);
    const [selecteddelete, setselecteddelete]= useState([]);
    const EntityRef = useRef();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
     const [, SetDesc] = useRecoilState(snackDesc);
    const [, SetType] = useRecoilState(snackType);
    const { EntityLoading } = useEntity();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [ToolDialog, setToolDialog] = useState(false);
    const [tableData,setTableData] = useState([]);
    const [dialogMode, setDialogMode] = useState('');
    const [updateValue, setUpdateValue]= useState([]);
    const { allPolicyLoading, allPolicyData, allPolicyError, getAllPolicy } = useGetAllPolicy();
    const {deletePolicyLoading, deletePolicyData, deletePolicyError, getDeletePolicy} = useDeletePolicy();
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const headCells = [
        { id: "sno", numeric: false, disablePadding: true, label: "S.NO" },
        { id: "Policy Name", numeric: false, disablePadding: false, label: "Policy Name" },
        { id: "Type", numeric: false, disablePadding: false, label: "Type" },
        { id: "Status", numeric: false, disablePadding: false, label: "Status" },
        { id: "Effective Date", numeric: false, disablePadding: false, label: "Effective Date" },
        { id: "Expiry Date", numeric: false, disablePadding: false, label: "Expiry Date" },
        { id: "lastUpdatedOn", numeric: false, disablePadding: false, label: "Last Updated On" },
        { id: "lastUpdatedBy", numeric: false, disablePadding: false, label: "Last Updated By" },
    ];
    
    useEffect(()=>{
        if(!deletePolicyLoading && deletePolicyData && !deletePolicyError){
                if(deletePolicyData === "Deleted Successfully "){
                    getAllPolicy()
                    setisdelete(false);
                    setOpenSnack(true)
                    SetMessage("Policy Deleted")
                    SetType("info")
                    SetDesc("The Policy has been successfully deleted.")
                }
        }
    },[deletePolicyLoading, deletePolicyData, deletePolicyError])

    useEffect(()=>{
        getAllPolicy()
        getUsersListForLine(headPlant.id)
    },[headPlant])

    useEffect(()=>{
        if(!allPolicyLoading && allPolicyData && !allPolicyError && UsersListForLineData){
            setTableData(allPolicyData)
            processPolicyData();
        } 
    },[allPolicyLoading, allPolicyData, allPolicyError, UsersListForLineData])


    const processPolicyData = () => {
        let temptabledata = [];
        if (allPolicyData && allPolicyData.length > 0) {
            temptabledata = allPolicyData.map((val, index) => {
                const matchedUser = UsersListForLineData.find(
                    user => user?.userByUserId?.sgid === val.modi_by
                );
                
                const modifierName = matchedUser?.userByUserId?.name || val.modi_by;
    
                return [
                    index + 1,
                    val.policy_name,
                    val.policy_type,
                    val.status,
                    moment(val.effective_date + "Z").format('DD/MM/YYYY'),
                    moment(val.expiry_date + "Z").format('DD/MM/YYYY'),
                    val.modi_dt ? moment(val.modi_dt + "Z").format('DD/MM/YYYY HH:mm:ss') : "",
                    modifierName
                ];
            });
        }
        
        setTableData(temptabledata);
    };    

    const handleNewTool = () => { 
        setToolDialog(true); 
        setUpdateValue([])
        setDialogMode('create');  
    }

    const handleModalClose = () => {
        setToolDialog(false);  
        getAllPolicy()
    }

    const handleDeletePolicy = (id, value) => {
        setisdelete(true)
        setselecteddelete(value)
    }

    const handleUpdatePolicy = (id, value) => {
        setUpdateValue(value)
        setToolDialog(true); 
    }

    const handlDeleteClose = () =>{
        setisdelete(false);
    }


    return (
        <React.Fragment>
        {(EntityLoading || allPolicyLoading) && <LoadingScreen />}

        <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
            <EnhancedTable
                headCells={headCells}
                data={tableData}
                buttonpresent="New Policy"
                download={true}
                search={true}
                onClickbutton={handleNewTool}
                actionenabled={true}
                rawdata={allPolicyData}
                handleEdit={(id, value) => handleUpdatePolicy(id, value)}
                handleDelete={(id, value) => handleDeletePolicy(id, value)}
                enableDelete={true}
                enableEdit={true}
                Buttonicon={Plus}
                verticalMenu={true}
                groupBy={"policy"}
            />
        </div>

        <ModalNDL onClose={handlDeleteClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={isdelete}>
                    <ModalHeaderNDL>
                        <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Delete Policy"} />
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        <TypographyNDL value={`${t('Do you really want to delete the')} ${selecteddelete.policy_name} ? All the associated items with this policy will be affected. This action cannot be undone.`} variant='paragraph-s' color='secondary' />
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button value={t('Cancel')} type='secondary'  onClick={() => { handlDeleteClose() }} />
                        <Button value={t('Delete')} type="primary" danger style={{ marginLeft: 8 }} onClick={() => getDeletePolicy(selecteddelete.policy_id.toString())}/>
                   
                    </ModalFooterNDL>
                </ModalNDL> 

        {ToolDialog && (
            <ModalNDL
                open={ToolDialog}
                onClose={handleModalClose} 
                size="md"
            >
                <AddPolicyForm
                    ref={EntityRef}
                    editData={updateValue}
                    ToolDialog={ToolDialog}
                    dialogMode={dialogMode}
                    onValidationFailed={() => alert("Validation failed")}
                    onSuccess={() => {
                        handleModalClose();
                    }}
                    onClose={handleModalClose}
                />
            </ModalNDL>
        )}
    </React.Fragment>

    );
}
