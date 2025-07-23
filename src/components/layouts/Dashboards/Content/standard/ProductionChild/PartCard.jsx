import React, { useState, useRef, useEffect,useImperativeHandle } from 'react';
import configParam from "config";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL"; 
import { useRecoilState } from "recoil";
import { snackMessage, snackType, snackToggle,prodComments } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import moment from 'moment'; 
import { useMutation } from "@apollo/client";
import PartsList from './PartsListCard'; 
import { AutoSizer,List } from "react-virtualized";
import KpiCards from "components/Core/KPICards/KpiCardsNDL" 
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import PartCommentDialog from './PartCommentDialog';
import PartReject from './OEECardChild/PartRejectDialog';
import SteelModal from './SteelModal';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Button from "components/Core/ButtonNDL/index";
import gqlQueries from "components/layouts/Mutations";

import useAddQualityDefects from './hooks/useAddqualityDefects'
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
 
//Hooks
import useGetLatestSteelData from '../hooks/useGetLatestSteelData';
import * as XLSX from 'xlsx'
function PartCardFunction(props, ref) {
    const AddPartSteelDataRef = useRef(); 
    const { t } = useTranslation(); 
    const [rejectPart, setRejectPart] = useState(""); 
    const [rejectDialog, setRejectDialog] = useState(false);
    const [commentTime, setCommentTime] = useState('');
    const [commentDialog, setCommentDialog] = useState('');
    const [AddDataDialog, setAddDataDialog] = useState(false);
    const [partsReasonList, setPartsReasonList] = useState([]);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [newcommentsdata, setNewCommentsData] = useRecoilState(prodComments);
    const [partFilter, setpartFilter] = useState('showall')
    const [resultArray, setresultArray] = useState([])
    const [partTime, setParttime] = useState({});
    const [isEdit, setEdit] = useState(false); 
    const [BulkParts,setBulkParts] = useState([])
    const [AnchorPos, setAnchorPos] = useState(null);
    const [open, setOpen] = useState(false);
    
    const SteelDataRef = useRef();
    const  { AddQualityDefectsLoading, AddQualityDefectsData, AddQualityDefectsError, getAddQualityDefects } = useAddQualityDefects()

    const [latestData, setLatestData] = useState({});
    const { LatestSteelDataData, getLatestSteelDataForAutoPopulate } = useGetLatestSteelData()
    
    useEffect(()=>{
    
        if(!AddQualityDefectsLoading && AddQualityDefectsData && !AddQualityDefectsError){ 
            if(AddQualityDefectsData.length > 0){
                openNotification(rejectPart ? ('Rejected a part produced at ' + moment(rejectPart.time).format('HH:mm:ss')) : 'Parts Rejected successfully', 'success');
                handleRejectDialogClose()
                props.treiggerOEE()
            } else {
                openNotification('This part already rejected', 'warning');
                handleRejectDialogClose()
            }
        }

    },[AddQualityDefectsLoading, AddQualityDefectsData, AddQualityDefectsError])

    useImperativeHandle(ref, () =>
    (
      {
        handleSteelDataDialog: (data) => {
            setAddDataDialog(true) 
            setTimeout(()=>{
                SteelDataRef.current.handleSteelDataDialog(data)
            },200)
        }
      }
    )
    )
    
    //Get Latest steel data
    useEffect(() => {
        if(props.entity_id){
            getLatestSteelDataForAutoPopulate(props.entity_id)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.entity_id])

    useEffect(() => {
        setTimeout(()=>{
            if(LatestSteelDataData?.length > 0){
                console.log(LatestSteelDataData)
                setLatestData(LatestSteelDataData[0].value)
            }
        },300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LatestSteelDataData])

    const getLatestSteelData = () => {
        getLatestSteelDataForAutoPopulate(props.entity_id)
    }

    useEffect(()=>{
        console.log('AddDataDialog',AddDataDialog)
    },[AddDataDialog])

    useEffect(() => {
        const FilteredData = props.partsData && props.partsData.length > 0 ? props.partsData : []
       
        setresultArray(FilteredData.map((x,i)=>{
            return {...x , index:FilteredData.length -i }
        } ))
        handleFilterChange(partFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.partsData])


    const openNotification = (content, type) => {
        SetMessage(content); SetType(type); setOpenSnack(true);
    }



    const handleRejectDialogClose = () => {
        setRejectDialog(false);
        setRejectPart("");
        setPartsReasonList([]);
    }
   
    const rejectParts = (selRejectReasons,rejectionDesc,BulkData) => { 
        let objarr = []
        if(BulkData){
            BulkData.map((v,idx)=>{
                let rejecttime = new Date(v.time).toISOString();
                let Num = (props.IntrType === 9 ? v.value : idx+1)
                objarr.push(
                    { 
                        entity_id: props.entity_id, 
                        reason_id: selRejectReasons, 
                        quantity: "1", 
                        updated_by: props.userid,
                        created_by: props.userid, 
                        comments: rejectionDesc, 
                        marked_at: rejecttime, 
                        line_id: props.headplantid, 
                        part_number: 'Part ' + Num }
                )
            })
        }else{
            const rejecttime = new Date(rejectPart.time).toISOString();
            objarr = [
                { entity_id: props.entity_id, reason_id: selRejectReasons, quantity: "1", updated_by: props.userid,created_by: props.userid, comments: rejectionDesc, marked_at: rejecttime, line_id: props.headplantid, part_number: 'Part ' + rejectPart.count }
                ]
        }
        
        let temp = {"objects":objarr} 
                   
        getAddQualityDefects(temp)
        // console.log(temp,"temptemptemp")
    }
    
    
    const handleCommentDialogClose = () => {
        setCommentDialog(false);
        setCommentTime('');
    }
    const createComment = (comments) => {
        const comment_time = new Date(commentTime).toISOString(); 
        let temp = { order_id: props.selOrderID, asset_id: props.entity_id, user_id: props.userid, param_comments: newcommentsdata, comments: !comments ? "" : comments, part_completed_time: comment_time, line_id: props.headplantid } 
        addCommnets(temp)
    }

    const addCommnets = async(temp)=>{
        await configParam.RUN_GQL_API(gqlQueries.addPartComments, temp)
        .then((returnData) => {
                if (returnData && returnData.insert_neo_skeleton_prod_part_comments_one) {
                                let data = returnData.insert_neo_skeleton_prod_part_comments_one
                                if (data) {
                                    openNotification('Commented a part produced at ' + moment(commentTime).format('HH:mm:ss'),"success");
                                    // setPartsData(partsData)
                                    handleCommentDialogClose()
                                }
                }
                else {
                                openNotification('Failed to comment a part',"error");
                                handleCommentDialogClose()
                }
                
          })
    } 
    

    const handleReject = (time) => {
        // console.log(time, "propstime")
        setRejectPart(time);
        setRejectDialog(true) 
    }
    const handleComment = (time) => {
        setCommentTime(time); setCommentDialog(true)
    }

    const handleAddData = (data) => {
        console.log(data)
        setParttime(data);
        setAddDataDialog(true)
        if(data.steeldata !== undefined)
            setEdit(true);
    } 
       
    const handleAddDataDialogClose = () => {
        // setFormData({})
        setEdit(false);
        setAddDataDialog(false);
    }

    const PartsFilertOption = [
        { id: "showall", value: "Show All" },
        { id: "goodpart", value: "Good Part" },
        { id: "rejectedparts", value: "Rejected Part" } 

    ]

    const handleExcelDownload = () => {
        if (resultArray && resultArray.length > 0) {
          const excelfilteredData = resultArray.map((value, index) => {
            if (value.value !== "ACTIVE" && value.value !== "Active") {
              let InstrumentId = value.iid;
              let Tag = value.key;
              let Partno=value.index
              let cycletime=value.cycleTime
              let Executiontime = moment(value.time).format("YYYY-MM-DD HH:mm:ss");
              
                           
              return {
                InstrumentId,
                Tag,
                Partno,
                cycletime,
                Executiontime,             
                
              };
            } 
          }).filter(Boolean);
      
          if (excelfilteredData.length > 0) {
            downloadExcel(excelfilteredData, "Exported Data Table");
          }
        }
      };
   
   

    const downloadExcel = (data, name) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name + ".xlsx");
  };

      const handleFilterChange = (type) => { 
            let filteredData
            let partsData = props.partsData.map((x,i)=>{
                return {...x,index:props.partsData.length - i }
            })
            if (type === 'goodpart') {
        filteredData = partsData && partsData.length > 0 ? partsData.filter(obj => !('defect' in obj)) : []
            } else if (type === 'rejectedparts') {
                filteredData = partsData && partsData.length > 0 ? partsData.filter(obj => obj.hasOwnProperty('defect')) : []
            } else {
                filteredData = partsData && partsData.length > 0 ? partsData : []
            }
            setresultArray(filteredData)
            setpartFilter(type)  

    }
    
    const renderRow = ({ index, key, style }) => {
            return (
                <div key={key} style={style} className="row">
    
                    <PartsList
                        expectedCycle={props.oEE ? props.oEE.expCycle : ""}
                        roleid={props.currUserRole}
                        defect={resultArray[index].defect}
                        partCount ={resultArray[index].defect ? resultArray[index].part_count : ""} 
                        time={resultArray[index].time}
                        cycleTime={resultArray[index].cycleTime}
                        comment={resultArray[index].comment}
                        count={props.IntrType === 9 ? resultArray[index].value : ( resultArray[index].index)}
                        handleReject={handleReject}
                        handleComment={handleComment}
                        handleAddData={handleAddData}
                        IntrType={props.IntrType}
                        ProdGroupRange={props.ProdGroupRange}
                        assetType={props.assetType}
                        SteelForm={props.SteelForm}
                        steeldata={resultArray[index].steeldata}
                        assetStatus={props.assetStatusData}
                        total={resultArray.length}
                    />
    
                </div>
            )
        

      

    }
    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setNewCommentsData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };
    const idsToFilter = [2, 18]
    const filteredArrs = props.prodReasonType && props.prodReasonType.length > 0 && props.prodReasonType.filter(x => idsToFilter.includes(x.id))
     function optionChange(e, data, val) { 
        if(e === 1){
            handleExcelDownload()
        }else{
            if(resultArray.length > 0 && !props.loading){
                setRejectDialog(true)
                setRejectPart("");
                setBulkParts(resultArray.filter(f=> !f.defect))
            }else{
                if(props.loading){
                    openNotification('Please wait loading....', 'warning');
                }else{
                    openNotification('No parts to reject', 'warning');
                }
                
            }
        }
        setOpen(false)
        setAnchorPos(null)
    }

    useEffect(()=>{setBulkParts(resultArray.filter(f=> !f.defect))},[resultArray])

    const handleClose = () => {
        setOpen(false)
        setAnchorPos(null)
    };

    const handleClick = (e, type) => {
        setOpen(!open)
        setAnchorPos(e.currentTarget)
    };

    const popperOption = [{ id: 1, name: t("Download"), checked: false }, { id: 2, name: t("Bulk Rejection"), checked: false }]
    return (
        <React.Fragment>
            <ListNDL
                options={popperOption}
                Open={open} 
                optionChange={optionChange}
                keyValue={"name"}
                keyId={"id"}
                id={"popper-parts"}
                onclose={handleClose}
                anchorEl={AnchorPos}
                width="180px"
            />
            <KpiCards fitContent >
                <div >
                    <div className='flex gap-4 justify-between' >
                        <div style={{display:"flex", alignItems: 'center'}}>
                            <TypographyNDL color='secondary' variant="heading-01-xs"   value={t("Parts")} />
                            {props.loading && <div style={{marginLeft: 10}}><CircularProgress /></div>}
                        </div>
                        
                        <div className='flex gap-4 items-center min-w-[176px]'>
                            <SelectBox
                                labelId="downTimeFilter"
                                id="downTimeFilter"
                                auto={false}
                                multiple={false}
                                value={partFilter}
                                options={PartsFilertOption}
                                isMArray={true}
                                checkbox={false}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                keyValue="value"
                                keyId="id"
                            
                            />
                            <Button icon={MoreVertLight} type='ghost' onClick={(e) => handleClick(e)} />
                        </div>
                        
                    </div>
                    <div style={{ height: '902px', overflowY: "hidden", padding:"8px 0px", width: "100%" }}>
                        {
                            resultArray.length > 0 ? (
                                <AutoSizer>
                                    {({ width, height }) => (
                                        <List
                                            width={width}
                                            height={height}
                                            rowHeight={56}
                                            rowRenderer={renderRow}
                                            rowCount={resultArray.length} />

                                    )}
                                </AutoSizer>
                            )
                                :
                                // <KpiCards style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }}>
                                    <div style={{ padding: 16, textAlign: "center" }}>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                    

                                        {
                                           partFilter === "rejectedparts" &&  resultArray.length === 0 ? 
                                            <TypographyNDL variant="lable-01-s" value={t("No Rejected Parts")}/>
                                            :
                                            <TypographyNDL variant="lable-01-s" value={t("noParts")} />
                                        }
                                      
                                    </div>
                                // </KpiCards>
                                }
                    </div>
                </div>
            </KpiCards> 
            <PartReject 
            handleRejectDialogClose={handleRejectDialogClose} 
            rejectDialog={rejectDialog}
            rejectParts={rejectParts}  
            filteredArrs={filteredArrs}
            partsReasonList={partsReasonList}
            openNotification={openNotification}
            rejectPart={rejectPart}
            BulkParts={BulkParts} 

             /> 
          
            <SteelModal
            addDataDialog={AddDataDialog}
            handleAddDataDialogClose={handleAddDataDialogClose}
            ref={AddPartSteelDataRef}
            SteelForm={props.SteelForm}
            partTime={partTime}
            openNotification={openNotification}
            isEdit={isEdit}
            configData={props.configData}
            treiggerOEE={props.treiggerOEE}
            entity_id={props.entity_id}
            latestData={latestData}
            getLatestSteelData={getLatestSteelData}
            />
            <PartCommentDialog
            handleCommentDialogClose={handleCommentDialogClose}
            commentDialog={commentDialog}
            parameters={props.parameters}
            handleCommentChange={handleCommentChange}
            createComment={createComment}
            />
            
                        
        </React.Fragment>
    )
} 
const PartCard = React.forwardRef(PartCardFunction)
export default PartCard;

