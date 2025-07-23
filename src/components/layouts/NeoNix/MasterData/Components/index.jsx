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
import AddPolicyForm from "./AddComponentsForm";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import { useTranslation } from 'react-i18next';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import useDeletePolicy from "components/layouts/NeoNix/hooks/useDeletePolicy";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import useGetDropDownOptions from "../Assets/hooks/useGetDropDownoptions";
import useGetComponents from "./hooks/useGetComponents";
import useDeleteComponets from "./hooks/useDeleteComponent";


export default function CompanyTable({ setShowTabs }) {
    const [headPlant] = useRecoilState(selectedPlant)
    const [isdelete, setisdelete] = useState(false);
    const [selecteddelete, setselecteddelete]= useState([]);
    const EntityRef = useRef();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
     const [, SetDesc] = useRecoilState(snackDesc);
    const [, SetType] = useRecoilState(snackType);
    const [OverallData,setOverallData] = useState([]);
    const { EntityLoading } = useEntity();
    const { t } = useTranslation();
    const [ToolDialog, setToolDialog] = useState(false);
    const [tableData,setTableData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [dialogMode, setDialogMode] = useState('');
    const [updateValue, setUpdateValue]= useState([]);
    const {dropDownOptionsLoading, dropDownOptionsData, dropDownOptionsError, getDropDownOptions } = useGetDropDownOptions();
    const [Operationoptions,setOperationoptions] = useState([]);
    const {  getComponentsLoading, getComponentsData, getComponentsError, getComponents  } = useGetComponents();
    const { deleteComponentLoading, deleteComponentData, deleteComponentError, deleteComponent } = useDeleteComponets();
    const headCells = [
        { id: "sno", numeric: false, disablePadding: true, label: "S.NO" },
        { id: "ComponentID", numeric: false, disablePadding: false, label: "Component ID" },
        { id: "ComponentName", numeric: false, disablePadding: false, label: "Component Name" },
        { id: "ComponentType", numeric: false, disablePadding: false, label: "Component Type" },
        { id: "Description", numeric: false, disablePadding: false, label: "Description" }
    ];
    
    useEffect(()=>{
        if(!deleteComponentLoading && deleteComponentData && !deleteComponentError){
                if(deleteComponentData === "Deleted Successfully "){
                    setisdelete(false);
                    setOpenSnack(true)
                    SetMessage("Component Deleted")
                    SetType("info")
                    SetDesc("The Component has been successfully deleted.")
                    getComponents()
                }else if(deleteComponentData === "The component is linked to a product. Remove the mapping to proceed with deletion" ){
                    setisdelete(false);
                    setOpenSnack(true)
                    SetMessage("The component is linked to a product.")
                    SetType("error")
                    SetDesc("Remove the mapping to proceed with deletion.")

                }else{
                    setisdelete(false);
                    setOpenSnack(true)
                    SetMessage("Unable to Delete Component")
                    SetType("error")
                    SetDesc("The Component could not be deleted. Please try again later.")
                }
        }
    },[deleteComponentLoading, deleteComponentData, deleteComponentError])

    useEffect(()=>{
        getComponents()
        getDropDownOptions("OperationMaster/GetOperationMaster")
    },[headPlant])


    useEffect(() => {
        if(!getComponentsLoading &&  getComponentsData && !getComponentsError){
            if(getComponentsData && Array.isArray(getComponentsData)){
                let formattedData = getComponentsData.map(x=>x.header)

                const  formatted = formattedData.map((x, index) => {
                    return [
                        index + 1,
                       x.com_id ? x.com_id : "",
                       x.com_name ? x.com_name : "",
                       x.com_type ? x.com_type : "",
                       x.description ? x.description : ''
                    ];
                });
                setTableData(formatted);
                setOverallData(formattedData)
                setRawData(getComponentsData)

            }

        }

    },[getComponentsLoading, getComponentsData, getComponentsError]);


    useEffect(() => { 
        if(!dropDownOptionsLoading &&  dropDownOptionsData &&  !dropDownOptionsError){
            if(dropDownOptionsData.GetOperationMaster && Array.isArray(dropDownOptionsData.GetOperationMaster)){
                setOperationoptions(dropDownOptionsData.GetOperationMaster.filter(x=>x.op_id && x.stepno ));
            }

        }
      }, 
    [dropDownOptionsLoading, dropDownOptionsData, dropDownOptionsError]);


   

    const handleNewTool = () => { 
        setToolDialog(true); 
        setUpdateValue([])
        setDialogMode('create');  
    }

    const handleModalClose = (isChange) => {
        setToolDialog(false);  
        if(isChange){
            getComponents()
        }
    }

    const handleDeletePolicy = (id, value) => {
        setisdelete(true)
        setDialogMode('delete');  
        if(value && value.header && Object.keys(value.header).length > 0){
            setselecteddelete(value.header)
        }
    }

    const handleUpdatePolicy = (id, value) => {
        setUpdateValue(value)
        setDialogMode('edit');  
        setToolDialog(true); 
    }

    const handlDeleteClose = () =>{
        setisdelete(false);
    }


    return (
        <React.Fragment>
        {(EntityLoading || getComponentsLoading) && <LoadingScreen />}

        <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
            <EnhancedTable
                headCells={headCells}
                data={tableData}
                buttonpresent="Add Component"
                download={true}
                search={true}
                onClickbutton={handleNewTool}
                actionenabled={true}
                rawdata={rawData}
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
                        <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Delete Component"} />
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        <TypographyNDL value={`${t('Do you really want to delete the')} ${selecteddelete && selecteddelete.com_name  ? selecteddelete.com_name  :  ""} ? All the associated items with this component will be affected. This action cannot be undone.`} variant='paragraph-s' color='secondary' />
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button value={t('Cancel')} type='secondary'  onClick={() => { handlDeleteClose() }} />
                        <Button value={t('Delete')} type="primary" danger style={{ marginLeft: 8 }} onClick={() => deleteComponent({com_id:selecteddelete.com_id})}/>
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
                    onSuccess={(value) => {
                        handleModalClose(value);
                    }}
                    onClose={handleModalClose}
                    Operationoptions={Operationoptions}
                    OverallData={OverallData}
                />
            </ModalNDL>
        )}
    </React.Fragment>

    );
}
