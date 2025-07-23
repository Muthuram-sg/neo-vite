import React, { useState, useRef, useEffect } from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import LoadingScreen from "LoadingScreenNDL";
import Button from "components/Core/ButtonNDL";
import useEntity from "components/layouts/NewSettings/Asset/hooks/useEntity.jsx";
import useGetCompanyMaster from "components/layouts/NeoNix/hooks/useGetCompanyMaster.jsx";
import EditCompanyForm from "./EditCompanyForm";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import CompanyHeader from './CompanyHeader'
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import { use } from "i18next";



export default function CompanyForm({ setShowTabs, ...props }) {
    const [page, setPage] = useState("Company Info");
    const [breadcrumpName, setbreadcrumpName] = useState("Company Info");
    const { companyData, companyLoading, companyError, getAllCompany } = useGetCompanyMaster();
    const [isEdit, setIsEdit] = useState(false);
    
    const [company, setCompany] = useState(null);
    const EntityRef = useRef();
    const { EntityLoading } = useEntity();

    const [headPlant] = useRecoilState(selectedPlant)

    useEffect(() => {
        if(isEdit === false){
            getAllCompany()
        }
    }, [isEdit, headPlant]);

    useEffect(() => {
        setIsEdit(false);
        setPage("Company Info");
    }, [headPlant])

    useEffect(() => {
        if(!companyLoading && !companyError){
            if(companyData && companyData.length > 0) {

                console.log("Company Data:", companyData);
                setCompany(companyData[0]); // Assuming you want to set the first company as default
                // setbreadcrumpName(companyData[0].companyName); // Set the breadcrumb name to the first company's name
            } else if (companyData.length === 0) {
                setIsEdit(true);
                setCompany([])
            }
        } else {
            setIsEdit(false);
        }
    }, [companyData, companyLoading, companyError]);



    const breadcrump = [{ id: 0, name: "Company Info" }, { id: 1, name: breadcrumpName }];
    const handleActiveIndex = (index) => {
        if (index === 0) {
            setPage("Company Info");
            setIsEdit(false);
            setShowTabs(true);
        }
    };


    const handleSavecustomer = () => {
        // Handle save logic here
        setIsEdit(false);
    };

    const handleCancel = () => {
        setIsEdit(false);
        setPage("Company Info");

    };

    const handleEditfunction = () => {
        setIsEdit(true);
        setPage("from")
        setbreadcrumpName("Edit Info")
       // setShowTabs(false);
       // EntityRef.current.handleEntityDialog()
    };

    return (
        <React.Fragment>
            {companyLoading && <LoadingScreen />}

            {/* Header Section */}
            {/* {page !== "Company Info" && ( */}
            {/* { isEdit === true && (
                <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                    <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
                    <div className="flex gap-2">
                        <Button type="secondary" value="Cancel" onClick={handleCancel} />
                        <Button type="primary" value={isEdit ? "Update" : "Save"} onClick={handleSavecustomer} />
                    </div>
                </div>
            )} */}

            {/* Conditional Rendering */}
            {isEdit ? (
                <EditCompanyForm onCancel={handleCancel} isEdit={isEdit} isEditChange={() => {setIsEdit(false)}} company={company} />
            ) : (

                <React.Fragment>
                    <CompanyHeader onhandleEdit={() => handleEditfunction()} />
                    <div style={{ height: "calc(100vh - 48px)", overflow: 'auto' }} className="p-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
                        <Grid container>
                            <Grid item xs={3} />
                            <Grid item xs={8}>
                                <Typography value={"Basic Info"} variant="heading-02-xs" color="primary" />
                                <div className="mt-0.5" />
                                <Typography value={"Capture essential details to identify the company and its legal identity."} variant="paragraph-xs" color="tertiary" />
                                <div className="mt-4" />
                                <Typography value={"Company Name"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.company_name} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"Registration Number"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.reg_no} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Company Type"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.company_type_desc} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Company Category"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.company_cate_desc} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Industry Type"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.industry_type_desc} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Company Logo"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                {company?.logofileBase64 ? <img src={`data:image/${company?.logofilepath?.split('.')[1] === 'png' ? 'png' : 'svg+xml'};base64,`+company?.logofileBase64} alt="Company Logo" className="w-20 h-20" /> : <Typography value={"--"} variant="label-01-s" />}
                                <div className="mt-4" />
                                <HorizontalLine variant='divider1' />
                                <div className="mt-4" />


                                <Typography value={"Contact Information"} variant="heading-02-xs" color="primary" />
                                <div className="mt-0.5" />
                                <Typography value={"Contact details for communication and correspondence."} variant="paragraph-xs" color="tertiary" />
                                <div className="mt-4" />
                                <Typography value={"Primary Contact Person"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.primary_cont_person} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"Designation"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.designation} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Email"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.email} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Contact Number"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.contact_num} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Alternative Contact Person"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.alter_cont_person} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Alternative Contact Number"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.alter_cont_num} variant="label-01-s" />


                                <div className="mt-4" />
                                <HorizontalLine variant='divider1' />
                                <div className="mt-4" /><Typography value={"Address Details"} variant="heading-02-xs" color="primary" />
                                <div className="mt-0.5" />
                                <Typography value={"Official addresses for invoicing and correspondence."} variant="paragraph-xs" color="tertiary" />
                                <div className="mt-4" />
                                <Typography value={"Head Office Address"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={`${company?.company_address_1}, ${company?.company_address_2}`} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"City"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.city} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"ZIP/Postal Code"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.zip_code} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"State"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.billing_state_name} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Country"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.billing_country_name} variant="label-01-s" />

                                <div className="mt-4" />
                                {
                                    company?.ship?.map((zz, index) => {
                                        return (
                                            <>
                                            <div className="mt-0.5" />
                                            <Typography value={`Shipping Address ${index + 1}`} variant="paragraph-xs" color="secondary" />
                                            <div className="mt-0.5" />
                                            <Typography value={`${zz?.shipping_add1}, ${zz?.shipping_add2}`} variant="label-01-s" color="primary" />

                                            <div className="mt-4" />
                                            <Typography value={"City"} variant="paragraph-xs" color="secondary" />
                                            <div className="mt-0.5" />
                                            <Typography value={zz?.shipping_city} variant="label-01-s" />
                                            <div className="mt-4" />
                                            <Typography value={"ZIP/Postal Code"} variant="paragraph-xs" color="secondary" />
                                            <div className="mt-0.5" />
                                            <Typography value={zz?.shipping_zip_code} variant="label-01-s" />
                                            <div className="mt-4" />
                                            <Typography value={"State"} variant="paragraph-xs" color="secondary" />
                                            <div className="mt-0.5" />
                                            <Typography value={zz?.shipping_state_name} variant="label-01-s" />
                                            <div className="mt-4" />
                                            <Typography value={"Country"} variant="paragraph-xs" color="secondary" />
                                            <div className="mt-0.5" />
                                            <Typography value={zz?.shipping_country_name} variant="label-01-s" />
                                            </>
                                        )
                                    })
                                }
                                

                                <div className="mt-4" />
                                <HorizontalLine variant='divider1' />
                                <div className="mt-4" />
                                <Typography value={"Financial Details"} variant="heading-02-xs" color="primary" />
                                <div className="mt-0.5" />
                                <Typography value={"Financial and tax information for compliance and transactions."} variant="paragraph-xs" color="tertiary" />
                                <div className="mt-4" />
                                <Typography value={"GST Number    "} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.gsT_num} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"GST Document"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.gstfilepath || '--'} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"Tax Identification Number (TIN)"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.tiN_num} variant="label-01-s" />

                                <div className="mt-4" />
                                <Typography value={"TIN Document"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.tinfilepath || '--'} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"Company PAN"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.paN_num} variant="label-01-s" />

                                <div className="mt-4" />
                                <Typography value={"PAN Document"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.panfilepath || '--'} variant="label-01-s" color="primary" />


                                <div className="mt-4" />
                                <Typography value={"Bank Account Number"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.bnk_acc_no} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"IFSC Code"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.ifsC_code} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Preffered Currency"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.pre_currency} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Authorized Signatory"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={company?.auth_sign} variant="label-01-s" />

                                <div className="mt-4" />
                                {/* <HorizontalLine variant='divider1' />
                                <div className="mt-4" />
                                <Typography value={"Document Details"} variant="heading-02-xs" color="primary" />
                                <div className="mt-0.5" />
                                <Typography value={"Necessary identification and business documents."} variant="paragraph-xs" color="tertiary" />
                                <div className="mt-4" />
                                <Typography value={"Certificate of Incorporation "} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={"--"} variant="label-01-s" color="primary" />

                                <div className="mt-4" />
                                <Typography value={"Tax Registration Certificate"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={"--"} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"company PAN Card"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={"--"} variant="label-01-s" />
                                <div className="mt-4" />
                                <Typography value={"Bank Account Proof"} variant="paragraph-xs" color="secondary" />
                                <div className="mt-0.5" />
                                <Typography value={"--"} variant="label-01-s" /> */}
                            </Grid>
                            <Grid item xs={3} />
                        </Grid>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
