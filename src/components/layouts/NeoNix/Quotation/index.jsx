import React, { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import EnhancedTable from "components/Table/Table";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import LoadingScreen from "LoadingScreenNDL";
import Button from "components/Core/ButtonNDL";
import useEntity from "components/layouts/NewSettings/Asset/hooks/useEntity.jsx";
import useGetAllCustomerMaster from '../hooks/useGetAllCustomerMaster';
import useGetAllQuotation from '../hooks/useGetAllQuotation';
import useDeleteQuotation from '../hooks/useDeleteQuotation';
import useCreateQuotation from '../hooks/useCreateQuotation';
import useEditQuotation from '../hooks/useEditQuotation';
import moment from "moment";
import Grid from 'components/Core/GridNDL'
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Typography from 'components/Core/Typography/TypographyNDL'
import AddQuotationForm from "components/layouts/NeoNix/Quotation/AddQuotationForm.jsx"
import QuotationPage from './previewPDF';
import { snackToggle, snackMessage, snackType, snackDesc } from "recoilStore/atoms";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import useGetAllPolicy from "../hooks/useGetAllPolicy";

export default function CustomerTable({ setShowTabs }) {
    const previewRef = useRef();
     const formRef = useRef();
    const [page, setPage] = useState('Quotation');
    const [policyData, setPolicyData]= useState('Quotation');
    const [openUnsavedModal, setOpenUnsavedModal] = useState(false);
    const [breadcrumpName, setbreadcrumpName] = useState('Quotation');
    const [isEdit, setisEdit] = useState(false);
    const [editData, setEditData] = useState();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetDesc] = useRecoilState(snackDesc);
    const [, SetType] = useRecoilState(snackType);
    const EntityRef = useRef();
    const [isdelete, setisdelete] = useState(false);
    const [isDownload, setisDownload] = useState(false);
    const [isPreview, setisPreview] = useState(false);  
    const [selecteddelete, setselecteddelete]= useState([]);
    const { EntityLoading } = useEntity();
    const { allCustomersLoading, allCustomersData, allCustomersError, getAllCustomers } = useGetAllCustomerMaster();
    const { allQuotationLoading, allQuotationData, allQuotationError, getAllQuotation } = useGetAllQuotation();
    const {deleteQuotationLoading, deleteQuotationData, deleteQuotationError, getDeleteQuotation} = useDeleteQuotation();
    const {addQuotationLoading, addQuotationData, addQuotationError, getaddQuotation} = useCreateQuotation()
    const {editQuotationLoading, editQuotationData, editQuotationError, geteditQuotation} = useEditQuotation()
    const { allPolicyLoading, allPolicyData, allPolicyError, getAllPolicy } = useGetAllPolicy();
    const [tableData, setTableData] = useState([]);
    const [raawtableData, setRawTableData] = useState([]);

    const headCells = [
        { id: "sno", numeric: false, disablePadding: true, label: "S.NO" ,colSearch: true},
        { id: "QuotationId", numeric: false, disablePadding: false, label: "Quotation ID",colSearch: true },
        { id: "customer", numeric: false, disablePadding: false, label: "Customer",colSearch: true },
        { id: "QuotationDate", numeric: false, disablePadding: false, label: "Quotation Date",colSearch: true },
        { id: "ExpireOn", numeric: false, disablePadding: false, label: "Expire On",colSearch: true },
        { id: "Value", numeric: false, disablePadding: false, label: "Value",colSearch: true, },
    ];

    useEffect(() => {
        getAllCustomers();
        getAllQuotation()
        getAllPolicy()
    }, []);

    useEffect(() => {
        if (!allPolicyLoading && allPolicyData && !allPolicyError) {
            setPolicyData(allPolicyData )
        }
        }, [allPolicyLoading, allPolicyData, allPolicyError]);

     useEffect(()=>{
            if(!deleteQuotationLoading && deleteQuotationData && !deleteQuotationError){
                    if(deleteQuotationData === "Deleted Successfully "){
                        getAllQuotation()
                        setisdelete(false);
                        setOpenSnack(true)
                        SetMessage("Quotation Deleted")
                        SetType("info")
                        SetDesc("The Quotation has been successfully deleted.")
                    }
            }
        },[deleteQuotationLoading, deleteQuotationData, deleteQuotationError])

    useEffect(()=>{
        if(!addQuotationLoading && addQuotationData && !addQuotationError){
            if(addQuotationData === "Created Successfully "){
                getAllQuotation()
                setOpenSnack(true)
                SetMessage("New Quotation Added")
                SetType("info")
                SetDesc("Quotation Info has been successfully Added.")
                setPage('Quotation');
            }
        }
    },[addQuotationLoading, addQuotationData, addQuotationError])

   const handleFormPreview = () => {
        if (formRef.current && formRef.current.getFormData) {
            const formData = formRef.current.getFormData();
            if (!formData.header.ref_enq_id) {
                setOpenSnack(true);
                SetMessage("Select the Enquiry");
                SetType("error");
                SetDesc("");
                return;
            }
            setEditData(formData);
            setisPreview(true);
        }
    };
    
    useEffect(()=>{
        if(!editQuotationLoading && editQuotationData && !editQuotationError){
            if(editQuotationData === "Updated Successfully "){
                getAllQuotation()
                setOpenSnack(true)
                SetMessage("Quotation Updated")
                SetType("info")
                SetDesc("Quotation has been successfully Updated.")
                setPage('Quotation');
            }
        }
    },[editQuotationLoading, editQuotationData, editQuotationError])

    useEffect(() => {
        if (!allQuotationLoading && allQuotationData && !allQuotationError) {
            processQuotationData();
        }
    }, [allQuotationLoading, allQuotationData, allQuotationError]);


    const processQuotationData = () => {
        let tempTableData = [];
        let tempObjectData = [];
        if (Array.isArray(allQuotationData) && allQuotationData.length > 0) {
            
            tempTableData = allQuotationData.map((val, index) => {
                tempObjectData.push({
                        sno: index + 1,
                        QuotationId: val.header?.quo_id || '-',
                        customer: val.customer?.cust_name || '-',
                        QuotationDate: val.header?.quo_date ? moment(val.header?.quo_date).format('YYYY-MM-DD HH:mm:ss') : '',
                        ExpireOn: val.header?.exp_date ? moment(val.header?.exp_date).format('YYYY-MM-DD HH:mm:ss') : '',
                        Value:val.header?.grand_total || '-'
                    });
                return [
                    index + 1,
                    val.header?.quo_id || '-',
                    val.customer?.cust_name || '-',
                    val.header?.quo_date ? moment(val.header?.quo_date).format('YYYY-MM-DD HH:mm:ss') : '',
                    val.header?.exp_date ? moment(val.header?.exp_date).format('YYYY-MM-DD HH:mm:ss') : '',
                    val.header?.grand_total || '-',
                ];
            });
        }

        setTableData(tempTableData);
        setRawTableData(tempObjectData)
    };

    const handleCreateOrder = () => {
        setPage("from");
        setbreadcrumpName("new Quotation");
        setisEdit(false);
    };

    const breadcrump = [
        { id: 0, name: 'Quotation' },
        { id: 1, name: breadcrumpName }
    ];

    const handleActiveIndex = (index) => {
        if (index === 0) {
            setPage('Quotation');
            setisEdit(false);
            setShowTabs(true);
        }
    };
    
     const handleSaveClick = () => {
        if (formRef.current) {
            const formData = formRef.current.getFormData();
            if(formData.header.ref_enq_id === ""){
                        setOpenSnack(true)
                        SetMessage("Select the Enquiry")
                        SetType("error")
                        SetDesc("")
            } else {
            if(isEdit){
                geteditQuotation(formData);
            } else {
            getaddQuotation(formData);
        }
    }
    }
    };
    
    const handlDeleteClose = () =>{
        setisdelete(false);
    }

    const handlPreviewClose = () =>{
        setisPreview(false);
    }

      const handleDelete = (id, value) => {
        setisdelete(true)
        setselecteddelete(value)
    };

    const handleEdit = (id, value) => {
        const selectedQuotation = allQuotationData.filter(x => x.header?.quo_id === value.QuotationId);
        setEditData(selectedQuotation[0]);
        setisEdit(true);
        setbreadcrumpName("Edit Quotation");
        setPage("from");
    };

    const handleView = (id, value) => {
        const selectedQuotation = allQuotationData.filter(x => x.header?.quo_id === value.QuotationId);
        setEditData(selectedQuotation[0]);
        setisPreview(true);
    };
    
    return (
        <React.Fragment>
            {EntityLoading && <LoadingScreen />}

            {page !== 'Quotation' && (
                <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                    <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
                    <div className="flex gap-2">
                            <Button
                                type="ghost"
                                value={"Preview"}
                                onClick={handleFormPreview}
                            />
                        <Button type="secondary" value="Cancel" onClick={() => { setOpenUnsavedModal(true) }} />
                        <Button type="primary" value={isEdit ? "Update" : "Save"} onClick={handleSaveClick} />
                    </div>
                </div>
            )}

            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
                {
                    page === 'Quotation' ? (
                        <>
                            <Grid item style={{ flex: "0 0 auto" }}>
                                <Typography variant="heading-02-xs">{"Quotation"}</Typography>
                            </Grid>

                            <div style={{ padding: '16px 0' }}>
                                <HorizontalLine variant="divider1" style={{ width: '100%' }} />
                            </div>
                            <EnhancedTable
                                headCells={headCells}
                                data={tableData}
                                buttonpresent="Add Quotation"
                                download={true}
                                search={true}
                                onClickbutton={handleCreateOrder}
                                actionenabled={true}
                                rawdata={raawtableData}
                                enableView={true}
                               handleView={(id, value) => (setisPreview(true), handleView(id, value))}
                                handleEdit={(id, value) => handleEdit(id, value)}
                                handleDelete={(id, value) => handleDelete(id, value)}
                                enableDelete={true}
                                enableEdit={true}
                                Buttonicon={Plus}
                                verticalMenu={true}
                                groupBy={"policy"}
                            />
                            <ModalNDL onClose={handlDeleteClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={isdelete}>
                                <ModalHeaderNDL>
                                    <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Are you sure want to delete?"} />
                                </ModalHeaderNDL>
                                <ModalContentNDL>
                                    <TypographyNDL value={"Do you really want to delete the quotation? This action cannot be undone."} variant='paragraph-s' color='secondary' />
                                </ModalContentNDL>
                                <ModalFooterNDL>
                                    <Button value={'Cancel'} type='secondary'  onClick={() => { handlDeleteClose() }} />
                                    <Button value={'Delete'} type="primary" danger style={{ marginLeft: 8 }} onClick={() => getDeleteQuotation(selecteddelete.QuotationId)}/>
                                
                                </ModalFooterNDL>
                            </ModalNDL> 
                        </>
                    ) : (
                       <AddQuotationForm
                            ref={formRef}
                            isPreview={isPreview}
                            isEdit={isEdit}
                            editData={editData}
                            ispreview={isPreview}
                            onClose={()=>{
                                handlPreviewClose()
                            }}
                            onSuccess={() => {
                                setPage('Quotation');
                            }}
                        />
                    )
                }
            </div>
         <ModalNDL maxWidth={"xs"} open={openUnsavedModal}>
            <ModalHeaderNDL>
                <TypographyNDL value={"Confirmation Required"} variant='heading-02-xs' />
            </ModalHeaderNDL>
            <ModalContentNDL>
                <TypographyNDL value={"You have unsaved changes in this quotation form. Leaving now will discard all unsaved information. Save your changes before exiting to avoid losing progress."} variant='paragraph-s' />
            </ModalContentNDL>
            <ModalFooterNDL>
                <div className="flex justify-end gap-1">
                    <Button
                        type="secondary"
                        variant="secondary"
                        onClick={() => setOpenUnsavedModal(false)}
                        value="Close"
                    />
                    <Button
                        variant="warning"
                        onClick={() => {
                            setOpenUnsavedModal(false);
                            setPage('Quotation');
                            setShowTabs(true);
                        }}
                        value='Exit'
                    />
                </div>
            </ModalFooterNDL>
        </ModalNDL>
             <ModalNDL onClose={handlPreviewClose} width={"800px"} aria-labelledby="entity-dialog-title" open={isPreview}>
            <ModalHeaderNDL>
                <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Confirmation Required"} />
            </ModalHeaderNDL>
            <ModalContentNDL height>
                <div className="h-[75vh]">
                    <QuotationPage ref={previewRef} viewdata={editData} policyData={policyData}/>
                </div>
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button value={'Cancel'} type='secondary' onClick={handlPreviewClose} />
                <Button
                    value={'Download PDF'}
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => previewRef.current && previewRef.current.downloadPDF()}
                />
            </ModalFooterNDL>
        </ModalNDL>
        </React.Fragment>
    );
}
