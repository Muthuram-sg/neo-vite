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
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import Button from "components/Core/ButtonNDL"
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; // Importing XLSX for Excel download functionality
const DowntimeTable = (props) => {
    const { t } = useTranslation();
    const { HF } = useAuth();
    const [downTimeDate, setDownTimeDate] = useState([])
    const [downTimeRawdata, setDownTimeRawdata] = useState([]);
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const [downloadabledata, setdownloadabledata] = useState([]);
    const [tag,setTag]=useState([])
    const [ReasonTagsListData] = useRecoilState(Reasontags);

    useEffect(() => {
        processedrows()
        console.log(ReasonTagsListData,"ReasonTagsListDatauseeff")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGRData, ReasonTagsListData])

    useEffect(() => {
        getReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant])

    const renderTags = (tags, showMore) => {
        const renderedTags = tags.slice(0, showMore ? 1 : tags.length).map(value => {
            let filteredReasonTags = ReasonTagsListData.filter(x => x.id === value);
            console.log(ReasonTagsListData,"ReasonTagsListData",value)
            let tagname = '';

            if (filteredReasonTags.length > 0) {
                tagname = filteredReasonTags[0].reason_tag;
                // setTag(tagname)

            }

            return (
                
                <React.Fragment key={value}>
                {
                tagname &&
                    <TagNDL
                        name={tagname}
                        noHeight
                       colorbg="neutral"
                       lessHeight
                    />
                    }
                </React.Fragment>
            );

            
        });

        if (showMore) {
            renderedTags.push(
                <Typography
                    key="+5more"
                    variant={"Body2Reg"}
                    value={"+" + (tags.length -1) + " more"}
                />
            );
        }

        return (
            <div className='flex items-center gap-2'>
                {renderedTags}
            </div>
        );
    };

    const processedrows = () => {
        var DownTimeData = []
        var DownTimeRawdata = []
        let tempdownloadtabledata = [];
        if (!outGRLoading && outGRData && !outGRError) {

            // eslint-disable-next-line array-callback-return
            outGRData.sort((a, b) => {
                if (a.hmi === null && b.hmi !== null) return 1;
                if (a.hmi !== null && b.hmi === null) return -1;
                if (a.hmi === null && b.hmi === null) return 0;
                return a.hmi - b.hmi;
            }).map((val, index) => {
                // DownTimeData.push([index+1])
                if (val.prod_reason_type.id === 3) {
                    DownTimeRawdata.push(val)
                    DownTimeData.push([val.hmi ? val.hmi : 'NA', val.reason, val.prod_reason_type ? "Planned" : "",
                    val.reason_tag ?

                        renderTags(val.reason_tag, val.reason_tag.length > 1, )

                        :
                        "NA"


                        , val.userByUpdatedBy.name, moment(val.updated_ts).format("DD/MM/YYYY " + HF.HM)])
                } else if (val.prod_reason_type.id === 17) {
                    DownTimeRawdata.push(val)
                    DownTimeData.push([val.hmi ? val.hmi : 'NA', val.reason, val.prod_reason_type ? "Unplanned" : "",
                    val.reason_tag ?
                        renderTags(val.reason_tag, val.reason_tag.length > 1)
                        :
                        "NA"
                        ,
                    val.userByUpdatedBy.name, moment(val.updated_ts).format("DD/MM/YYYY " + HF.HM)])
                }

            })

            tempdownloadtabledata = DownTimeRawdata.map((item, i) => {
                let filteredReasonTags = item.reason_tag 
                    ?  ReasonTagsListData.filter(x => item.reason_tag.includes(x.id))
                    : [];
                let tagname = filteredReasonTags.map(element => element.reason_tag || "NA");
                return [
                    i + 1,
                    item.hmi || "NA",
                    item.reason,
                    tagname.length > 0 ? tagname.join(', ') : "NA",
                    item.prod_reason_type?.reason_type || "NA",
                    item.userByUpdatedBy?.name || "NA",
                    moment(item.updated_ts).format("DD/MM/YYYY " + HF.HM),
                ];
            });

           
        }
        DownTimeData = DownTimeData.map((item, index) => [index + 1, ...item]);
        setdownloadabledata(tempdownloadtabledata)
        setDownTimeDate(DownTimeData)
        setDownTimeRawdata(DownTimeRawdata)

    }
    useEffect(() => {

        getReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isRerender])
    const headCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
        },
        {
            id: 'HMI ID',
            numeric: false,
            disablePadding: true,
            label: t('HMI ID'),
            // width:120
        },
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

    const handleDownload = () => {
        // Convert nested objects to flattened structure for better readability in Excel
        const flattenedData = downTimeRawdata.map((item, i) => {
            let filteredReasonTags = ReasonTagsListData.filter(x => item.reason_tag.includes(x.id));
            let tagname = [];

            if (filteredReasonTags.length > 0) {
                filteredReasonTags.forEach(element => {
                    tagname.push(element.reason_tag);
                });

            }

            return {
                'S.NO': i + 1,
                'HMI ID': item.hmi ? item.hmi : "NA",
                'REASON': item.reason,
                'TAG': tagname.length > 0 ? tagname.join(',') : "NA",
                "TYPE": item.prod_reason_type.reason_type,
                "ADDED BY": item.userByUpdatedBy.name,
                'UPDATED AT': moment(item.updated_ts).format("DD/MM/YYYY " + HF.HM),
            }
        });

        // Create a worksheet from the JSON array
        const ws = XLSX.utils.json_to_sheet(flattenedData);

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Write the workbook and generate a Blob for download
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        // Use FileSaver to save the blob as an Excel file
        saveAs(blob, 'Downtime_Reason.xlsx');
    };

    return (
        <React.Fragment>
            <div className='flex items-center float-right'>
                <Button type="ghost" style={{ marginTop: "9px", marginRight: "8px" }} icon={Download} onClick={handleDownload}></Button>
               
            </div>
            <EnhancedTable
                headCells={headCells}
                downloadHeadCells={headCells}
                data={downTimeDate}
                actionenabled={true}
                // download={true}
                rawdata={downTimeRawdata}
                handleEdit={(id, value) => {
                    props.handleDialogEdit(value)
                }}
                handleDelete={(id, value) => props.deleteTaskfn(id, value)}
                enableDelete={true}
                search
                // download
                enableEdit={true}
                // rowSelect={true}
                // checkBoxId={"S.No"}
                downloadabledata={downloadabledata}
                FilterCol
                    verticalMenu={true}
                    groupBy={'downtime_reason'}
            />
        </React.Fragment>

    );
}

export default DowntimeTable;