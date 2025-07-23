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
import { saveAs } from 'file-saver';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import * as XLSX from 'xlsx'; // Importing XLSX for Excel download functionality
const QualityTable = (props) => {
    const { t } = useTranslation();
    const { HF } = useAuth();
    const [qualityData, setQualityData] = useState([])
    const [qualityRawdata, setQualityRawdata] = useState([])
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const [ReasonTagsListData]=useRecoilState(Reasontags);
    

    const headCells = [
        // {
        //     id: 'HMI ID',
        //     numeric: false,
        //     disablePadding: true,
        //     label: t('HMI ID'),
        // },
        {
            id: 'reason',
            numeric: false,
            disablePadding: true,
            label: t('Reason'),
            // width:110
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: t('Type'),
            // width:110
        },
        {
            id: 'tag',
            numeric: false,
            disablePadding: false,
            label: t('Tag'),
            // width:110
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

    const renderTags = (tags, isMore) => {
     
        const renderedTags = tags.slice(0, isMore ? 5 : Number(tags.length)).map(value => {
            let filteredReasonTags = ReasonTagsListData.filter(x => x.id === value);
            let tagname = '';
        //    console.log(filteredReasonTags,"filteredReasonTags")
            if (filteredReasonTags.length > 0) {
                tagname = filteredReasonTags[0].reason_tag;
            }
    
            return (
                <React.Fragment key={value}>
                    <TagNDL
                        name={
                           tagname
                        }
                        lessHeight
                          colorbg="neutral"
                    />
                </React.Fragment>
            );
        });
    
        if (isMore) {
            renderedTags.push(
                <React.Fragment key="+5more">
                    <TagNDL
                        name={
                           "+5 more"
                            
                        }
                        lessHeight
                          colorbg="neutral"
                    />
                </React.Fragment>
            );
        }
    
        return (
            <div style={{ display: 'inline-flex' }}>
                {renderedTags}
            </div>
        );
    };
    const processedrows = () => {
       
        var QualityData = []
        var QualityRawdata = []
       
        if (!outGRLoading && outGRData && !outGRError) {
            // eslint-disable-next-line array-callback-return
            outGRData.map((val, index) => {
               if (val.prod_reason_type.id === 2) {
                    QualityRawdata.push(val)
                    QualityData.push([val.reason, val.prod_reason_type ? "Reject" : "",  
                    val.reason_tag ? (val.reason_tag.length > 5 ? renderTags(val.reason_tag, true) : renderTags(val.reason_tag)) : 'NA'
               ,
                    val.userByUpdatedBy.name, moment(val.updated_ts).format("DD/MM/YYYY "+HF.HM)])
                } else if (val.prod_reason_type.id === 18) {
                    QualityRawdata.push(val)
                    QualityData.push([val.reason, val.prod_reason_type ? "Scrap" : "", 
                    val.reason_tag ?  (val.reason_tag.length > 5 ? renderTags(val.reason_tag, true) : renderTags(val.reason_tag)) :"NA"
                ,
                    val.userByUpdatedBy.name, moment(val.updated_ts).format("DD/MM/YYYY "+HF.HM)])
                }  

            })
        }
        setQualityData(QualityData)
        setQualityRawdata(QualityRawdata)

    }
    useEffect(() => {
        getReasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isRerender])
    // console.log(qualityRawdata,"qualityRawdata")
    const handleDownload = () => {
        // Convert nested objects to flattened structure for better readability in Excel
        const flattenedData = qualityRawdata.map((item,i) => {
            let filteredReasonTags = ReasonTagsListData.filter(x =>item.reason_tag && item.reason_tag.length >0 && item.reason_tag.includes(x.id));
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
        saveAs(blob, 'Quality_Reason.xlsx');
      };
  
    return (
        <React.Fragment>
       <div className='flex items-center float-right'>
 <Button type="ghost" style={{marginTop:"9px",marginRight:"8px"}} icon={Download} onClick={handleDownload}></Button>
    {/* <Download stroke='#0F6FFF' onClick={handleDownload}   /> */}
</div>
        <EnhancedTable
        headCells={headCells}
        data={qualityData}
        actionenabled={true}
        rawdata={qualityRawdata}
        handleEdit={(id, value) => props.handleDialogEdit(value)}
        handleDelete={(id, value) => props.deleteTaskfn(id, value)} 
        enableDelete={true}
        enableEdit={true}
        search
        FilterCol
            verticalMenu={true}
            groupBy={'quality_reason'}
        />
        </React.Fragment>
    );
}

export default QualityTable;
