import React, { useState, useEffect } from 'react';
import EnhancedTable from "components/Table/Table";
import moment from 'moment';
import useReasons from "../hooks/useReasons";
import Typography from 'components/Core/Typography/TypographyNDL';
import { useAuth } from "components/Context";
import { useRecoilState } from "recoil";
import { Reasontags } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import TagNDL from "components/Core/Tags/TagNDL";
import Button from "components/Core/ButtonNDL"
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; // Importing XLSX for Excel download functionality
const OtherReasonTable = (props) => {
    const { t } = useTranslation();
    const { HF } = useAuth();
    const [otherdata, setOtherdata] = useState([])
    const [otherRawdata, setOtherRawdata] = useState([])
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const [ReasonTagsListData] = useRecoilState(Reasontags);
    
    const headCells = [
        {
            id: 'reason',
            numeric: false,
            disablePadding: true,
            label: t('Reason'),
            // width:120
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: t('Type'),
            // width:120
        },
        {
            id: 'tag',
            numeric: false,
            disablePadding: false,
            label: t('Tag'),
            width:100
        },
        {
            id: 'Added by',
            numeric: false,
            disablePadding: false,
            label: t('Added by'),
            // width:120
        },
        {
            id: 'updated_at',
            numeric: false,
            disablePadding: false,
            label: t('Updated At'),
            // width:120
        }
    ];
    useEffect(() => {
        processedrows()
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGRData, ReasonTagsListData])
    useEffect(() => {
        getReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant])
    const processedrows = () => {
       
        var OtherData = []
        var OtherRawdata = []
        if (!outGRLoading && outGRData && !outGRError) {
            // eslint-disable-next-line array-callback-return
            outGRData.map((val, index) => {
                if (val.prod_reason_type.id === 10) {
                    OtherRawdata.push(val)
                    OtherData.push([val.reason, val.prod_reason_type ? "Setup Time" : "",
                    val.reason_tag &&
                        (val.reason_tag.length > 5 ?
                            <div key={index} style={{ display: 'inline-flex' }}>
                                {val.reason_tag.slice(0, 5).map((value,idx) => {
                                    let filteredReasonTags = ReasonTagsListData.filter(x => x.id === value);
                                    let tagname = '';
                                    
                                    if (filteredReasonTags.length > 0) {
                                      tagname = filteredReasonTags[0].reason_tag;
                                    }
                                    
                                    return (<React.Fragment key={idx}>
                                        <TagNDL

                                        lessHeight name={
                                            tagname

                                        } 
                       colorbg="neutral"
                                        
                                        />
                                    </React.Fragment>)
                                })}
                                <React.Fragment>
                                    <TagNDL lessHeight name={
                                        "+5 more"

                                    } 
                       colorbg="neutral"
                                    
                                    />
                                </React.Fragment>
                            </div>
                            :
                            <div key={index} style={{ display: 'inline-flex' }}>
                                {val.reason_tag.map((value,idx) => {
                                   let filteredReasonTags = ReasonTagsListData.filter(x => x.id === value);
                                   let tagname = '';
                                   
                                   if (filteredReasonTags.length > 0) {
                                     tagname = filteredReasonTags[0].reason_tag;
                                   }
                                   
                                    return (<React.Fragment key={idx}>
                                    <TagNDL lessHeight name={
                                        tagname

                                    } 
                       colorbg="neutral"
                                    
                                    />
                                </React.Fragment>)
                                })}
                            </div>)
                        ,
                    val.userByUpdatedBy.name, moment(val.updated_ts).format("DD/MM/YYYY " + HF.HM)])
                }

            })
        }
        setOtherdata(OtherData)
        setOtherRawdata(OtherRawdata)

    }
    useEffect(() => {
        getReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isRerender])
    const handleDownload = () => {
        // Convert nested objects to flattened structure for better readability in Excel
        const flattenedData = otherRawdata.map((item,i) => {
            let filteredReasonTags = ReasonTagsListData.filter(x =>item.reason_tag.includes(x.id));
            let tagname = [];
    
            if (filteredReasonTags.length > 0) {
                filteredReasonTags.forEach(element => {
                    tagname.push(element.reason_tag);
                });
               
            }
    
        return {
         'S.NO': i+1,
        //   'HMI ID': item.hmi ? item.hmi : "NA",
          'REASON': item.reason,
          'TAG': tagname.length > 0 ? tagname.join(',') : "NA",
          "TYPE": item.prod_reason_type.reason_type,
          "ADDED BY":item.userByUpdatedBy.name,
          'UPDATED AT': moment(item.updated_ts).format("DD/MM/YYYY " + HF.HM),
        }});
    
        // Create a worksheet from the JSON array
        const ws = XLSX.utils.json_to_sheet(flattenedData);
    
        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
        // Write the workbook and generate a Blob for download
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
    
        // Use FileSaver to save the blob as an Excel file
        saveAs(blob, 'Others_Reason.xlsx');
      };
    return (
        <React.Fragment>
        <div className='flex items-center float-right'>
 <Button type="ghost" style={{marginTop:"9px",marginRight:"8px"}} icon={Download} onClick={handleDownload}></Button>
    {/* <Download stroke='#0F6FFF' onClick={handleDownload}   /> */}
</div>
        <EnhancedTable
            headCells={headCells}
            data={otherdata}
            actionenabled={true}
            rawdata={otherRawdata}
            handleEdit={(id, value) => props.handleDialogEdit(value)}
            handleDelete={(id, value) => props.deleteTaskfn(id, value)}
            enableDelete={true}
            enableEdit={true}
            search
            tragable={true}
            FilterCol
            verticalMenu={true}
            groupBy={'other_reason'}
            // download
        />
        </React.Fragment>
    );
}

export default OtherReasonTable;
