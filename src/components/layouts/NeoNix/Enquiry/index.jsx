import React ,{ useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


import EditEnquiryForm from './EditEnquiryForm';
import EnhancedTable from "components/Table/Table";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import useGetAllEnquiryList from "components/layouts/NeoNix/hooks/useGetAllEnquiryList";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ModalNDL from 'components/Core/ModalNDL';
import Button from 'components/Core/ButtonNDL';
import Typography from "components/Core/Typography/TypographyNDL";
import useDeleteEnquiry from 'components/layouts/NeoNix/hooks/useDeleteEnquiry';
import LoadingScreenNDL from "LoadingScreenNDL"; 
import FFTPlot from 'assets/neo_icons/Menu/3DPlot.svg?react';
import { set } from 'lodash';
import moment from 'moment';

import { useRecoilState } from 'recoil';
// import LoadingScreenNDL from "LoadingScreenNDL"; 
import { snackToggle, snackMessage, snackType, snackDesc, selectedPlant } from 'recoilStore/atoms';


function Enquiry(){
    const { t } = useTranslation();

    const [tableData, setTableData] = useState([]);
    const [editData, setEditData] = useState({});
    const [downloadabledata, setdownloadabledata] = useState([]);
    const [pageidx,setPageidx] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [isEdit, setIsEdit] = useState(false);
    const [preview, setPreview] = useState(false);

    const { enquiryLoading, enquiryData, enquiryError, getAllEnquiries } = useGetAllEnquiryList();
    const { deleteEnquiryLoading, deleteEnquiryData, deleteEnquiryError, getDeleteEnquiry } = useDeleteEnquiry();

    const [, setOpenSnack] = useRecoilState(snackToggle);
            const [, SetMessage] = useRecoilState(snackMessage);
            const [, SetType] = useRecoilState(snackType);
            const [, SetDesc] = useRecoilState(snackDesc);

    const [headPlant] = useRecoilState(selectedPlant)


    const breadcrump = [{ id: 0, name: "Enquiry" }];
    const headCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
            // width:100
        },
        {
            id: 'Enquiry ID',
            numeric: false,
            disablePadding: true,
            label: t('Enquiry ID'),
            // width:130
        },
        {
            id: 'Customer',
            numeric: false,
            disablePadding: false,
            label: t('Customer'),
            // width:160
        },
        {
            id: 'Enquiry Date',
            numeric: false,
            disablePadding: false,
            label: t('Enquiry Date'),
            // width:160
        },
        {
            id: 'Enquiry Type',
            numeric: false,
            disablePadding: false,
            label: t('Enquiry Type'),
            // width:160
        },
        {
            id: 'Priority',
            numeric: false,
            disablePadding: false,
            label: t('Priority'),
            // width:120
        },
        {
            id: 'Assignee',
            numeric: false,
            disablePadding: false,
            label: t('Assignee'),
            // width:120
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: false,
            label: t('Status'),
            // width:120
        },
   

    ];

    useEffect(() => {
        // alert("Enquiry");
        getAllEnquiries();
    }, [isEdit, headPlant])

    

    const getEnquiryType = (enquiryType) => {
        switch (enquiryType) {
            case 'SLO':
                return 'Sale Order';
            case 'CO':
                return 'Claim Order';
            case 'SMPLO':
                return 'Sample Order';
            default:
                return 'Unknown';
                break;
        }
    }

    const getEnquiryStatus = (status) => {
        switch (status) {
            case 'O':
                return 'Open';
            case 'C':
                return 'Closed';
            case 'P':
                return 'Pending';
            case 'QC':
                return 'Quotation Created';
            default:
                return 'Unknown';
        }
    }

    const getPriority = (priority) => {
        switch (priority) {
            case 'H':
                return (<div className='px-2 py-1 rounded-lg' style={{ backgroundColor: '#FFCDCE', color: '#CE2C31' }}>High</div>);
            case 'M':
                return (<div className='px-2 py-1 rounded-lg' style={{ backgroundColor: '#FFEE9C', color: '#AB6400' }}>Medium</div>);
            case 'L':
                return (<div className='px-2 py-1 rounded-lg' style={{ backgroundColor: '#ADDDC0', color: '#2B9A66' }}>Low</div>);
            default:
                return 'Unknown';
        }
    }

    const handleDeleteEnquiry = () => {
        let enq_id = enquiryData[deleteId]?.header?.enq_id;
        console.log("Enquiry Data", enquiryData[deleteId]?.header.status === "O");
        console.log("Delete Enquiry ID", enq_id);
        if(enquiryData[deleteId]?.header.status === "O"){
            getDeleteEnquiry(enq_id);
            setOpen(false);
            setOpenSnack(true)
            SetMessage("Enquiry Deleted Successfully")
            SetType("success")
            SetDesc("Enquiry has been deleted Updated")
        } else {
            setOpen(false);
            setOpenSnack(true)
            SetMessage("Unable to delete the Enquiry")
            SetType("warning")
            SetDesc("There are quotations mapped to the enquiry. Kindly delete them before proceeding with enquiry deletion.")
        }

    }

    useEffect(() => {
        if(deleteEnquiryData === 'Deleted Successfully ') {
            // console.log("Enquiry Deleted Successfully");
            getAllEnquiries();
            // setDeleteId(null);
        }
    }, [deleteEnquiryData])

    useEffect(() => {
        if (enquiryData !== null && enquiryData !== undefined) {
            let temp = [];
            let temp1 = [];
            console.clear()
            console.log("Enquiry Data", enquiryData);
            enquiryData.map((item, index) => {
                temp.push({
                    s_no: index+1,
                    enquiry_id: item?.header?.enq_id,
                    customer: item?.header?.cust_name,
                    enquiry_date: item?.header?.enq_date,
                    enquiry_type: getEnquiryType(item?.header?.enq_type),
                    priority: getPriority(item?.header?.priority),
                    assignee: item?.header?.assin_name,
                    status: item?.header?.status
                });
                temp1.push([
                    index+1,
                    item?.header?.enq_id,
                    item?.header?.cust_name,
                    item?.header?.header_create_dt ? moment(item?.header?.header_create_dt).format('DD/MM/YYYY') : '-',
                    getEnquiryType(item?.header?.enq_type),
                    getPriority(item?.header?.priority),
                    item?.header?.assin_name,
                    getEnquiryStatus(item?.header?.status)
                ]);
            });
            setTableData(temp1);
        }
    }, [enquiryData]);


    return (
        <>
        {enquiryLoading ? <><LoadingScreenNDL /></> : <>
        {
            isEdit 
            ? <EditEnquiryForm editData={editData} preview={preview} onCancel={() => setIsEdit(false)} isEdit={isEdit} isEditChange={() => console.log("EDIT")} company={{}}/>
            : 
            <>
                <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                    <BredCrumbsNDL breadcrump={breadcrump} onActive={() => {}} />
                </div>
        
                <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
                    <EnhancedTable 
                        headCells={headCells}
                        // data={[[1, 'ENQ1233', 'John Doe', '2023-10-01', 'Product Inquiry', 'High', 'Alice Smith', 'Open']]}
                        data={tableData}
                        buttonpresent={t("New Enquiry")}
                        download={true}
                        search={true}
                        actionenabled={true}
                        rawdata={[[1, 'ENQ1233', 'John Doe', 'ABC Corp', '2023-10-01', 'Product Inquiry', 'High', 'Alice Smith', 'Open']]}
                        // rawData={tableData}
                        onClickbutton={() => { setEditData({}); setPreview(false); setIsEdit(true) }}
                        handleEdit={(id, value) => {
                            setPreview(false);
                            setEditData(enquiryData[id]);
                            setIsEdit(true);
                        }}
                        // customAction={{ icon: FFTPlot, name: 'Locate in Graph', stroke: '#0F6FFF' }}
                        // customhandle={(id) => {
                        //     setPreview(true);
                        //     // setEditData(enquiryData[id]);
                        //     // setIsEdit(true)
                        // }}
                        handleDelete={(id, value, e) => {setOpen(true);console.log(id);setDeleteId(id)}}
                        enableDelete={true}
                        enableEdit={true}
                        enableView={true}
                        handleView={(id, value) => {
                            console.log(id, value)
                            setEditData(enquiryData[id]);
                            setPreview(true);
                            setIsEdit(true)
                        }}
                        downloadabledata={downloadabledata}
                        downloadHeadCells={headCells}
                        // verticalMenu={false}
                        onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                         page={pageidx}
                         rowsPerPage={rowsPerPage}
                         verticalMenu={true}
                        groupBy={'neonix_enquiry'}
                    />
                </div>

                <ModalNDL onClose={() => {console.clear()}} maxWidth={"xs"} open={open}>
                    <ModalHeaderNDL>
                        <Typography value={"Confirmation "} variant='heading-02-xs' />
                    </ModalHeaderNDL>
                    <ModalContentNDL >
                        <Typography value={"Are you sure you want to delete this enquiry?"} variant='body-01' />
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <div className="flex justify-end gap-1">
                            <Button type="tertiary" variant="secondary" onClick={() => { setOpen(false); }} value="Cancel" />
                            <Button variant="warning" onClick={() => handleDeleteEnquiry()} value='Delete'/>
                        </div>
                    </ModalFooterNDL>
                </ModalNDL>
            </>
        }
        </> }
        </>
    )
}
export default Enquiry;