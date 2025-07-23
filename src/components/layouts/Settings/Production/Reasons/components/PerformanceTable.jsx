import React,{useState,useEffect} from 'react';
import EnhancedTable from "components/Table/Table";
import moment from 'moment';
import useReasons from "../hooks/useReasons";
import Typography from 'components/Core/Typography/TypographyNDL';
import { useAuth } from "components/Context";
import { useRecoilState } from "recoil";
import {  Reasontags } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import TagNDL from "components/Core/Tags/TagNDL";
import Button from "components/Core/ButtonNDL"
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; // Importing XLSX for Excel download functionality

const PerformanceTable = (props) => {
    const { t } = useTranslation();
    const { HF } = useAuth();
    const [performancedata, setPerformancedata] = useState([])
    const [performanceRawdata, setPerformanceRawdata] = useState([])
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const [ReasonTagsListData]=useRecoilState(Reasontags);

    const headCells3 = [
        {
            id: 'reason',
            numeric: false,
            disablePadding: true,
            label: t('Reason'),
            // width:120
        },
        {
            id: 'tag',
            numeric: false,
            disablePadding: false,
            label: t('Tag'),
            // width:120
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
    }, [outGRData,ReasonTagsListData])
    useEffect(() => {
        getReasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant])
    const processedrows = () => {
        var PerformanceData = []
        var PerformanceRawdata = []
       
        if (!outGRLoading && outGRData && !outGRError) {
            // eslint-disable-next-line array-callback-return
            outGRData.map((val, index) => {
               
               if (val.prod_reason_type.id === 16) {
                    PerformanceRawdata.push(val)
                    PerformanceData.push([val.reason, 
                        val.reason_tag &&
                        (val.reason_tag.length > 5 ?
                            <div key={index} style={{display: 'inline-flex'}}>
                            {val.reason_tag.slice(0,5).map(value=>{
                               let filteredReasonTags = ReasonTagsListData.filter(x => x.id === value);
                               let tagname = '';
                               
                               if (filteredReasonTags.length > 0) {
                                 tagname = filteredReasonTags[0].reason_tag;
                               }
                               
                                return (<React.Fragment>
                                    <TagNDL name={
                                       tagname
                                    } 
                                    lessHeight
                                      colorbg="neutral"
                                    
                                    />
                                </React.Fragment>)
                            })}
                                    <React.Fragment>
                                        <TagNDL name={
                                        "+5 more"
                                        }
                                        lessHeight
                                          colorbg="neutral"
                                        />
                                    </React.Fragment>
                            </div>
                            :   
                            <div key={index} style={{display: 'inline-flex'}}>
                                {val.reason_tag.map(value=>{
                                   let filteredReasonTags = ReasonTagsListData.filter(x => x.id === value);
                                   let tagname = '';
                                   
                                   if (filteredReasonTags.length > 0) {
                                     tagname = filteredReasonTags[0].reason_tag;
                                   }
                                   
                                    return (<React.Fragment>
                                        <TagNDL name={
                                            tagname
                                        } 
                                        lessHeight
                                          colorbg="neutral"
                                        />
                                    </React.Fragment>)
                                })}
                            </div>)
                    ,
                        val.userByUpdatedBy.name, moment(val.updated_ts).format("DD/MM/YYYY "+HF.HM)])
                } 
            })
        }
        setPerformancedata(PerformanceData)
        setPerformanceRawdata(PerformanceRawdata)

    }
    useEffect(() => {
        getReasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isRerender])

    const handleDownload = () => {
        // Convert nested objects to flattened structure for better readability in Excel
        const flattenedData = performanceRawdata.map((item,i) => {
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
        saveAs(blob, 'Performance_Reason.xlsx');
      };
  

    return (
        <React.Fragment>
        <div className='flex items-center float-right'>
 <Button type="ghost" style={{marginTop:"9px",marginRight:"8px"}} icon={Download} onClick={handleDownload}></Button>
    {/* <Download stroke='#0F6FFF' onClick={handleDownload}   /> */}
</div>
        <EnhancedTable
                            headCells={headCells3}
                            data={performancedata}
                            actionenabled={true}
                            rawdata={performanceRawdata}
                            handleEdit={(id, value) => props.handleDialogEdit(value)}
                            handleDelete={(id, value) => props.deleteTaskfn(id, value)} 
                            enableDelete={true}
                            enableEdit={true}
                            search
                            FilterCol
            verticalMenu={true}
            groupBy={'performance_reason'}
                            // download
                            />
                        </React.Fragment>
    );
}

export default PerformanceTable;
