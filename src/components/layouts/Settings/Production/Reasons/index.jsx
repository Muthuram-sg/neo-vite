import React, { useState, useEffect } from "react";
import Grid from 'components/Core/GridNDL'
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import { useRecoilState } from "recoil";
import {useParams} from "react-router-dom"
import { selectedPlant, userData, Reasontags, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/plus.svg?react';
import Button from "components/Core/ButtonNDL";
import ModalReasons from "./components/ReasonModal";
import useReasons from "./hooks/useReasons";
import useReasonsType from "./hooks/useReasonsType";
import useAddreasons from "./hooks/useAddreasons";
import useDelreasons from "./hooks/useDelreasons";
import useEditreasons from "./hooks/useEditreasons";
import DowntimeTable from "./components/DowntimeTable";
import QualityTable from "./components/QualityTable";
import PerformanceTable from "./components/PerformanceTable";
import OtherReasonTable from "./components/OtherReasonTable";
import useReasonTags from "./hooks/useReasonTags";
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";


export default function Reasons() {
    const { t } = useTranslation();
    const [currUser] = useRecoilState(userData);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setReasonsDialog] = useState(false);
    const [, setDeleteReasons] = useState({ value: false, index: -1 });
    const [reason, setReason] = useState('');
    const [dialogMode, setDialogMode] = useState('');
    const [OpenSnack, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [checkDatadt, setCheckDatadt] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [, setDelpopup] = useState(false);
    const [, setAlertVisible] = React.useState(false);
    const [dialogbox, setDialogbox] = useState(false);
    const [selectedReasons, setSelectedReasons] = useState();
    const [updatedvalue, setUpdatedvalue] = useState();
    const [reasontags, setreasontags] = useRecoilState(Reasontags)
    const [Tags, setTags] = useState([])
    let {moduleName,subModule2} = useParams()
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const { outRTYLoading, outRTYData, outRTYError, getReasonTypes } = useReasonsType();
    const { ReasonTagsListLoading, ReasonTagsListData, ReasonTagsListError, getReasonTags } = useReasonTags()
    const { addreasonswithoutIDLoading, addreasonswithoutIDData, addreasonswithoutIDError, getaddreasonswithoutID } = useAddreasons()
    const { delreasonswithoutIDLoading, delreasonswithoutIDData, delreasonswithoutIDError, getdelreasonswithoutID } = useDelreasons()
    const { editreasonswithoutIDLoading, editresonswithoutIDData, editreasonswithoutIDError, geteditreasonswithoutID } = useEditreasons()


    useEffect(() => {
        if(dialogMode !== 'delete'){
            getReasons();

        }
        if (headPlant.id && !dialogbox) {
            getReasonTags(headPlant.id)
        }  
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant,dialogbox])  

    useEffect(()=>{
        if(headPlant.id){
            setTimeout(()=>{
                if(moduleName === "reasons" && subModule2 === "quality"){
                    menuItemClick('Quality')
                }
                else if(moduleName === "reasons" && subModule2 === "downtime"){
                    menuItemClick('Downtime')
                }
                else if(moduleName === "reasons" && subModule2 === "performance"){
                    menuItemClick('Performance')
                }
            },1000)
        } 
    },[headPlant])

    useEffect(() => {
        
        if (!outGRLoading && !outGRError && outGRData) {
            var temptags=[]
            temptags =[].concat(...outGRData.map(val => val.reason_tag ? val.reason_tag:[]))
           
       
            setTags(temptags)

            
        
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGRData])
    useEffect(() => {
        if (!ReasonTagsListLoading && !ReasonTagsListError && ReasonTagsListData) {
            setreasontags(ReasonTagsListData)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ReasonTagsListLoading, ReasonTagsListData, ReasonTagsListError])
    setTimeout(() => {
        setAlertVisible(false)
    }, 10000)
    
    
    useEffect(() => {
        if (!editreasonswithoutIDLoading && !editreasonswithoutIDError && editresonswithoutIDData) {
           
            if (editresonswithoutIDData.update_neo_skeleton_prod_reasons.affected_rows >= 1) {
                SetMessage(t("Updated a reason ") + reason)
                SetType("success")
                setOpenSnack(true)
                handleDialogClose();
                setNotificationAnchorEl(null)
                getReasons()
            } else {
                SetMessage(t('Failed to update a reason ') + reason)
                SetType("error")
                setOpenSnack(true)
                handleDialogClose();
                
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editreasonswithoutIDLoading, editreasonswithoutIDError, editresonswithoutIDData])


    useEffect(() => {
        if (!delreasonswithoutIDLoading && !delreasonswithoutIDError && delreasonswithoutIDData) {
        
            if (delreasonswithoutIDData.delete_neo_skeleton_prod_reasons.affected_rows >= 1) {
                SetMessage(t('Deleted a reason ') + reason)
                SetType("success")
                setOpenSnack(true)
                handleDialogClose();
                getReasonTags(headPlant.id)
                getReasons()
            } else {
                SetMessage(t('Sorry,The reason ')+ reason+t('could not be deleted ') )
                SetType("warning")
                setOpenSnack(true)
                handleDialogClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delreasonswithoutIDLoading, delreasonswithoutIDData, delreasonswithoutIDError])
    useEffect(() => {
        if (!addreasonswithoutIDLoading && !addreasonswithoutIDError && addreasonswithoutIDData) {
            
            if (addreasonswithoutIDData.insert_neo_skeleton_prod_reasons_one) {
                SetMessage(t('Added a new reason ') + reason)
                SetType("success")
                setOpenSnack(true);
                handleDialogClose();
                getReasons()
                setNotificationAnchorEl(null)
            } else {
                SetMessage(t('Failed to add a reasons ') + reason)
                SetType("error")
                setOpenSnack(true)
                handleDialogClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addreasonswithoutIDLoading, addreasonswithoutIDError, addreasonswithoutIDData])

   

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getReasonTypes();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleDialogClose = () => {
        setReason("");
        setReasonsDialog(false);
        setDeleteReasons({ value: false, index: -1 })
        setDelpopup(false)
    }
    const handleDialogEdit = (row) => {
        let updatedlist;
        let flag;
        setUpdatedvalue(row)
        setReason(row.reason);
        setDialogMode('edit');
        setDialogbox(true)

        if (row.prod_reason_type.reason_type.split(' ')[1] === undefined) {
            updatedlist = row.prod_reason_type.reason_type.split(' ')[0]
        } else {
            updatedlist = row.prod_reason_type.reason_type.split(' ')[1]
        }

        if(row.prod_reason_type.id === 17 || row.prod_reason_type.id === 2)
        {
            flag = true;
        } else 
        {
            flag = false;
        }
     console.log(row,updatedlist,"row,updatedlist")
        setSelectedReasons(updatedlist)
        setCheckDatadt(flag)
    }
    const createOrder = (e) => {
        setReason(e.value);
        getaddreasonswithoutID(e.value, e.reasonTypedt, currUser.id, headPlant.id, e.include_in_oee, e.reason_tag,Number(e.hmi))
        setSelectedReasons('')
    }
    const deleteTask = (id, tags) => {
        let deletetag=[]
        if (tags.length > 0) {
            // eslint-disable-next-line array-callback-return
            tags.map(t1=>{
            var isdelete = Tags.filter(val => val === t1.id).length 
            if (isdelete=== 1) deletetag.push(t1.id)
        })
        }
        getdelreasonswithoutID(id, headPlant.id , deletetag);
        
    }
    const updateOrder = (e) => {
        // console.log
        geteditreasonswithoutID(e.WOID, e.value, e.reasonTypedt, currUser.id, e.include_in_oee, e.reason_tag,e.hmi ? Number(e.hmi) :  null)
    }
    const menuItemClick = (value) => {
        console.log(value,"value")
        setDialogMode('create')
        setDialogbox(true);
        setSelectedReasons(value)
        setNotificationAnchorEl(null)
    }
    const handleClick = (event) => {
        // setNotificationAnchorEl(event.currentTarget);
        setDialogMode('create')
        setDialogbox(true);
    };

    const deleteTaskfn = (id, row) => {
        let updatedlist
        let flag
        setUpdatedvalue(row)
        setReason(row.reason);
        setDialogMode('delete')
        setDialogbox(true);

        if (row.prod_reason_type.reason_type.split(' ')[1] === undefined) {
            updatedlist = row.prod_reason_type.reason_type.split(' ')[0]
        } else {
            updatedlist = row.prod_reason_type.reason_type.split(' ')[1]
        }

        if(row.prod_reason_type.id === 17 || row.prod_reason_type.id === 2)
        {
            flag = true;
        } else //if(row.prod_reason_type.id === 3 || row.prod_reason_type.id === 18)
        {
            flag = false;
        }

        setSelectedReasons(updatedlist)
        setCheckDatadt(flag)

    }
    const handleTypeChange =(e)=>{
        setSelectedReasons(e.target.value)


    }
    const duplicatetag = (isEmpty) => {  

        if(isEmpty){
            SetMessage(t('Unable to create tag please enter the tag name'))

        }else{
            SetMessage(t('Reason tag already exists'))

        }

        SetType("warning")
        setOpenSnack(true);
    }

    const AccordList=[
        {
            title: t('Downtime') + t('Reasons'),
            expanded: true,
            content: <DowntimeTable
                        handleDialogEdit={handleDialogEdit}
                        deleteTaskfn={deleteTaskfn}
                        isRerender={OpenSnack}
                        headPlant={headPlant.id}
                       
                    />
        },
        {
            title: t('Quality') + t('Reasons'),
            expanded: true,
            content: <QualityTable
                            handleDialogEdit={handleDialogEdit}
                            deleteTaskfn={deleteTaskfn}
                            isRerender={OpenSnack}
                            headPlant={headPlant.id}
                           
                        />
        },
        {
            title: t('Performance ') + t('Reasons'),
            expanded: true,
            content: <PerformanceTable
                            handleDialogEdit={handleDialogEdit}
                            deleteTaskfn={deleteTaskfn}
                            isRerender={OpenSnack}
                            headPlant={headPlant.id}
                          
                        />
        },
        {
            title: t('Other ') + t('Reasons'),
            expanded: true,
            content: <OtherReasonTable
                            handleDialogEdit={handleDialogEdit}
                            deleteTaskfn={deleteTaskfn}
                            isRerender={OpenSnack}
                            headPlant={headPlant.id}
                            
                        />
        },
        
    ]

    const reasonOption=[
        {id:'Downtime',name:t('Downtime')},
        {id:'Quality',name:t('Quality')},
        {id:'Performance',name:t('Performance')},
        {id:'Others',name:t('Others')}
    ]
     

 
      

      
    return (
        <React.Fragment>
            <ModalReasons 
                Dialog={dialogbox}
                dialogfns={(e) => {setDialogbox(e);setSelectedReasons('')}}
                selectedReason={selectedReasons}
                Otherreasonstype={!outRTYLoading && outRTYData && !outRTYError ? outRTYData : []}
                callfunctions={(e) => { createOrder(e); setDialogbox(false);setSelectedReasons('') }}
                callfunctionsupdate={(e) => { updateOrder(e); setDialogbox(false);setSelectedReasons('') }}
                dialogModebox={dialogMode}
                editvalues={updatedvalue}
                deleteselected={(value, tags) => { deleteTask(value, tags); setDialogbox(false);setSelectedReasons('')}}
                duplicatetag={(e)=>{duplicatetag(e)}}
                user={currUser.id}
                headPlant={headPlant.id}
                Reasontags={reasontags ? reasontags : []}
                setreasontags={(e) => setreasontags(e)}
                CheckDatadt = {checkDatadt}
                Tags = {outGRData}
                refreshReasonTag={()=>getReasonTags(headPlant.id)}
                handleTypeChange={handleTypeChange}
            />
            <Grid className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark" container style={{padding:"12px 16px 12px 16px",alignItems:"center"}}>
                <Grid item xs={6}>
                    <TypographyNDL variant="heading-02-xs" model value={t('Reasons')} />   
                </Grid>
                <Grid item xs={6}>
                    <div style={{ float: 'right',marginRight:"8px" }} className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
                        <Button type="tertiary"  value={t("Add Reasons")} onClick={handleClick} icon={Plus} />
                        <ListNDL 
                            options={reasonOption}  
                            Open={notificationAnchorEl}  
                            optionChange={menuItemClick}
                            keyValue={"name"}
                            keyId={"id"}
                            id={"popper-reason-add"}

                            onclose={() => { setNotificationAnchorEl(null) }}
                            anchorEl={notificationAnchorEl}
                            width="140px" 
                        />

                    </div>
                </Grid>
            </Grid>
                <HorizontalLine variant={"divider1"} /> 
                <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
                {
                    AccordList.map((item, index) => (
                        <AccordianNDL1
                            key={index} // Assigning index as the key, assuming AccordList items don't have unique identifiers
                            title={item.title}
                            isexpanded={item.expanded}
                        >
                            <div className="px-4 py-2">
                            {item.content}
                            </div>
                        </AccordianNDL1>
                    ))
                }
                </div>
                    {/* <AccordianNDL Listarray={AccordList}  />  */}
                    

        </React.Fragment>
    );
}