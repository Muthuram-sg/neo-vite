"use client";

import React, { useEffect,useState, useImperativeHandle,forwardRef, useRef } from "react";
import html2pdf from "html2pdf.js";
import useGetCustomerByID from '../hooks/useGetCustomerByID';
import useGetCompanyMaster from "components/layouts/NeoNix/hooks/useGetCompanyMaster.jsx";
import Image from "components/Core/Image/ImageNDL";
import { userData } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { PDFDocument } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.jsx/${pdfjsLib.version}/pdf.worker.min.jsx`;

const Quotation = ({ data, customerData, logoBase64, companyData, currentUser, matchedPolicyFiles }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
    const numberToWords = (num) => {
        if (isNaN(num)) return '';
        if (num === 0) return 'Zero Rupees';

        const a = [
            '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
        ];
        const b = [
            '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
        ];

        const numberToWordsHelper = (n) => {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
            if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numberToWordsHelper(n % 100) : '');
            if (n < 100000) return numberToWordsHelper(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numberToWordsHelper(n % 1000) : '');
            if (n < 10000000) return numberToWordsHelper(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numberToWordsHelper(n % 100000) : '');
            return numberToWordsHelper(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numberToWordsHelper(n % 10000000) : '');
        };

        let rupees = Math.floor(num);
        let paise = Math.round((num - rupees) * 100);

        let str = '';
        if (rupees > 0) str += numberToWordsHelper(rupees) + ' Rupees';
        if (paise > 0) str += (str ? ' and ' : '') + numberToWordsHelper(paise) + ' Paise';
        return str;
    };

  return (
    <div>
    <div
      style={{
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        color: "#111",
        padding: 24,
        paddingTop: 10,
        fontSize: 9,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {logoBase64 && (
            <Image
                style={{ verticalAlign: "middle", maxWidth: "120px", maxHeight: "80px",paddingBottom: "5px"  }}
                src={`data:image/png;base64,${logoBase64}`}
                alt="Company Logo"
            />
        )}
        <div className='mb-1' style={{ textAlign: "left" }}>
            <div style={{ fontWeight: "bold", fontSize: 14 }}>
                {companyData?.company_name}
            </div>
            <div style={{ fontSize: 9 }}>
                {(companyData?.company_address_1 || "")}
                {companyData?.company_address_2 ? ", " + companyData.company_address_2 : ""}
                {companyData?.city ? ", " + companyData.city : ""}
                {companyData?.zip_code ? " - " + companyData.zip_code : ""}
                {companyData?.billing_state_name ? ", " + companyData.billing_state_name : ""}
                {companyData?.billing_country_name ? ", " + companyData.billing_country_name : ""}
            </div>
            <div style={{ fontSize: 9 }}>
                T{companyData?.contact_num ? "(" + companyData.contact_num + ")" : "-"}
                {companyData?.alt_contact_num ? " / " + companyData.alt_contact_num : ""}
            </div>
            <div style={{ fontSize: 9, fontWeight: "bold" }}>
                GST No: {companyData?.gsT_num || "-"}
            </div>
        </div>
      </div>

      <div
        style={{
          fontWeight: "bold",
          fontSize: 12,
          textAlign: "center",
          border: "2px solid #C7311A",
        }}
      >
        <div className="flex items-center">
          <b className="text-[#C7361F] mx-auto">Quotation</b>
        </div>
        <hr style={{ border: "1px solid #C7311A", margin: "6px 0 0 0 " }} />
      
      <table
        style={{
          width: "100%",
          fontSize: 9,
        }}
      >
          
        <div className="w-full flex justify-between">
          <div className="w-[40%] border-r-2 border-[#C7311A]">
              <div className="flex w-full items-center justify-center">
              <b>Customer Details</b>
              </div>
        <hr style={{ border: "1px solid #C7311A", margin: "3px 0 0 0 " }} />

              <div className="pl-2 flex flex-col items-start gap-1">
              <p>
              <b>Customer Name</b>: {data?.customer?.cust_name || customerData[0]?.cust_name}
            </p>
            <p>
              <b>Contact Person Name</b>: {data?.customer?.acc_represent || customerData[0]?.acc_represent}
            </p>
            <p>
              <b>Designation</b>: {data?.customer?.designation || customerData[0]?.designation}
            </p>
            <p>
              <b>Email</b>: {customerData[0]?.email_id || customerData[0]?.email_id}
            </p>
             <p>
              <b>Phone Number</b>: {data?.customer?.mobile_no || customerData[0]?.mobile_no}
            </p>
           <p>
            <b>Billing Address</b>:
            {customerData[0]
                ? [
                    customerData[0].adrs1,
                    customerData[0].adrs2
                ].filter(Boolean).join(", ") || "-"
                : "-"}
            <br />
            {customerData[0] &&
                ([
                customerData[0].city,
                customerData[0].state,
                customerData[0].zip_code,
                customerData[0].country
                ].filter(Boolean).join(", ") || "")}
            </p>
            <p>
              <b>GSTIN / Tax ID</b>: {data?.customer?.gst_no || '-'}
            </p>
            <p>
            <b>Place of Supply</b>:
            {customerData[0]?.ship && customerData[0].ship[0]
                ? [
                    customerData[0].ship[0].address
                ].filter(Boolean).join(", ") || "-"
                : "-"}
            <br />
            {customerData[0]?.ship && customerData[0].ship[0] &&
                ([
                customerData[0].ship[0].citycode,
                customerData[0].ship[0].state,
                customerData[0].ship[0].postcode,
                customerData[0].ship[0].country
                ].filter(Boolean).join(", ") || "")}
            </p>
              </div>
          </div>
          <div className="w-[60%]">
          <div className="p-2 flex flex-col items-start gap-1">
              <p>
              <b>Quotation No</b>: {data?.header?.quo_id}
            </p>
            <p>
              <b>Quotation Date</b>: {formatDate(data?.header?.quo_date)}
            </p>
              <p>
              <b>Expiry Date</b>: {formatDate(data?.header?.exp_date)}
            </p>
             <p>
              <b>Prepared By</b>: {currentUser || '-'}
            </p>    
              </div>
          </div>
        </div>
      </table>

        <table
        style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 9,
            pageBreakInside: "auto"
        }}
        >
        <thead style={{ display: "table-header-group" }}>
            <tr style={{ background: "#fff0f0" }}>
            <th style={{ border: "1px solid #C7311A", borderLeft: "0px", padding: "4px" }}>S. No.</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Name of Product / Services</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>HSN Code</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Description</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Quantity</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Price</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Discount (%)</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Tax (%)</th>
            <th style={{ border: "1px solid #C7311A", padding: "4px" }}>Line Total</th>
            </tr>
        </thead>
        <tbody>
            {data.items.map((item, idx, arr) => {
            const qty = Math.max(0, parseInt(item.quantity, 10) || 0);
            const price = parseFloat(item.price) || 0;
            const discount = parseFloat(item.discount) || 0;
            const tax = parseFloat(item.tax) || 0;
            const lineTotal = ((qty * price) * (1 - discount / 100) * (1 + tax / 100));

            const priceStr = price.toFixed(3).replace(/\.?0+$/, "");
            const lineTotalStr = lineTotal.toFixed(2);

            return (
                <tr key={idx} style={{ pageBreakInside: "avoid" }}>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "center", padding: "4px" }}>{idx + 1}</td>
                <td style={{ borderRight: "1px solid #C7311A", padding: "4px", textAlign: "left" }}>{item?.prod_code}</td>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "center", padding: "4px" }}>{item.hsn_code}</td>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "left", padding: "4px" }}>{item.description}</td>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "right", padding: "4px" }}>{qty}</td>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "right", padding: "4px" }}>{priceStr}</td>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "right", padding: "4px" }}>{discount}</td>
                <td style={{ borderRight: "1px solid #C7311A", textAlign: "right", padding: "4px" }}>{tax}</td>
                <td style={{ textAlign: "right", padding: "4px" }}>{lineTotalStr}</td>
                </tr>
            );
            })}
            <tr
            style={{
                background: "#fff0f0"
            }}
            >
            <td
                colSpan={4}
                style={{
                textAlign: "right",
                padding: "4px",
                fontWeight: "bold",
                border: "1px solid #C7311A"
                }}
            >
                Total
            </td>
            <td
                style={{
                textAlign: "right",
                padding: "4px",
                fontWeight: "bold",
                background: "#fff0f0",
                border: "1px solid #C7311A"
                }}
            >
                {data.items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0).toFixed(2)}
            </td>
            <td style={{ background: "#fff0f0", border: "1px solid #C7311A" }} />
            <td style={{ background: "#fff0f0", border: "1px solid #C7311A" }} />
            <td style={{ background: "#fff0f0", border: "1px solid #C7311A" }} />
            <td
                style={{
                textAlign: "right",
                padding: "4px",
                fontWeight: "bold",
                background: "#fff0f0",
                border: "1px solid #C7311A"
                }}
            >
                ₹ {Number(data.header.grand_total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
            </tr>
        </tbody>
        </table>
    <div style={{
        maxWidth: 350,
        marginLeft: "auto",
        marginTop: 16,
        background: "#fff",
        padding: 12,
        fontWeight: "normal",
        fontSize: 8,
        color: "#111"
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4,  fontSize: 9, fontWeight: "bold" }}>
            <span>Subtotal</span>
            <span>
            ₹ {Number(data.header.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4,  fontSize: 9, fontWeight: "bold" }}>
            <span>Total Discount</span>
            <span>
            ₹ {Number(data.header.tot_disc || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4,  fontSize: 9, fontWeight: "bold" }}>
            <span>Total Tax</span>
            <span>
            ₹ {Number(data.header.tot_tax || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4,  fontSize: 9, fontWeight: "bold" }}>
            <span>Shipping Charges</span>
            <span>
            ₹ {Number(data.header.ship_charge || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
        </div>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            fontSize: 9,
            fontWeight: "bold"
        }}>
            <span>Grand Total</span>
            <span>
            ₹ {Number(data.header.grand_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
        </div>
        <div style={{
            marginTop: 8,
            fontWeight: "normal",
            fontSize: 9,
            color: "#222",
            padding: "6px 8px"
        }}>
            <div style={{ fontSize: 9, fontWeight: "normal" }}>Grand Total in Words:</div>
            <div style={{ fontWeight: "bold", fontSize: 11, marginTop: 2, textTransform: "uppercase" }}>
                {numberToWords(data.header.grand_total)} ONLY
            </div>
        </div>
        </div>
    <div
        style={{
            width: "100%",
            marginTop: 8,
            background: "#fff",
            padding: 0,
            fontWeight: "normal",
            fontSize: 8,
            color: "#111",
            borderTop: "2px solid #C7311A",   
            borderBottom: "2px solid #C7311A",
            marginBottom: 0
        }}
    >
        <div
            style={{
                fontWeight: "bold",
                padding: "8px 0 4px 0",
                textAlign: "center",
                fontSize: 10,
                 borderBottom: "2px solid #C7311A",
            }}
        >
            Company Bank Details (For payment reference)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <tbody>
                <tr>
                    <td style={{
                        fontWeight: "bold",
                        padding: "2px 2px",
                        width: "30%",
                        borderRight: "1px solid #C7311A",
                        borderBottom: "1px solid #C7311A",
                        verticalAlign: "top"
                    }}>Bank Name</td>
                    <td style={{
                        padding: "2px 2px",
                        borderBottom: "1px solid #C7311A"
                    }}>{companyData?.ifsC_code && /^[A-Za-z]+/.test(companyData.ifsC_code)
                        ? companyData.ifsC_code.match(/^[A-Za-z]+/)[0]
                        : '-'}</td>
                </tr>
                <tr>
                    <td style={{
                        fontWeight: "bold",
                        padding: "2px 2px",
                        width: "30%",
                        borderRight: "1px solid #C7311A",
                        borderBottom: "1px solid #C7311A",
                        verticalAlign: "top"
                    }}>Account Number</td>
                    <td style={{
                        padding: "2px 2px",
                        borderBottom: "1px solid #C7311A"
                    }}>{companyData?.bnk_acc_no || '-'}</td>
                </tr>
                <tr>
                    <td style={{
                        fontWeight: "bold",
                        padding: "2px 2px",
                        width: "30%",
                        borderRight: "1px solid #C7311A",
                        borderBottom: "1px solid #C7311A",
                        verticalAlign: "top"
                    }}>IFSC Code</td>
                    <td style={{
                        padding: "2px 2px",
                        borderBottom: "1px solid #C7311A"
                    }}>{companyData?.ifsC_code || '-'}</td>
                </tr>
                <tr>
                    <td style={{
                        fontWeight: "bold",
                        padding: "2px 2px",
                        width: "30%",
                        borderRight: "1px solid #C7311A",
                        borderBottom: "none",
                        verticalAlign: "top"
                    }}>GSTIN (Company)</td>
                    <td style={{
                        padding: "2px 2px",
                        borderBottom: "none"
                    }}>{companyData?.gsT_num || '-'}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div
        style={{
            width: "100%",
            marginTop: 8,
            display: "flex",
            justifyContent: "flex-end"
        }}
    >
    <div
        style={{
            width: "100%",
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}
    >
        <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{
                fontWeight: "bold",
                marginBottom: 10,
                padding: "8px 0",
                textAlign: "center",
                fontSize: 10,
            }}>
                Declaration
            </div>
            <div style={{ fontSize: 8, marginBottom: 12 }}>
                Certified that the particulars given above are true and correct by <span style={{ fontWeight: "bold" }}>{companyData?.company_name || ''}</span>.
            </div>
        </div>
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginTop: 8
        }}>
            <div>
                {companyData?.auth_sign }
            </div>
            <div style={{ fontSize: 8 }}>
                {'Authorized Signatory'}
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

const QuotationPage = forwardRef(({ viewdata, policyData }, ref) => {
    const [customersData, setcustomersData] = useState([]);
    const [logoBase64, setLogoBase64] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [matchedPolicyFiles, setmatchedPolicyFiles]= useState([]);
    const [currUser] = useRecoilState(userData);
    const {customerLoading, customerData, customerError, getcustomer} = useGetCustomerByID();
    const { companyData, companyLoading, companyError, getAllCompany } = useGetCompanyMaster();
    const [allPages, setAllPages] = useState([]); 
    const [currentPage, setCurrentPage] = useState(0);

    const handlePrev = () => setCurrentPage((idx) => Math.max(0, idx - 1));
    const handleNext = () => setCurrentPage((idx) => Math.min(allPages.length - 1, idx + 1));

    useImperativeHandle(ref, () => ({
        downloadPDF: handleDownloadPDF
    }));

    useEffect(() => {
        async function preparePages() {
            const billPage = { type: "bill", content: { viewdata, customersData, logoBase64, companyData, currUser } };

            let policyPages = [];
            if (matchedPolicyFiles && matchedPolicyFiles.length > 0) {
                policyPages = await Promise.all(
                    matchedPolicyFiles.map(async (policy) => {
                        const pdfData = atob(policy.fileBase64);
                        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
                        const pdf = await loadingTask.promise;
                        const page = await pdf.getPage(1);
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        await page.render({ canvasContext: context, viewport }).promise;
                        const imageBase64 = canvas.toDataURL("image/png").split(",")[1];
                        return { type: "policy", content: { ...policy, imageBase64 } };
                    })
                );
            }
            setAllPages([billPage, ...policyPages]);
            setCurrentPage(0);
        }
        preparePages();
    }, [viewdata, customersData, logoBase64, companyData, currUser, matchedPolicyFiles]);

    function getMatchedPolicyFiles(assignments, allPolicyData) {
        if (!Array.isArray(assignments) || !Array.isArray(allPolicyData)) return [];
        return assignments.map(assign => {
            const match = allPolicyData.find(
                policy =>
                    String(policy.policy_id) === String(assign.policy_code) &&
                    policy.ap_code === assign.ap_code
            );
            return match && match.fileBase64 ? { ...match, policy_type: assign.policy_type } : null;
        }).filter(Boolean);
    }

    useEffect(()=>{
        getcustomer(viewdata?.customer?.cust_code || '');
          getAllCompany()
    },[])

    useEffect(()=>{
        setmatchedPolicyFiles(getMatchedPolicyFiles(viewdata?.policy, policyData))
    },[policyData, viewdata])

    useEffect(() => {
        if (companyData && !companyLoading && !companyError) {
            setLogoBase64(companyData[0]?.logofileBase64 || "");
        }
    }, [companyData, companyLoading, companyError]);

    useEffect(()=>{
        if(!customerLoading && customerData && !customerError){
            setcustomersData(customerData)
        }
    },[customerLoading, customerData, customerError])

const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 100)); 
    const element = document.getElementById("quotation-content");
    if (!element) return;

    const opt = {
        margin: 0,
        filename: `quotation_${viewdata.header.quo_id}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 4,
            useCORS: true,
            logging: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        },
    };

    const billBlob = await html2pdf().set(opt).from(element).outputPdf('blob');

    const mergedPdf = await PDFDocument.load(await billBlob.arrayBuffer());

    for (const policy of matchedPolicyFiles) {
        if (!policy.fileBase64) continue;
        const policyPdfBytes = Uint8Array.from(atob(policy.fileBase64), c => c.charCodeAt(0));
        const policyPdf = await PDFDocument.load(policyPdfBytes.buffer);
        const copiedPages = await mergedPdf.copyPages(policyPdf, policyPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = opt.filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    setIsDownloading(false);
};

    return (
    <div style={{ padding: 32 }}>
    <div id="quotation-content">
    {allPages.length > 0 && allPages.map((page, idx) => (
        <div
        key={idx}
        style={{
            display: idx === currentPage ? "block" : "none",
            width: "100%",
            pageBreakBefore: idx !== 0 ? "always" : "auto",
        }}
        >
        {page.type === "bill" ? (
            <Quotation
            data={viewdata}
            customerData={customersData}
            logoBase64={logoBase64}
            matchedPolicyFiles={matchedPolicyFiles}
            companyData={companyData[0]}
            currentUser={currUser.name}
            />
        ) : (
            <div style={{
            marginTop: 32,
            fontWeight: "bold",
            fontSize: 12,
            textAlign: "center"
            }}>
            Policy Attachments
            <div style={{
                margin: 0,
                padding: 0,
                background: "none",
                width: "100%",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                {page.content.policy_type} - {page.content.policy_name}
                </div>
                <img
                style={{
                    verticalAlign: "middle",
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "80vh",
                    paddingBottom: "5px",
                    objectFit: "contain",
                }}
                src={`data:image/png;base64,${page.content.imageBase64}`}
                alt="Policy Preview"
                />
            </div>
            </div>
        )}
        </div>
    ))}
    </div>
        {allPages.length > 1 && (
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 16 }}>
            <button onClick={handlePrev} disabled={currentPage === 0}>Previous</button>
            <span>Page {currentPage + 1} of {allPages.length}</span>
            <button onClick={handleNext} disabled={currentPage === allPages.length - 1}>Next</button>
        </div>
        )}
    </div>
    );
    })

export default QuotationPage;