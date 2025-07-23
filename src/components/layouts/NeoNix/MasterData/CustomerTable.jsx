import React, { useState, useRef, useEffect } from "react";
import EnhancedTable from "components/Table/Table";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import { useRecoilState } from "recoil";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from "recoilStore/atoms";
import LoadingScreen from "LoadingScreenNDL";
import useCreateCustomer from "../hooks/useCreateCustomer";
import Button from "components/Core/ButtonNDL";
import useEntity from "components/layouts/NewSettings/Asset/hooks/useEntity.jsx";
import AddCustomerForm from "./AddCustomerForm.jsx";
import useGetAllCustomerMaster from '../hooks/useGetAllCustomerMaster';
import moment from "moment";
import useDeleteCustomer from "../hooks/useDeleteCustomer";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import { useTranslation } from 'react-i18next';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import useEditCustomer from "../hooks/useEditCustomer";
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx"; 

export default function CustomerTable({ setShowTabs, handleSave }) {
  const [page, setPage] = useState('customer');
  const [headPlant] = useRecoilState(selectedPlant);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [breadcrumpName, setbreadcrumpName] = useState('customer');
  const [isEdit, setisEdit] = useState(false);
  const EntityRef = useRef();
  const [isdelete, setisdelete] = useState(false);
  const [updateValue, setUpdateValue]= useState([]);
  const [selecteddelete, setselecteddelete]= useState([]);
  const { EntityLoading } = useEntity();
  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const { createCustomerLoading, createCustomerData, createCustomerError, getCreateCustomer } = useCreateCustomer()
  const { allCustomersLoading, allCustomersData, allCustomersError, getAllCustomers } = useGetAllCustomerMaster();
  const {deleteCustomerLoading, deleteCustomerData, deleteCustomerError, getDeleteCustomer} = useDeleteCustomer()
  const { editCustomerLoading, editCustomerData, editCustomerError, getEditCustomer } = useEditCustomer()
  const [tableData, setTableData] = useState([]);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetDesc] = useRecoilState(snackDesc);
  const [, SetType] = useRecoilState(snackType);

  const headCells = [
    { id: "sno", numeric: false, disablePadding: true, label: "S.NO" },
    { id: "customerId", numeric: false, disablePadding: false, label: "Customer ID" },
    { id: "customer", numeric: false, disablePadding: false, label: "Customer" },
    { id: "industryType", numeric: false, disablePadding: false, label: "Industry Type" },
    { id: "lastUpdatedOn", numeric: false, disablePadding: false, label: "Last Updated On" },
    { id: "lastUpdatedBy", numeric: false, disablePadding: false, label: "Last Updated By" },
  ];
  
    useEffect(() => {
        getAllCustomers();
        getUsersListForLine(headPlant.id);
    }, [headPlant.id]) 

  useEffect(()=>{
    if(!createCustomerLoading && createCustomerData && !createCustomerError){
            if(createCustomerData === "Created Successfully "){
                getAllCustomers()
                setOpenSnack(true)
                SetMessage("New Customer Added")
                SetType("info")
                SetDesc("Customer Info has been successfully Added.")
                setPage('customer');
                setShowTabs(true);
            }
          }
  },[createCustomerLoading, createCustomerData, createCustomerError])

  useEffect(()=>{
    if(!editCustomerLoading && editCustomerData && !editCustomerError){
            if(editCustomerData === "Updated Successfully "){
                getAllCustomers()
                setOpenSnack(true)
                SetMessage("Customer Updated")
                SetType("info")
                setPage('customer');
                setShowTabs(true);
                SetDesc("Customer Info has been successfully Updated.")
            }
          }
  },[editCustomerLoading, editCustomerData, editCustomerError])

  useEffect(()=>{
        if(!deleteCustomerLoading && deleteCustomerData && !deleteCustomerError){
                if(deleteCustomerData === "Deleted Successfully "){
                    getAllCustomers()
                    setisdelete(false);
                    setOpenSnack(true)
                    SetMessage("Customer Info Deleted")
                    SetType("info")
                    SetDesc("The Customer Info has been successfully deleted.")
                }
        }
    },[deleteCustomerLoading, deleteCustomerData, deleteCustomerError])

  useEffect(() => {
    if (!allCustomersLoading && allCustomersData && !allCustomersError) {
      processCustomerData();
    }
  }, [allCustomersLoading, allCustomersData, allCustomersError, UsersListForLineData]);
  

  const processCustomerData = () => {
    let tempTableData = [];
    if (Array.isArray(allCustomersData) && allCustomersData.length > 0) {
      tempTableData = allCustomersData.map((val, index) => {
         const matchedUser =UsersListForLineData && UsersListForLineData.length > 0 && UsersListForLineData.find(
        (user) => user?.userByUserId?.sgid === val.mdy_by
      );

      const modifiedByName = matchedUser?.userByUserId?.name || '-';
        return [
          index + 1,
          val.cust_code || '-',
          val.cust_name || '-',
          val.industriel_type || '-',
          val.mdy_dt ? moment(val.mdy_dt).format('DD/MM/YYYY hh:mm:ss') : '',
          modifiedByName
        ];
      });
    }
  
    setTableData(tempTableData);
  };
  
  const handleCreateOrder = () => {
    setPage("from");
    setbreadcrumpName("new customer");
    setisEdit(false);
    setShowTabs(false);
    setUpdateValue([])
    EntityRef.current.handleEntityDialog();
  };

  const breadcrump = [
    { id: 0, name: 'customer' },
    { id: 1, name: breadcrumpName }
  ];

  const handleActiveIndex = (index) => {
    if (index === 0) {
      setPage('customer');
      setisEdit(false);
      setShowTabs(true);
    }
  };

const handleSavecustomer = () => {
  if (EntityRef.current) {
    EntityRef.current.handleTriggerSave((isValid, formData) => {
      if (isValid) {
        if(isEdit){
          getEditCustomer(formData)
        } else {
        getCreateCustomer(formData)
        }
        handleSave(true, formData);
      }
    });
  }
};

  const handleUpdateCustomer = (id, value) => {
    setUpdateValue(value); 
    setisEdit(true);  
    setPage("from");  
    setbreadcrumpName("Edit Customer");
    setShowTabs(false);

    setTimeout(() => {
      EntityRef.current?.handleEntityDialog();
    }, 0);
  };

    const handleDeleteCustomer = (id, value) => {
        setisdelete(true)
        setselecteddelete(value)
    }

   const handlDeleteClose = () =>{
        setisdelete(false);
    }

  return (
    <React.Fragment>
      {(EntityLoading || allCustomersLoading) && <LoadingScreen />}

      {page !== 'customer' && (
      <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
        <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
        <div className="flex gap-2">
          <Button type="secondary" value="Cancel" onClick={() => { setOpen(true) }} />
          <Button type="primary" value={isEdit ? "Update" : "Save"} onClick={handleSavecustomer} />
        </div>
      </div>
    )}

      <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
        {
          page === 'customer' ? (
            <div>
            <EnhancedTable
              headCells={headCells}
              data={tableData}
              buttonpresent="Add Customer"
              download={true}
              search={true}
              onClickbutton={handleCreateOrder}
              actionenabled={true}
              rawdata={allCustomersData}
              handleEdit={(id, value) => handleUpdateCustomer(id, value)}
              handleDelete={(id, value) => handleDeleteCustomer(id, value)}
              enableDelete={true}
              enableEdit={true}
              Buttonicon={Plus}
              verticalMenu={true}
               groupBy={"policy"}
            />
            <ModalNDL onClose={handlDeleteClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={isdelete}>
                <ModalHeaderNDL>
                    <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Delete Policy"} />
                </ModalHeaderNDL>
                <ModalContentNDL>
                    <TypographyNDL value={`${t('Do you really want to delete the')} ${selecteddelete.cust_name} ? All Enquiry and Quotations associated with this customer will be affected. This action cannot be undone.`} variant='paragraph-s' color='secondary' />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button value={t('Cancel')} type='secondary'  onClick={() => { handlDeleteClose() }} />
                    <Button value={t('Delete')} type="primary" danger style={{ marginLeft: 8 }} onClick={() => getDeleteCustomer(selecteddelete.id, selecteddelete.cust_code)}/>
                
                </ModalFooterNDL>
            </ModalNDL> 
           
            </div>
          ) : (
         <AddCustomerForm
          ref={EntityRef} 
          edit={isEdit}
          editData={updateValue}
          onSuccess={() => {
            setPage('customer');
          }}
          handleSave={handleSavecustomer}
        />
          )
        }
      </div>
          <ModalNDL maxWidth={"xs"} open={open}>
                    <ModalHeaderNDL>
                        <TypographyNDL value={"Confirmation Required"} variant='heading-02-xs' />
                    </ModalHeaderNDL>
                    <ModalContentNDL >
                        <TypographyNDL value={"You have unsaved changes in this enquiry form. Leaving now will discard all unsaved information. Save your changes before exiting to avoid losing progress."} variant='paragraph-s' />
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <div className="flex justify-end gap-1">
                            <Button type="secondary" variant="secondary" onClick={() => setOpen(false)} value="Close" />
                            <Button variant="warning" onClick={() =>  { setPage('customer'); setShowTabs(true); setOpen(false) }} value='Exit'/>
                        </div>
                    </ModalFooterNDL>
                </ModalNDL>
    </React.Fragment>
  );
}
